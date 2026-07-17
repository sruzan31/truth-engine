from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class EvidenceItem(BaseModel):
    category: str = Field(..., description="Category of the evidence (e.g., Security, Reputation, AI, Metadata)")
    title: str = Field(..., description="Short title of findings")
    description: str = Field(..., description="Detailed explanation of findings")
    status: str = Field(..., description="Status indicating danger level: 'success', 'info', 'warning', or 'danger'")
    weight: float = Field(..., description="Percentage weight of this evidence in the final score (0.0 to 1.0)")
    score: float = Field(..., description="Score for this evidence component (0 to 100)")

class AnalysisResult(BaseModel):
    scan_id: str
    scan_type: str  # url, email, text, image, qr, pdf
    target: str     # The analyzed target (URL string, file name, text snippet)
    trust_score: float = Field(..., ge=0, le=100)
    risk_level: str  # low, medium, high, critical
    confidence_score: float = Field(..., ge=0, le=100)
    reasoning: str
    recommendation: str
    evidence: List[EvidenceItem]
    created_at: str
    user_id: Optional[str] = None

class UrlAnalysisRequest(BaseModel):
    url: str
    user_id: Optional[str] = None

class TextAnalysisRequest(BaseModel):
    text: str
    user_id: Optional[str] = None

class EmailAnalysisRequest(BaseModel):
    subject: Optional[str] = ""
    body: str
    sender: Optional[str] = ""
    headers: Optional[str] = ""
    user_id: Optional[str] = None
