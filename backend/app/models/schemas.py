from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class EvidenceItem(BaseModel):
    category: str = Field(..., description="Category of evidence (e.g., Security, Reputation, AI Analysis, Metadata)")
    title: str = Field(..., description="Short summary title of evidence finding")
    description: str = Field(..., description="Detailed explanation of finding")
    status: str = Field(..., description="Safety status: 'success', 'info', 'warning', or 'danger'")
    weight: float = Field(..., ge=0.0, le=1.0, description="Percentage weight in score calculation")
    score: float = Field(..., ge=0.0, le=100.0, description="Score for component (0 to 100)")

class AnalysisResult(BaseModel):
    scan_id: str = Field(..., description="Unique UUID scan identifier")
    scan_type: str = Field(..., description="Vector type: 'url', 'email', 'text', 'image', 'qr', 'pdf', 'voice'")
    target: str = Field(..., description="Target URL, file name, or text excerpt")
    trust_score: float = Field(..., ge=0.0, le=100.0, description="Overall trust score (0 to 100)")
    risk_level: str = Field(..., description="Risk tier: 'low', 'medium', 'high', 'critical'")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence rating (0 to 100)")
    reasoning: str = Field(..., description="Explainable AI verdict reasoning")
    recommendation: str = Field(..., description="Actionable security recommendation")
    evidence: List[EvidenceItem] = Field(default_factory=list, description="Array of evidence check items")
    created_at: str = Field(..., description="ISO 8601 UTC timestamp")
    user_id: Optional[str] = Field(None, description="Optional user identifier")

class UrlAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, description="Target URL to inspect")
    user_id: Optional[str] = None

class TextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Raw text snippet to analyze")
    user_id: Optional[str] = None

class EmailAnalysisRequest(BaseModel):
    subject: Optional[str] = ""
    body: str = Field(..., min_length=1, description="Email body content")
    sender: Optional[str] = ""
    headers: Optional[str] = ""
    user_id: Optional[str] = None

class ErrorResponse(BaseModel):
    detail: str = Field(..., description="Error message details")
    status_code: int = Field(..., description="HTTP status code")
    error_type: str = Field(..., description="Type of exception")
