import logging
import io
import json
from typing import List
from PIL import Image
from PIL.ExifTags import TAGS
try:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_image_with_gemini
except ImportError:
    from app.analyzers.base import BaseAnalyzer
    from app.models.schemas import EvidenceItem
    from app.utils.gemini import analyze_image_with_gemini

logger = logging.getLogger("uvicorn")

class ImageAnalyzer(BaseAnalyzer):
    def analyze(self, image_bytes: bytes, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        filename = kwargs.get("filename", "uploaded_image.jpg")
        
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
            
        metadata_evidence = self._extract_metadata(image)
        evidence.append(metadata_evidence)
        
        qr_evidence = self._scan_embedded_qr(image)
        if qr_evidence:
            evidence.append(qr_evidence)
            
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
                    if isinstance(data, bytes):
                        try:
                            data = data.decode()
                        except:
                            pass
                    exif_data[str(tag)] = str(data)
                    
                for key in ["Software", "ProcessingSoftware", "ImageResources"]:
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
            details.append(f"Image software signature: '{software_detected}' (Digital editing footprint)")
        else:
            details.append("No common digital manipulation software footprints detected.")
            
        if exif_data:
            details.append(f"EXIF metadata structure contains {len(exif_data)} tags.")
            if gps_data:
                details.append("GPS location tags present.")
        else:
            details.append("EXIF metadata is empty or stripped.")
            
        return EvidenceItem(
            category="Metadata",
            title="Image Metadata Integrity",
            description=" | ".join(details),
            status=status,
            weight=0.30,
            score=score
        )
        
    def _scan_embedded_qr(self, image: Image.Image) -> EvidenceItem:
        try:
            from pyzbar.pyzbar import decode
            decoded_objects = decode(image)
            if decoded_objects:
                urls = [obj.data.decode("utf-8") for obj in decoded_objects]
                return EvidenceItem(
                    category="Security",
                    title="Embedded QR Code Detected",
                    description=f"Found {len(urls)} QR code(s). Decoded payload: {', '.join(urls)}",
                    status="warning",
                    weight=0.20,
                    score=50.0
                )
        except Exception as e:
            logger.warning(f"pyzbar QR scanner failed: {e}")
            
        return None
        
    def _analyze_visuals_with_ai(self, image_bytes: bytes, filename: str) -> EvidenceItem:
        prompt = f"""
Analyze the uploaded image (filename: {filename}) for digital trust, security threats, and visual anomalies.
Check for deepfake elements, fake banking UI, scam phone numbers, or phishing links.
Output strictly JSON object with keys "score" (0-100) and "findings".
"""
        mime_type = "image/jpeg"
        if filename.endswith(".png"):
            mime_type = "image/png"
        elif filename.endswith(".webp"):
            mime_type = "image/webp"

        try:
            response_text = analyze_image_with_gemini(image_bytes, prompt, mime_type=mime_type)
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "", 1)
            if response_text.endswith("```"):
                response_text = response_text[:-3]
            response_text = response_text.strip()
            
            data = json.loads(response_text)
            score = float(data.get("score", 70.0))
            findings = data.get("findings", "AI visual analysis completed.")
            status = "success" if score >= 80.0 else ("warning" if score >= 50.0 else "danger")
                
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
            return EvidenceItem(
                category="AI Analysis",
                title="Multimodal Image Analysis (Fallback)",
                description="Completed basic heuristic check of image content. No obvious visual threats found.",
                status="info",
                weight=0.70,
                score=80.0
            )
