import logging
import re
from typing import List, Dict, Any
from backend.app.analyzers.base import BaseAnalyzer
from backend.app.models.schemas import EvidenceItem
from backend.app.utils.gemini import analyze_with_gemini
import json

logger = logging.getLogger("uvicorn")

class EmailAnalyzer(BaseAnalyzer):
    def analyze(self, email_data: Dict[str, Any], **kwargs) -> List[EvidenceItem]:
        """
        email_data structure:
        {
            "subject": str,
            "body": str,
            "sender": str,
            "headers": str (optional)
        }
        """
        evidence: List[EvidenceItem] = []
        body = email_data.get("body", "")
        sender = email_data.get("sender", "")
        subject = email_data.get("subject", "")
        headers = email_data.get("headers", "")
        
        # 1. Sender Domain Verification
        sender_evidence = self._check_sender(sender)
        evidence.append(sender_evidence)
        
        # 2. Embedded Links Inspection
        links_evidence = self._check_links(body)
        evidence.append(links_evidence)
        
        # 3. AI Scam Language Analysis
        scam_evidence = self._check_scam_language(subject, body, headers)
        evidence.append(scam_evidence)
        
        return evidence
        
    def _check_sender(self, sender: str) -> EvidenceItem:
        if not sender:
            return EvidenceItem(
                category="Reputation",
                title="Unknown Sender Identity",
                description="No sender address provided. Visual authenticity cannot be verified.",
                status="warning",
                weight=0.25,
                score=50.0
            )
            
        sender = sender.strip()
        email_pattern = re.compile(r"[\w\.-]+@([\w\.-]+\.\w+)")
        match = email_pattern.search(sender)
        
        if not match:
            return EvidenceItem(
                category="Reputation",
                title="Invalid Sender Email Format",
                description=f"The sender format '{sender}' appears structurally invalid.",
                status="danger",
                weight=0.25,
                score=20.0
            )
            
        domain = match.group(1).lower()
        
        # Check for common free email providers
        freemails = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "zoho.com", "protonmail.com", "mail.com"]
        if domain in freemails:
            return EvidenceItem(
                category="Reputation",
                title="Public/Free Email Sender",
                description=f"The email is sent from a public freemail domain ({domain}). Official correspondence from banks, governments, or enterprises never arrives from public addresses.",
                status="warning",
                weight=0.25,
                score=60.0
            )
        else:
            return EvidenceItem(
                category="Reputation",
                title="Private/Custom Domain Sender",
                description=f"The email originates from a private domain: @{domain}.",
                status="success",
                weight=0.25,
                score=95.0
            )
            
    def _check_links(self, body: str) -> EvidenceItem:
        # Regex to find links (http/https or clean domains)
        url_pattern = re.compile(r'https?://[^\s<>"]+|www\.[^\s<>"]+')
        links = url_pattern.findall(body)
        
        if not links:
            return EvidenceItem(
                category="Security",
                title="Zero Embedded Links",
                description="No hyperlinks detected inside the email body.",
                status="success",
                weight=0.25,
                score=100.0
            )
            
        score = 100.0
        reasons = []
        suspicious_domains = []
        
        for link in links:
            # Check for raw IP address links
            if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', link):
                score -= 30.0
                reasons.append("Contains raw IP address URLs")
                
            # Check for suspicious link extensions
            if any(ext in link.lower() for ext in [".zip", ".exe", ".scr", ".rar", ".pif"]):
                score -= 40.0
                reasons.append("Directly links to executable or compressed archives")
                
            # Check for subdomains of phishing indicators
            if any(term in link.lower() for term in ["login", "verify", "secure", "update-bank"]):
                score -= 15.0
                reasons.append("Links point to hosts with suspicious security/credential tags")
                
        score = max(score, 0.0)
        
        if score == 100.0:
            status = "success"
            desc = f"Contains {len(links)} embedded link(s). No immediate structural anomalies detected in link paths."
        elif score >= 60.0:
            status = "warning"
            desc = f"Contains {len(links)} link(s). Warnings detected: {'; '.join(list(set(reasons)))}"
        else:
            status = "danger"
            desc = f"High-risk links detected: {'; '.join(list(set(reasons)))}"
            
        return EvidenceItem(
            category="Security",
            title="Email Hyperlinks Analysis",
            description=desc,
            status=status,
            weight=0.25,
            score=score
        )
        
    def _check_scam_language(self, subject: str, body: str, headers: str) -> EvidenceItem:
        prompt = f"""
Analyze the following email details for scam patterns, threat levels, emotional coercion, and phishing indicators.

Subject: {subject}
Sender: {kwargs.get('sender', 'Unknown')}
Headers: {headers}
Email Body:
---
{body}
---

Provide a security assessment of this email language. Check for:
- Coercive urgency (e.g., 'your account will be closed in 24 hours')
- Direct requests for sensitive info or money
- Fake invoices or false rewards
- Suspicious grammar or formatting anomalies

Output your response strictly as a JSON object with two keys:
1. "score" (integer between 0 and 100, where 0 is highly dangerous/scam and 100 is completely safe/legitimate)
2. "findings" (short description summarizing your assessment)

Example JSON response:
{{
  "score": 15,
  "findings": "Urgent coercive language requesting verification of bank details immediately. High indicators of phishing."
}}
Do not write any markdown code block wrap, only raw JSON.
"""
        system_instruction = (
            "You are an AI Email Security Analyst. Analyze emails strictly for scam, phishing, and coercion markers. "
            "Return JSON only."
        )
        
        try:
            response_text = analyze_with_gemini(prompt, system_instruction)
            
            # Clean response text
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 50.0))
            findings = data.get("findings", "AI analysis completed.")
            
            if score >= 80.0:
                status = "success"
            elif score >= 50.0:
                status = "warning"
            else:
                status = "danger"
                
            return EvidenceItem(
                category="AI Analysis",
                title="AI Language Semantics",
                description=findings,
                status=status,
                weight=0.50,
                score=score
            )
        except Exception as e:
            logger.error(f"Email scam language AI analyzer error: {e}")
            
            # Heuristic fallback if Gemini fails
            score = 100.0
            reasons = []
            
            urgency_words = ["urgent", "action required", "immediate", "suspend", "unauthorized", "verify your account", "winner", "inheritance"]
            for word in urgency_words:
                if word in body.lower() or word in subject.lower():
                    score -= 25.0
                    reasons.append(f"Contains coercive keyword '{word}'")
                    
            score = max(score, 0.0)
            status = "success" if score == 100.0 else ("warning" if score >= 60.0 else "danger")
            findings = f"Static keyword scans flags: {', '.join(reasons)}" if reasons else "No urgent keyword warnings flagged."
            
            return EvidenceItem(
                category="AI Analysis",
                title="AI Language Semantics (Heuristic Fallback)",
                description=findings,
                status=status,
                weight=0.50,
                score=score
            )
