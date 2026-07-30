import logging
import io
# pyrefly: ignore [missing-import]
from PIL import Image
from typing import List
try:
    from app.analyzers.base import BaseAnalyzer
    from app.analyzers.url_analyzer import UrlAnalyzer
    from app.models.schemas import EvidenceItem
except ImportError:
    from app.analyzers.base import BaseAnalyzer
    from app.analyzers.url_analyzer import UrlAnalyzer
    from app.models.schemas import EvidenceItem

logger = logging.getLogger("uvicorn")

class QrAnalyzer(BaseAnalyzer):
    def analyze(self, image_bytes: bytes, **kwargs) -> List[EvidenceItem]:
        evidence: List[EvidenceItem] = []
        
        try:
            image = Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            logger.error(f"QR analyzer failed to load image bytes: {e}")
            return [EvidenceItem(
                category="Security",
                title="Corrupted QR Image File",
                description="Unable to parse the uploaded QR image format.",
                status="danger",
                weight=1.0,
                score=0.0
            )]
            
        decoded_text = None
        try:
            # pyrefly: ignore [missing-import]
            from pyzbar.pyzbar import decode
            decoded_objects = decode(image)
            if decoded_objects:
                decoded_text = decoded_objects[0].data.decode("utf-8").strip()
        except Exception as e:
            logger.warning(f"pyzbar decoding failed in QR Analyzer: {e}")
            
        if not decoded_text:
            return [EvidenceItem(
                category="Security",
                title="QR Code Scan Error",
                description="No readable QR code found in the image. Ensure the image is clear and well-lit.",
                status="warning",
                weight=1.0,
                score=50.0
            )]
            
        evidence.append(EvidenceItem(
            category="Security",
            title="QR Code Decoded",
            description=f"Successfully decoded QR payload: '{decoded_text}'",
            status="info",
            weight=0.20,
            score=100.0
        ))
        
        is_url = decoded_text.startswith(("http://", "https://", "www.")) or (
            "." in decoded_text and "/" in decoded_text and not " " in decoded_text
        )
        
        if is_url:
            clean_url = decoded_text
            if not clean_url.startswith(("http://", "https://")):
                clean_url = "https://" + clean_url
                
            logger.info(f"QR payload recognized as URL. Running website scan for: {clean_url}")
            url_scanner = UrlAnalyzer()
            url_evidence = url_scanner.analyze(clean_url)
            
            for item in url_evidence:
                item.weight = item.weight * 0.80
                evidence.append(item)
        else:
            logger.info(f"QR payload recognized as plain text: {decoded_text}")
            evidence.append(EvidenceItem(
                category="AI Analysis",
                title="QR Text Payload Content",
                description=f"The decoded QR content contains raw text data: '{decoded_text}'",
                status="success",
                weight=0.80,
                score=100.0
            ))
            
        return evidence
