import logging
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import Optional
from backend.app.models.schemas import (
    UrlAnalysisRequest, 
    TextAnalysisRequest, 
    EmailAnalysisRequest, 
    AnalysisResult
)
from backend.app.analyzers.url_analyzer import UrlAnalyzer
from backend.app.analyzers.email_analyzer import EmailAnalyzer
from backend.app.analyzers.text_analyzer import TextAnalyzer
from backend.app.analyzers.image_analyzer import ImageAnalyzer
from backend.app.analyzers.qr_analyzer import QrAnalyzer
from backend.app.analyzers.pdf_analyzer import PdfAnalyzer
from backend.app.trust_engine.engine import process_analysis
from backend.app.utils.db import db_helper

logger = logging.getLogger("uvicorn")
router = APIRouter(prefix="/analyze", tags=["Analysis"])

# Instantiate scanners
url_analyzer = UrlAnalyzer()
email_analyzer = EmailAnalyzer()
text_analyzer = TextAnalyzer()
image_analyzer = ImageAnalyzer()
qr_analyzer = QrAnalyzer()
pdf_analyzer = PdfAnalyzer()

@router.post("/url", response_model=AnalysisResult)
async def analyze_url(request: UrlAnalysisRequest):
    try:
        logger.info(f"Analyzing URL: {request.url}")
        evidence = url_analyzer.analyze(request.url)
        result = process_analysis(request.url, "url", evidence, request.user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in URL analysis route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text", response_model=AnalysisResult)
async def analyze_text(request: TextAnalysisRequest):
    try:
        logger.info(f"Analyzing text length: {len(request.text)}")
        evidence = text_analyzer.analyze(request.text)
        # For display in report, use a snippet of the text
        target = request.text[:100] + ("..." if len(request.text) > 100 else "")
        result = process_analysis(target, "text", evidence, request.user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in text analysis route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/image", response_model=AnalysisResult)
async def analyze_image(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing image file: {file.filename}")
        file_bytes = await file.read()
        evidence = image_analyzer.analyze(file_bytes, filename=file.filename)
        result = process_analysis(file.filename, "image", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in image analysis route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/qr", response_model=AnalysisResult)
async def analyze_qr(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing QR Code file: {file.filename}")
        file_bytes = await file.read()
        evidence = qr_analyzer.analyze(file_bytes)
        result = process_analysis(file.filename, "qr", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in QR analysis route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/pdf", response_model=AnalysisResult)
async def analyze_pdf(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    try:
        logger.info(f"Analyzing PDF file: {file.filename}")
        file_bytes = await file.read()
        evidence = pdf_analyzer.analyze(file_bytes, filename=file.filename)
        result = process_analysis(file.filename, "pdf", evidence, user_id)
        await db_helper.save_scan(result)
        return result
    except Exception as e:
        logger.error(f"Error in PDF analysis route: {e}")
        raise HTTPException(status_code=500, detail=str(e))
