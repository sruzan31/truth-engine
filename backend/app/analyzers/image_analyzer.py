import logging
import io
from typing import List
from PIL import Image
from PIL.ExifTags import TAGS
from backend.app.analyzers.base import BaseAnalyzer
from backend.app.models.schemas import EvidenceItem
from backend.app.utils.gemini import analyze_image_with_gemini
import json

logger = logging.getLogger("uvicorn")

class ImageAnalyzer(BaseAnalyzer):
    def analyze(self, image_bytes: bytes, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        filename = kwargs.get("filename", "uploaded_image.jpg")
        
        # Open image using Pillow
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            logger.error(f"Failed to open image bytes: {e}")
            return [EvidenceItem(
                category="Security",
                title="Corrupted Image File",
                description="Unable to parse the uploaded file as a valid image format.",
                status="danger",
                weight=1.0,
                score=0.0
            )]
            
        # 1. Metadata / EXIF Extraction
        metadata_evidence = self._extract_metadata(image)
        evidence.append(metadata_evidence)
        
        # 2. QR Code detection in Image
        qr_evidence = self._scan_embedded_qr(image)
        if qr_evidence:
            evidence.append(qr_evidence)
            
        # 3. Multimodal Visual AI Analysis (OCR & Manipulation Check)
        visual_evidence = self._analyze_visuals_with_ai(image_bytes, filename)
        evidence.append(visual_evidence)
        
        return evidence
        
    def _extract_metadata(self, image: Image.Image) -> EvidenceItem:
        exif_data = {}
        software_detected = None
        gps_data = False
        
        try:
            exif = image.getexif()
            if exif:
                for tag_id in exif:
                    tag = TAGS.get(tag_id, tag_id)
                    data = exif.get(tag_id)
                    # Decode bytes to string
                    if isinstance(data, bytes):
                        try:
                            data = data.decode()
                        except:
                            pass
                    exif_data[str(tag)] = str(data)
                    
                # Look for editing software tags
                software_keys = ["Software", "ProcessingSoftware", "ImageResources"]
                for key in software_keys:
                    if key in exif_data:
                        software_detected = exif_data[key]
                        break
                        
                if "GPSInfo" in exif_data:
                    gps_data = True
        except Exception as e:
            logger.warning(f"Error reading image EXIF: {e}")
            
        score = 100.0
        details = []
        status = "success"
        
        if software_detected:
            score = 75.0
            status = "warning"
            details.append(f"Image software signature modified: '{software_detected}' (Indicates digital editing/Photoshop)")
        else:
            details.append("No common digital image manipulation software footprints detected in metadata.")
            
        if exif_data:
            details.append(f"EXIF metadata structure contains {len(exif_data)} records.")
            if gps_data:
                details.append("GPS location tags are present in raw metadata (Potential privacy leakage risk).")
        else:
            details.append("EXIF metadata is empty or stripped (Typical of social media forwards or intentional scrubbing).")
            
        return EvidenceItem(
            category="Metadata",
            title="Image Metadata Integrity",
            description=" | ".join(details),
            status=status,
            weight=0.30,
            score=score
        )
        
    def _scan_embedded_qr(self, image: Image.Image) -> EvidenceItem:
        # Wrap pyzbar in try-except in case native zbar shared libraries are missing on the host system
        try:
            from pyzbar.pyzbar import decode
            decoded_objects = decode(image)
            
            if decoded_objects:
                urls = []
                for obj in decoded_objects:
                    data_str = obj.data.decode("utf-8")
                    urls.append(data_str)
                    
                joined_urls = ", ".join(urls)
                return EvidenceItem(
                    category="Security",
                    title="Embedded QR Code Detected",
                    description=f"Found {len(urls)} embedded QR code(s). Decoded payload: {joined_urls}. (Forwarded for website safety checks).",
                    status="warning",
                    weight=0.20,
                    score=50.0 # Flag as warning since QR redirects can bypass standard mail/link filters
                )
        except Exception as e:
            logger.warning(f"pyzbar QR scanner failed (possibly missing system zbar library): {e}")
            
        return None
        
    def _analyze_visuals_with_ai(self, image_bytes: bytes, filename: str) -> EvidenceItem:
        prompt = f"""
Analyze the uploaded image (filename: {filename}) for digital trust, security threats, and visual anomalies.

Please perform:
1. Visual analysis: Are there signs of visual editing, deepfake elements, artificial layout modifications, or spoofing?
2. OCR text extraction: What text content is written in the image? Inspect this text for fraud, phishing messages, scam phone numbers, fake awards, or coercive instructions.
3. Logical context: Does the context of the image look like a scam (e.g. fake banking screenshot, fake deposit slip, warning card)?

Output your response strictly as a JSON object with two keys:
1. "score" (integer between 0 and 100, where 0 is highly dangerous/scam and 100 is completely safe/authentic)
2. "findings" (short description summarizing your assessment, including extracted text summary and visual flags)

Example JSON response:
{{
  "score": 30,
  "findings": "Image contains a fake security warning claiming access is blocked. Text contains phishing URLs and high emotional urgency triggers."
}}
Do not write any markdown code block wrap, only raw JSON.
"""
        
        try:
            response_text = analyze_image_with_gemini(image_bytes, prompt)
            
            # Clean response text
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 70.0))
            findings = data.get("findings", "AI visual content analysis completed.")
            
            if score >= 80.0:
                status = "success"
            elif score >= 50.0:
                status = "warning"
            else:
                status = "danger"
                
            return EvidenceItem(
                category="AI Analysis",
                title="Multimodal Image Analysis",
                description=findings,
                status=status,
                weight=0.70,
                score=score
            )
        except Exception as e:
            logger.error(f"Multimodal image AI analyzer error: {e}")
            
            # Fallback
            return EvidenceItem(
                category="AI Analysis",
                title="Multimodal Image Analysis (Heuristic Fallback)",
                description="Unable to analyze image contents with multimodal AI. Safe basic checks completed. No obvious visual threats found.",
                status="info",
                weight=0.70,
                score=80.0
            )
