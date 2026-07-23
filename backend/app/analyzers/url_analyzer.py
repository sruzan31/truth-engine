import logging
import re
import socket
from urllib.parse import urlparse
import datetime
from typing import List
import requests
try:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.config import settings
except ImportError:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.config import settings

logger = logging.getLogger("uvicorn")

class UrlAnalyzer(BaseAnalyzer):
    def analyze(self, url: str, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        
        # Clean URL
        if not url.startswith(("http://", "https://")):
            url = "https://" + url
            
        parsed_url = urlparse(url)
        domain = parsed_url.netloc or parsed_url.path.split("/")[0]
        
        # 1. HTTPS Check
        ssl_evidence = self._check_https(parsed_url)
        evidence.append(ssl_evidence)
        
        # 2. Phishing Heuristics
        heuristics_evidence = self._check_heuristics(parsed_url, domain)
        evidence.append(heuristics_evidence)
        
        # 3. Domain Age (WHOIS)
        whois_evidence = self._check_domain_age(domain)
        evidence.append(whois_evidence)
        
        # 4. VirusTotal
        vt_evidence = self._check_virustotal(url)
        evidence.append(vt_evidence)
        
        # 5. Safe Browsing
        sb_evidence = self._check_safe_browsing(url)
        evidence.append(sb_evidence)
        
        return evidence
        
    def _check_https(self, parsed_url) -> EvidenceItem:
        if parsed_url.scheme == "https":
            return EvidenceItem(
                category="Security",
                title="HTTPS Protocol",
                description="The website uses secure, encrypted HTTPS transmission.",
                status="success",
                weight=0.15,
                score=100.0
            )
        else:
            return EvidenceItem(
                category="Security",
                title="Unencrypted HTTP Connection",
                description="The website uses HTTP. Traffic can be intercepted, read, or modified by attackers.",
                status="danger",
                weight=0.15,
                score=20.0
            )
            
    def _check_heuristics(self, parsed_url, domain: str) -> EvidenceItem:
        score = 100.0
        reasons = []
        
        # Check for suspicious keywords in domain or path
        suspicious_words = ["verify", "secure", "update", "login", "signin", "bank", "paypal", "wallet", "support", "billing"]
        matching_words = [w for w in suspicious_words if w in domain.lower()]
        if matching_words:
            score -= len(matching_words) * 15.0
            reasons.append(f"Domain contains highly-targeted brand/trust terms: {', '.join(matching_words)}")
            
        # Check for too many subdomains (subdomain inflation)
        subdomains = domain.split(".")
        if len(subdomains) > 3:
            score -= 20.0
            reasons.append("Abnormal level of subdomains (subdomain inflation / camouflage)")
            
        # Check for hyphens in domain name (common in phishing)
        if "-" in domain:
            score -= 10.0
            reasons.append("Contains hyphens in host domain name, which is common in spoofing")
            
        # Check for IP address as host name
        ip_pattern = re.compile(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
        if ip_pattern.match(domain):
            score -= 40.0
            reasons.append("Uses raw IP address as domain host instead of resolved hostname")
            
        score = max(score, 0.0)
        
        if score == 100.0:
            status = "success"
            desc = "No suspicious URL heuristic patterns detected."
        elif score >= 70.0:
            status = "warning"
            desc = f"Minor warnings: {'; '.join(reasons)}"
        else:
            status = "danger"
            desc = f"Suspicious layout: {'; '.join(reasons)}"
            
        return EvidenceItem(
            category="Reputation",
            title="URL Heuristics",
            description=desc,
            status=status,
            weight=0.20,
            score=score
        )
        
    def _check_domain_age(self, domain: str) -> EvidenceItem:
        if settings.is_mock_gemini and "example" in domain:
            return EvidenceItem(
                category="Reputation",
                title="Domain Age (WHOIS)",
                description="Domain is registered (Simulated: 5 years old).",
                status="success",
                weight=0.20,
                score=100.0
            )
            
        try:
            import whois
            domain_parts = domain.split(".")
            if len(domain_parts) > 2:
                lookup_domain = ".".join(domain_parts[-2:])
            else:
                lookup_domain = domain
                
            w = whois.whois(lookup_domain)
            creation_date = w.creation_date
            
            if isinstance(creation_date, list):
                creation_date = creation_date[0]
                
            if creation_date:
                age_days = (datetime.datetime.now() - creation_date).days
                if age_days > 365:
                    return EvidenceItem(
                        category="Reputation",
                        title="Domain Registration Age",
                        description=f"Domain is established. Registration age is {age_days} days (approx. {age_days // 365} years).",
                        status="success",
                        weight=0.20,
                        score=100.0
                    )
                elif age_days > 90:
                    return EvidenceItem(
                        category="Reputation",
                        title="New Domain Registration",
                        description=f"Domain is relatively new. Registration age is {age_days} days.",
                        status="warning",
                        weight=0.20,
                        score=60.0
                    )
                else:
                    return EvidenceItem(
                        category="Reputation",
                        title="Highly Recent Domain Registration",
                        description=f"Domain is brand new (registered {age_days} days ago). Extremely typical of phishing setups.",
                        status="danger",
                        weight=0.20,
                        score=25.0
                    )
            else:
                raise Exception("No creation date returned")
        except Exception as e:
            logger.warning(f"WHOIS lookup failed for {domain}: {e}")
            return EvidenceItem(
                category="Reputation",
                title="Domain Age (WHOIS Lookup)",
                description="Unable to verify domain age via public WHOIS queries. Status unconfirmed.",
                status="info",
                weight=0.20,
                score=50.0
            )

    def _check_virustotal(self, url: str) -> EvidenceItem:
        if settings.is_mock_virustotal:
            score = 100.0
            status = "success"
            desc = "VirusTotal report (Simulated): 0 engines flag this URL as malicious."
            
            if any(x in url.lower() for x in ["phish", "scam", "paypal-update", "sec-verification"]):
                score = 10.0
                status = "danger"
                desc = "VirusTotal report (Simulated): 14 engines flagged this URL as Phishing/Malicious."
                
            return EvidenceItem(
                category="Security",
                title="VirusTotal Threat Intelligence",
                description=desc,
                status=status,
                weight=0.25,
                score=score
            )
            
        try:
            import base64
            url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
            headers = {"x-apikey": settings.VIRUSTOTAL_API_KEY}
            response = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers, timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                stats = data.get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
                malicious = stats.get("malicious", 0)
                suspicious = stats.get("suspicious", 0)
                
                if malicious > 0:
                    score = max(100.0 - (malicious * 30.0 + suspicious * 10.0), 0.0)
                    status = "danger"
                    desc = f"VirusTotal flagged this URL! Detected by {malicious} engine(s) as malicious and {suspicious} engine(s) as suspicious."
                elif suspicious > 0:
                    score = 70.0
                    status = "warning"
                    desc = f"VirusTotal flagged some warnings. Detected by {suspicious} engine(s) as suspicious."
                else:
                    score = 100.0
                    status = "success"
                    desc = "VirusTotal returned clean scan records. 0 engines flag this URL."
            else:
                score = 50.0
                status = "info"
                desc = f"VirusTotal scan endpoint returned response status code {response.status_code}."
        except Exception as e:
            logger.error(f"VirusTotal lookup error: {e}")
            score = 50.0
            status = "info"
            desc = "Unable to connect to VirusTotal threat database."
            
        return EvidenceItem(
            category="Security",
            title="VirusTotal Threat Analysis",
            description=desc,
            status=status,
            weight=0.25,
            score=score
        )

    def _check_safe_browsing(self, url: str) -> EvidenceItem:
        if settings.is_mock_safebrowsing:
            score = 100.0
            status = "success"
            desc = "Google Safe Browsing (Simulated): URL is clean."
            
            if any(x in url.lower() for x in ["phish", "scam", "paypal-update", "sec-verification"]):
                score = 0.0
                status = "danger"
                desc = "Google Safe Browsing (Simulated): URL is listed on threat database for PHISHING."
                
            return EvidenceItem(
                category="Security",
                title="Google Safe Browsing",
                description=desc,
                status=status,
                weight=0.20,
                score=score
            )
            
        try:
            api_url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={settings.SAFE_BROWSING_API_KEY}"
            payload = {
                "client": {"clientId": "the-truth-engine", "clientVersion": "1.0.0"},
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": url}]
                }
            }
            response = requests.post(api_url, json=payload, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if "matches" in data and len(data["matches"]) > 0:
                    match = data["matches"][0]
                    threat_type = match.get("threatType", "threat")
                    score = 0.0
                    status = "danger"
                    desc = f"Google Safe Browsing reports this site is unsafe! Classified as: {threat_type}."
                else:
                    score = 100.0
                    status = "success"
                    desc = "Google Safe Browsing report checks out clean. Site is not registered on unsafe listings."
            else:
                score = 50.0
                status = "info"
                desc = f"Safe Browsing API returned non-OK status: {response.status_code}."
        except Exception as e:
            logger.error(f"Google Safe Browsing API error: {e}")
            score = 50.0
            status = "info"
            desc = "Unable to verify URL status with Google Safe Browsing database."
            
        return EvidenceItem(
            category="Security",
            title="Google Safe Browsing",
            description=desc,
            status=status,
            weight=0.20,
            score=score
        )
