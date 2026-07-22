import logging
import re
import json
from typing import List, Dict, Any
try:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_with_gemini
except ImportError:
    from backend.app.analyzers.base import BaseAnalyzer
    from backend.app.models.schemas import EvidenceItem
    from backend.app.utils.gemini import analyze_with_gemini

logger = logging.getLogger("uvicorn")

class EmailAnalyzer(BaseAnalyzer):
    def analyze(self, email_data: Dict[str, Any], **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        body = email_data.get("body", "")
        sender = email_data.get("sender", "")
        subject = email_data.get("subject", "")
        headers = email_data.get("headers", "")
        
        sender_evidence = self._check_sender(sender)
        evidence.append(sender_evidence)
        
        links_evidence = self._check_links(body)
        evidence.append(links_evidence)
        
        scam_evidence = self._check_scam_language(subject, body, headers, sender)
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
        freemails = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com", "zoho.com", "protonmail.com"]
        if domain in freemails:
            return EvidenceItem(
                category="Reputation",
                title="Public/Free Email Sender",
                description=f"Sent from public freemail domain (@{domain}). Enterprise alerts rarely originate from public webmail.",
                status="warning",
                weight=0.25,
                score=60.0
            )
        else:
            return EvidenceItem(
                category="Reputation",
                title="Private/Custom Domain Sender",
                description=f"The email originates from a custom domain: @{domain}.",
                status="success",
                weight=0.25,
                score=95.0
            )
            
    def _check_links(self, body: str) -> EvidenceItem:
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
        for link in links:
            if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', link):
                score -= 30.0
                reasons.append("Contains raw IP address URLs")
            if any(ext in link.lower() for ext in [".zip", ".exe", ".scr", ".rar"]):
                score -= 40.0
                reasons.append("Links directly to executable or compressed archives")
            if any(term in link.lower() for term in ["login", "verify", "secure", "update-bank"]):
                score -= 15.0
                reasons.append("Links point to hosts with credential harvesting keywords")
                
        score = max(score, 0.0)
        status = "success" if score == 100.0 else ("warning" if score >= 60.0 else "danger")
        desc = f"Contains {len(links)} embedded link(s). " + (f"Warnings: {'; '.join(list(set(reasons)))}" if reasons else "Clean link structure.")
            
        return EvidenceItem(
            category="Security",
            title="Email Hyperlinks Analysis",
            description=desc,
            status=status,
            weight=0.25,
            score=score
        )
        
    def _check_scam_language(self, subject: str, body: str, headers: str, sender: str = "") -> EvidenceItem:
        prompt = f"""
Analyze the following email details for scam patterns, threat levels, emotional coercion, and phishing indicators.

Subject: {subject}
Sender: {sender or 'Unknown'}
Headers: {headers}
Email Body:
---
{body}
---

Provide a security assessment of this email language. Output your response strictly as a JSON object with keys "score" (0-100) and "findings".
"""
        system_instruction = "You are an AI Email Security Analyst. Analyze emails for phishing and coercion markers. Return JSON only."
        
        try:
            response_text = analyze_with_gemini(prompt, system_instruction)
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 50.0))
            findings = data.get("findings", "AI analysis completed.")
            status = "success" if score >= 80.0 else ("warning" if score >= 50.0 else "danger")
                
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
            score = 100.0
            reasons = []
            for word in ["urgent", "action required", "immediate", "suspend", "verify your account", "winner"]:
                if word in body.lower() or word in subject.lower():
                    score -= 25.0
                    reasons.append(f"Contains coercive keyword '{word}'")
            score = max(score, 0.0)
            status = "success" if score == 100.0 else ("warning" if score >= 60.0 else "danger")
            findings = f"Static keyword flags: {', '.join(reasons)}" if reasons else "No urgent keyword warnings flagged."
            return EvidenceItem(
                category="AI Analysis",
                title="AI Language Semantics (Fallback)",
                description=findings,
                status=status,
                weight=0.50,
                score=score
            )
