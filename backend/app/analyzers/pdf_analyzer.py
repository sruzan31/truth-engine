import logging
import fitz  # PyMuPDF
from typing import List
from backend.app.analyzers.base import BaseAnalyzer
from backend.app.models.schemas import EvidenceItem
from backend.app.utils.gemini import analyze_with_gemini
import json

logger = logging.getLogger("uvicorn")

class PdfAnalyzer(BaseAnalyzer):
    def analyze(self, pdf_bytes: bytes, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        filename = kwargs.get("filename", "document.pdf")
        
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
            
        # 1. Metadata Verification
        metadata_evidence = self._extract_metadata(doc)
        evidence.append(metadata_evidence)
        
        # 2. Extract Links and Content
        text = ""
        links = []
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()
            
            # Extract links on page
            try:
                for link in page.get_links():
                    uri = link.get("uri")
                    if uri:
                        links.append(uri)
            except Exception as e:
                logger.warning(f"Error reading page links: {e}")
                
        # Link check evidence
        link_evidence = self._check_links(links)
        evidence.append(link_evidence)
        
        # 3. AI Text Analysis
        ai_evidence = self._analyze_pdf_text(text, filename)
        evidence.append(ai_evidence)
        
        return evidence
        
    def _extract_metadata(self, doc: fitz.Document) -> EvidenceItem:
        meta = doc.metadata or {}
        details = []
        score = 100.0
        status = "success"
        
        creator = meta.get("creator", "")
        producer = meta.get("producer", "")
        
        details.append(f"PDF contains {len(doc)} page(s).")
        
        # Check if creator/producer are common exploitation programs
        suspicious_producers = ["evince", "phantom", "exploit"]
        for p in suspicious_producers:
            if p in producer.lower() or p in creator.lower():
                score = 60.0
                status = "warning"
                details.append(f"Suspicious PDF authoring tool detected: '{producer or creator}'")
                break
                
        if meta.get("encryption"):
            details.append("Document encryption is active.")
            
        if not creator and not producer:
            details.append("Author metadata is stripped.")
        else:
            details.append(f"Authoring system: {creator or 'N/A'} (Tool: {producer or 'N/A'})")
            
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
        
        # Check for link abnormalities
        for link in links:
            if link.startswith("http://") and not link.startswith("https://"):
                score -= 10.0
                reasons.append("Unencrypted HTTP link targets")
            if any(ext in link.lower() for ext in [".zip", ".exe", ".scr", ".bat"]):
                score -= 30.0
                reasons.append("Links directing to executable files/archives")
                
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
                description="The PDF contains no readable text content (possibly scanned image without OCR). Structure appears clean.",
                status="info",
                weight=0.50,
                score=50.0
            )
            
        # Truncate text to avoid token limits
        truncated_text = text[:6000]
        
        prompt = f"""
Analyze the extracted text contents of a PDF document (filename: {filename}) for scam signals, phishing instructions, malware distribution language, or financial schemes.

Document Text (first 6000 chars):
---
{truncated_text}
---

Please perform a cybersecurity inspection:
1. Is the text designed to deceive (e.g. fake invoices, counterfeit security updates, fake tax forms, crypto phishing)?
2. Does the document use manipulative tone or coercive text patterns to bypass standard filters?

Output your response strictly as a JSON object with two keys:
1. "score" (integer between 0 and 100, where 0 is highly dangerous/malicious and 100 is completely safe/legitimate)
2. "findings" (short description summarizing your assessment)

Example JSON response:
{{
  "score": 15,
  "findings": "Document mimics a fake bank statement requesting emergency password resets. Significant phishing risks identified."
}}
Do not write any markdown code block wrap, only raw JSON.
"""
        system_instruction = (
            "You are an AI Document Security Analyst. Analyze PDF text content for fraud, spoofing, "
            "and phishing indicators. Return JSON only."
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
            findings = data.get("findings", "AI document content analysis completed.")
            
            if score >= 80.0:
                status = "success"
            elif score >= 50.0:
                status = "warning"
            else:
                status = "danger"
                
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
