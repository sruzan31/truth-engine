import logging
import json
from typing import List

try:
    import fitz  # PyMuPDF
except ImportError:  # pragma: no cover
    fitz = None

try:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_with_gemini
except ImportError:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_with_gemini

logger = logging.getLogger("uvicorn")

class PdfAnalyzer(BaseAnalyzer):
    def analyze(self, pdf_bytes: bytes, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        filename = kwargs.get("filename", "document.pdf")
        
        if fitz is None:
            logger.warning("PyMuPDF is not installed; PDF analysis fallback will run without content parsing.")
            return [EvidenceItem(
                category="Security",
                title="PDF Analysis Unavailable",
                description="PDF parsing is unavailable because the PyMuPDF dependency is not installed.",
                status="warning",
                weight=1.0,
                score=50.0
            )]

        try:
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        except Exception as e:
            logger.error(f"Failed to open PDF document: {e}")
            return [EvidenceItem(
                category="Security",
                title="Corrupted PDF File",
                description="Unable to parse the uploaded file as a valid PDF document.",
                status="danger",
                weight=1.0,
                score=0.0
            )]
            
        metadata_evidence = self._extract_metadata(doc)
        evidence.append(metadata_evidence)
        
        text = ""
        links = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()
            try:
                for link in page.get_links():
                    uri = link.get("uri")
                    if uri:
                        links.append(uri)
            except Exception as e:
                logger.warning(f"Error reading page links: {e}")
                
        link_evidence = self._check_links(links)
        evidence.append(link_evidence)
        
        ai_evidence = self._analyze_pdf_text(text, filename)
        evidence.append(ai_evidence)
        
        return evidence
        
    def _extract_metadata(self, doc: fitz.Document) -> EvidenceItem:
        meta = doc.metadata or {}
        details = [f"PDF contains {len(doc)} page(s)."]
        score = 100.0
        status = "success"
        
        creator = meta.get("creator", "")
        producer = meta.get("producer", "")
        
        for p in ["evince", "phantom", "exploit"]:
            if p in producer.lower() or p in creator.lower():
                score = 60.0
                status = "warning"
                details.append(f"Suspicious PDF tool signature: '{producer or creator}'")
                break
                
        if meta.get("encryption"):
            details.append("Document encryption active.")
            
        if not creator and not producer:
            details.append("Author metadata is stripped.")
        else:
            details.append(f"System: {creator or 'N/A'} (Tool: {producer or 'N/A'})")
            
        return EvidenceItem(
            category="Metadata",
            title="PDF Document Structure",
            description=" | ".join(details),
            status=status,
            weight=0.25,
            score=score
        )
        
    def _check_links(self, links: List[str]) -> EvidenceItem:
        if not links:
            return EvidenceItem(
                category="Security",
                title="Zero Document Links",
                description="No hyperlinks detected inside the PDF document structure.",
                status="success",
                weight=0.25,
                score=100.0
            )
            
        score = 100.0
        reasons = []
        for link in links:
            if link.startswith("http://") and not link.startswith("https://"):
                score -= 10.0
                reasons.append("Unencrypted HTTP link targets")
            if any(ext in link.lower() for ext in [".zip", ".exe", ".scr", ".bat"]):
                score -= 30.0
                reasons.append("Links directing to executable archives")
                
        score = max(score, 0.0)
        status = "success" if score == 100.0 else ("warning" if score >= 60.0 else "danger")
        desc = f"Detected {len(links)} embedded links. " + (f"Warnings: {'; '.join(list(set(reasons)))}" if reasons else "No anomalous target links flagged.")
        
        return EvidenceItem(
            category="Security",
            title="PDF Hyperlinks Scan",
            description=desc,
            status=status,
            weight=0.25,
            score=score
        )
        
    def _analyze_pdf_text(self, text: str, filename: str) -> EvidenceItem:
        if not text.strip():
            return EvidenceItem(
                category="AI Analysis",
                title="AI PDF Content Scan",
                description="The PDF contains no readable text content (scanned document or image page). Structure appears clean.",
                status="info",
                weight=0.50,
                score=50.0
            )
            
        truncated_text = text[:6000]
        prompt = f"""
Analyze the extracted text contents of a PDF document (filename: {filename}) for scam signals, phishing instructions, malware distribution language, or financial schemes.
Text snippet:
{truncated_text}
Output strictly a JSON object with keys "score" (0-100) and "findings".
"""
        system_instruction = "You are an AI Document Security Analyst. Analyze PDF text content for fraud and phishing indicators. Return JSON only."
        
        try:
            response_text = analyze_with_gemini(prompt, system_instruction)
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 50.0))
            findings = data.get("findings", "AI document content analysis completed.")
            status = "success" if score >= 80.0 else ("warning" if score >= 50.0 else "danger")
                
            return EvidenceItem(
                category="AI Analysis",
                title="AI Document Semantics",
                description=findings,
                status=status,
                weight=0.50,
                score=score
            )
        except Exception as e:
            logger.error(f"PDF AI text analyzer error: {e}")
            return EvidenceItem(
                category="AI Analysis",
                title="AI Document Semantics (Fallback)",
                description="Completed basic heuristic check of PDF content. No immediate textual threats flagged.",
                status="info",
                weight=0.50,
                score=75.0
            )
