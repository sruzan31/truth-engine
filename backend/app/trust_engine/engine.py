import json
import logging
from typing import List, Tuple
from datetime import datetime
import uuid
try:
    from app.models.schemas import EvidenceItem, AnalysisResult
    from app.utils.gemini import analyze_with_gemini
except ImportError:
    from backend.app.models.schemas import EvidenceItem, AnalysisResult
    from backend.app.utils.gemini import analyze_with_gemini

logger = logging.getLogger("uvicorn")

def calculate_trust_score(evidence: List[EvidenceItem]) -> float:
    """
    Calculates the mathematical weighted average of trust scores from the evidence.
    Evidence score is between 0 (very unsafe) and 100 (completely safe).
    Weights are between 0.0 and 1.0.
    """
    if not evidence:
        return 50.0
        
    total_weighted_score = 0.0
    total_weight = 0.0
    
    for item in evidence:
        total_weighted_score += item.score * item.weight
        total_weight += item.weight
        
    if total_weight == 0.0:
        return 50.0
        
    return round(total_weighted_score / total_weight, 1)

def determine_risk_level(trust_score: float) -> str:
    if trust_score >= 80.0:
        return "low"
    elif trust_score >= 50.0:
        return "medium"
    elif trust_score >= 25.0:
        return "high"
    else:
        return "critical"

def calculate_confidence_score(evidence: List[EvidenceItem]) -> float:
    """
    Calculates confidence rating based on quantity and quality of findings.
    """
    if not evidence:
        return 30.0
        
    base_confidence = 70.0
    quantity_bonus = min(len(evidence) * 5, 20.0)
    info_items = [e for e in evidence if e.status == 'info' and e.score == 50.0]
    completeness_penalty = len(info_items) * 6.0
    
    final_confidence = base_confidence + quantity_bonus - completeness_penalty
    return max(min(final_confidence, 100.0), 10.0)

def generate_ai_explanation(
    target: str,
    scan_type: str,
    trust_score: float,
    risk_level: str,
    evidence: List[EvidenceItem]
) -> Tuple[str, str]:
    """
    Invokes Gemini to generate explainable AI reasoning and recommended actions
    based on the target details and findings.
    """
    evidence_summary = []
    for item in evidence:
        evidence_summary.append(
            f"- [{item.category}] {item.title}: Score {item.score}/100, Status {item.status.upper()}. Details: {item.description}"
        )
        
    evidence_str = "\n".join(evidence_summary)
    
    prompt = f"""
Analyze the security report for the following target:
Target Content: {target}
Scan Type: {scan_type}
Calculated Trust Score: {trust_score}/100
Calculated Risk Level: {risk_level.upper()}

Collected evidence:
{evidence_str}

Please generate a professional cybersecurity analysis containing:
1. Explainable AI reasoning detailing WHY we arrived at this score, analyzing security implications.
2. Recommended Action: Actionable next steps for the user.

Return your answer strictly as a JSON object with exactly two keys: "reasoning" and "recommendation".
Example JSON format:
{{
  "reasoning": "Detailed technical explanation...",
  "recommendation": "Actionable advice..."
}}
Do not write any other text besides the JSON.
"""
    
    system_instruction = (
        "You are the Core Trust Assessment Engine of a premium AI Cybersecurity Platform called The Truth Engine. "
        "Provide deep, clear, explainable security summaries. Return responses in valid JSON only."
    )
    
    try:
        response_text = analyze_with_gemini(prompt, system_instruction)
        
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1)
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        data = json.loads(response_text)
        return data.get("reasoning", ""), data.get("recommendation", "")
    except Exception as e:
        logger.error(f"Error parsing Gemini explanation: {e}")
        
        if risk_level == "low":
            return (
                f"The target {target} exhibits multiple positive safety indicators matching standard non-threatening properties.",
                "Safe to interact with. Normal precautions apply."
            )
        elif risk_level == "medium":
            return (
                f"The analysis for {target} shows some warnings requiring manual verification.",
                "Proceed with caution. Verify sender identities and links manually."
            )
        else:
            return (
                f"CRITICAL WARNING: The target {target} has failed primary security checks and exhibits high risk patterns.",
                "Do NOT interact with this target. Block, quarantine, or discard immediately."
            )

def process_analysis(
    target: str,
    scan_type: str,
    evidence: List[EvidenceItem],
    user_id: str = None
) -> AnalysisResult:
    """
    Primary execution function of the Trust Engine. Evaluates evidence lists,
    calculates trust parameters, invokes Gemini explanation, and returns the formal report.
    """
    trust_score = calculate_trust_score(evidence)
    risk_level = determine_risk_level(trust_score)
    confidence_score = calculate_confidence_score(evidence)
    
    reasoning, recommendation = generate_ai_explanation(
        target, scan_type, trust_score, risk_level, evidence
    )
    
    return AnalysisResult(
        scan_id=str(uuid.uuid4()),
        scan_type=scan_type,
        target=target,
        trust_score=trust_score,
        risk_level=risk_level,
        confidence_score=confidence_score,
        reasoning=reasoning,
        recommendation=recommendation,
        evidence=evidence,
        created_at=datetime.utcnow().isoformat() + "Z",
        user_id=user_id
    )
