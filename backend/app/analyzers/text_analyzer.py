import logging
from typing import List
import json
try:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_with_gemini
except ImportError:
    from backend.app.analyzers.base import BaseAnalyzer
    from backend.app.models.schemas import EvidenceItem
    from backend.app.utils.gemini import analyze_with_gemini

logger = logging.getLogger("uvicorn")

class TextAnalyzer(BaseAnalyzer):
    def analyze(self, text: str, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        ai_evidence = self._check_text_semantics(text)
        evidence.append(ai_evidence)
        return evidence
        
    def _check_text_semantics(self, text: str) -> EvidenceItem:
        prompt = f"""
Analyze the following text snippet for safety, digital trust, scam signatures, disinformation, or emotional manipulation:

Text Snippet:
---
{text}
---

Please perform a thorough risk assessment:
1. Are there signs of phishing, SMiShing, or cyber scam templates?
2. Does the text use high emotional manipulation (fear, extreme urgency, pressure)?
3. Are there clear factual errors or misinformation markers?

Output your response strictly as a JSON object with two keys:
1. "score" (integer between 0 and 100, where 0 is highly dangerous/scam and 100 is completely safe/trustworthy)
2. "findings" (short description summarizing your assessment)

Example JSON response:
{{
  "score": 85,
  "findings": "The text contains a standard informational update. No manipulative triggers or scam signatures detected."
}}
Do not write any markdown code block wrap, only raw JSON.
"""
        system_instruction = (
            "You are an AI Text Trust and Security Analyst. Assess short-form and long-form text inputs "
            "for manipulation, fraud, or spam patterns. Return JSON only."
        )
        
        try:
            response_text = analyze_with_gemini(prompt, system_instruction)
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 50.0))
            findings = data.get("findings", "Text content analysis completed.")
            
            if score >= 80.0:
                status = "success"
            elif score >= 50.0:
                status = "warning"
            else:
                status = "danger"
                
            return EvidenceItem(
                category="AI Analysis",
                title="Semantic Analysis",
                description=findings,
                status=status,
                weight=1.0,
                score=score
            )
        except Exception as e:
            logger.error(f"Text semantics AI analyzer error: {e}")
            score = 100.0
            reasons = []
            scam_triggers = ["congratulations", "gift card", "claim now", "double your crypto", "irs agent", "verify now"]
            for trigger in scam_triggers:
                if trigger in text.lower():
                    score -= 30.0
                    reasons.append(f"Scam term detected: '{trigger}'")
                    
            score = max(score, 0.0)
            status = "success" if score == 100.0 else ("warning" if score >= 60.0 else "danger")
            findings = f"Static scam keywords triggered: {', '.join(reasons)}" if reasons else "The text does not trigger standard static scam patterns."
            
            return EvidenceItem(
                category="AI Analysis",
                title="Semantic Analysis (Heuristic Fallback)",
                description=findings,
                status=status,
                weight=1.0,
                score=score
            )
