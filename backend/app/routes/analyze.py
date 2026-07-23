import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
try:
    from app.config import settings
    from app.models.schemas import (
        UrlAnalysisRequest, 
        TextAnalysisRequest, 
        EmailAnalysisRequest, 
        AnalysisResult
    )
    from app.analyzers.url_analyzer import UrlAnalyzer
    from app.analyzers.email_analyzer import EmailAnalyzer
    from app.analyzers.text_analyzer import TextAnalyzer
    from app.analyzers.image_analyzer import ImageAnalyzer
    from app.analyzers.qr_analyzer import QrAnalyzer
    from app.analyzers.pdf_analyzer import PdfAnalyzer
    from app.analyzers.voice_analyzer import VoiceAnalyzer
    from app.trust_engine.engine import process_analysis
    from app.utils.db import db_helper
except ImportError:
    from app.config import settings
    from app.models.schemas import (
        UrlAnalysisRequest, 
        TextAnalysisRequest, 
        EmailAnalysisRequest, 
        AnalysisResult
    )
    from app.analyzers.url_analyzer import UrlAnalyzer
    from app.analyzers.email_analyzer import EmailAnalyzer
    from app.analyzers.text_analyzer import TextAnalyzer
    from app.analyzers.image_analyzer import ImageAnalyzer
    from app.analyzers.qr_analyzer import QrAnalyzer
    from app.analyzers.pdf_analyzer import PdfAnalyzer
    from app.analyzers.voice_analyzer import VoiceAnalyzer
    from app.trust_engine.engine import process_analysis
    from app.utils.db import db_helper

logger = logging.getLogger("uvicorn")
router = APIRouter(prefix="/analyze", tags=["Analysis"])

# Instantiate analyzers
url_analyzer = UrlAnalyzer()
email_analyzer = EmailAnalyzer()
text_analyzer = TextAnalyzer()
image_analyzer = ImageAnalyzer()
qr_analyzer = QrAnalyzer()
pdf_analyzer = PdfAnalyzer()
voice_analyzer = VoiceAnalyzer()

@router.post("/url", response_model=AnalysisResult)
async def analyze_url(request: UrlAnalysisRequest):
    try:
        logger.info(f"Analyzing URL target: {request.url}")
        evidence = url_analyzer.analyze(request.url)
        result = process_analysis(request.url, "url", evidence, request.user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in URL analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"URL analysis error: {str(e)}")

@router.post("/text", response_model=AnalysisResult)
async def analyze_text(request: TextAnalysisRequest):
    try:
        logger.info(f"Analyzing text length: {len(request.text)}")
        evidence = text_analyzer.analyze(request.text)
        target = request.text[:100] + ("..." if len(request.text) > 100 else "")
        result = process_analysis(target, "text", evidence, request.user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in text analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"Text analysis error: {str(e)}")

@router.post("/email", response_model=AnalysisResult)
async def analyze_email(request: EmailAnalysisRequest):
    try:
        logger.info(f"Analyzing email from: {request.sender}, subject: {request.subject}")
        email_data = {
            "subject": request.subject,
            "body": request.body,
            "sender": request.sender,
            "headers": request.headers
        }
        evidence = email_analyzer.analyze(email_data)
        target = f"Email: {request.subject or 'No Subject'} (Sender: {request.sender or 'Unknown'})"
        result = process_analysis(target, "email", evidence, request.user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in email analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"Email analysis error: {str(e)}")

@router.post("/image", response_model=AnalysisResult)
async def analyze_image(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing image file: {file.filename}")
        file_bytes = await file.read()
        if len(file_bytes) > settings.MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="Image file exceeds maximum allowable size (25MB).")

        evidence = image_analyzer.analyze(file_bytes, filename=file.filename)
        result = process_analysis(file.filename, "image", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in image analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")

@router.post("/qr", response_model=AnalysisResult)
async def analyze_qr(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing QR Code file: {file.filename}")
        file_bytes = await file.read()
        if len(file_bytes) > settings.MAX_IMAGE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="QR image file exceeds maximum allowable size (25MB).")

        evidence = qr_analyzer.analyze(file_bytes)
        result = process_analysis(file.filename, "qr", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in QR analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"QR analysis error: {str(e)}")

@router.post("/pdf", response_model=AnalysisResult)
async def analyze_pdf(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing PDF file: {file.filename}")
        file_bytes = await file.read()
        if len(file_bytes) > settings.MAX_PDF_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="PDF file exceeds maximum allowable size (50MB).")

        evidence = pdf_analyzer.analyze(file_bytes, filename=file.filename)
        result = process_analysis(file.filename, "pdf", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in PDF analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"PDF analysis error: {str(e)}")

@router.post("/voice", response_model=AnalysisResult)
async def analyze_voice(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing Voice Audio file: {file.filename}")
        file_bytes = await file.read()
        if len(file_bytes) > settings.MAX_AUDIO_SIZE_BYTES:
            raise HTTPException(status_code=400, detail="Voice audio file exceeds maximum allowable size (25MB).")

        evidence = voice_analyzer.analyze(file_bytes, filename=file.filename)
        result = process_analysis(file.filename, "voice", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in voice analysis route: {e}")
        raise HTTPException(status_code=500, detail=f"Voice audio analysis error: {str(e)}")
