import json
import logging
from typing import List, Tuple
from backend.app.models.schemas import EvidenceItem, AnalysisResult
from backend.app.utils.gemini import analyze_with_gemini
from datetime import datetime
import uuid

logger = logging.getLogger("uvicorn")

def calculate_trust_score(evidence: List[EvidenceItem]) -> float:
    """
    Calculates the mathematical weighted average of trust scores from the evidence.
    Evidence score is between 0 (very unsafe) and 100 (completely safe).
    Weights are between 0.0 and 1.0.
    """
    if not evidence:
        return 50.0  # Default neutral score
        
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
    Confidence score is based on the quality and completeness of evidence.
    If we have high-weight evidence items with definitive outcomes, confidence is higher.
    We also penalize if there are very few evidence sources.
    """
    if not evidence:
        return 30.0
        
    # Standard base confidence
    base_confidence = 70.0
    
    # Add confidence for more pieces of evidence (up to +20)
    quantity_bonus = min(len(evidence) * 5, 20.0)
    
    # Penalize if critical evidence couldn't be collected (e.g. status='info' but score=50 meaning no data)
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
    based on the target details and mathematical findings.
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

Here is the collected evidence from our scanners:
{evidence_str}

Please generate a professional cybersecurity analysis containing:
1. Explainable AI reasoning detailing WHY we arrived at this score, analyzing security implications.
2. Recommended Action: Actionable next steps for the user (e.g., 'Safe to proceed', 'Do NOT enter credentials', 'Delete file').

Return your answer strictly as a JSON object with exactly two keys: "reasoning" and "recommendation".
Example JSON format:
{{
  "reasoning": "Detailed technical and AI-derived explanation here...",
  "recommendation": "Actionable advice here..."
}}
Do not write any other text besides the JSON.
"""
    
    system_instruction = (
        "You are the Core Trust Assessment Engine of a premium AI Cybersecurity Platform called The Truth Engine. "
        "Your task is to analyze evidence and provide deep, clear, explainable security summaries. "
        "Always return responses in valid JSON format containing 'reasoning' and 'recommendation'."
    )
    
    try:
        response_text = analyze_with_gemini(prompt, system_instruction)
        
        # Clean up code block formatting if any
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1)
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()
        
        data = json.loads(response_text)
        return data.get("reasoning", ""), data.get("recommendation", "")
    except Exception as e:
        logger.error(f"Error parsing Gemini explanation: {e}. Raw response: {response_text if 'response_text' in locals() else 'None'}")
        
        # Safe fallback templates
        if risk_level == "low":
            return (
                f"The target {target} exhibits multiple positive safety indicators. Standard validation checks, domain age, metadata indicators, and structural markers match standard non-threatening properties.",
                "Safe to interact with. Normal precautions apply."
            )
        elif risk_level == "medium":
            return (
                f"The analysis for {target} shows some warnings. While there are no confirmed signatures of malicious behavior, certain indicators (such as recent creation or low reputation history) suggest checking manually.",
                "Proceed with caution. Verify sender identities and links manually."
            )
        else:
            return (
                f"CRITICAL WARNING: The target {target} has failed primary security checks and exhibits high risk patterns. Specific signatures include phishing heuristic alerts, bad reputation reports, or malicious structures.",
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
