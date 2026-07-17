import logging
import io
from PIL import Image
from typing import List
from backend.app.analyzers.base import BaseAnalyzer
from backend.app.analyzers.url_analyzer import UrlAnalyzer
from backend.app.models.schemas import EvidenceItem

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
            from pyzbar.pyzbar import decode
            decoded_objects = decode(image)
            if decoded_objects:
                decoded_text = decoded_objects[0].data.decode("utf-8").strip()
        except Exception as e:
            logger.warning(f"pyzbar decoding failed in QR Analyzer: {e}")
            
        if not decoded_text:
            # If pyzbar fails or returns nothing, we can try to fall back to Gemini's visual QR recognition
            # but as a fail-safe heuristic, check if a text-based input was passed as target
            return [EvidenceItem(
                category="Security",
                title="QR Code Scan Error",
                description="No readable QR code found in the image. Ensure the image is clear and well-lit.",
                status="warning",
                weight=1.0,
                score=50.0
            )]
            
        # Add QR scan success evidence
        evidence.append(EvidenceItem(
            category="Security",
            title="QR Code Decoded",
            description=f"Successfully decoded QR payload: '{decoded_text}'",
            status="info",
            weight=0.20,
            score=100.0
        ))
        
        # Check if the QR payload is a URL
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
            
            # Merge URL evidence with the QR code metadata
            # Adjust weights to account for QR shell
            for item in url_evidence:
                item.weight = item.weight * 0.80  # Scale down slightly to keep total weight close to 1.0
                evidence.append(item)
        else:
            # QR code contains non-URL plain text, evaluate as text
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
