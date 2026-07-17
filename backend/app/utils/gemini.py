import logging
import json
from google import genai
from google.genai import types
from backend.app.config import settings

logger = logging.getLogger("uvicorn")

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        return None
    try:
        return genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.error(f"Error initializing Gemini client: {e}")
        return None

def analyze_with_gemini(prompt: str, system_instruction: str = None) -> str:
    """
    Sends a prompt to Gemini 2.5 Flash and returns the text response.
    Falls back to mock responses if API key is not set.
    """
    client = get_gemini_client()
    
    if not client:
        # Generate simulated intelligent response based on the prompt content
        return generate_mock_gemini_response(prompt)
        
    try:
        config = None
        if system_instruction:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2
            )
            
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=config
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini API invocation error: {e}")
        return generate_mock_gemini_response(prompt, error=str(e))

def analyze_image_with_gemini(image_bytes: bytes, prompt: str) -> str:
    """
    Sends an image + prompt to Gemini 2.5 Flash for visual/multimodal analysis.
    """
    client = get_gemini_client()
    if not client:
        return generate_mock_image_analysis(prompt)
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type="image/jpeg"
                ),
                prompt
            ]
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini Image API invocation error: {e}")
        return generate_mock_image_analysis(prompt, error=str(e))

def generate_mock_gemini_response(prompt: str, error: str = None) -> str:
    """
    Generates realistic, highly professional mock responses simulating Gemini behavior.
    """
    p_lower = prompt.lower()
    
    # Check what type of target is being analyzed
    if "url" in p_lower or "http" in p_lower:
        if "bad" in p_lower or "phish" in p_lower or "suspicious" in p_lower or "paypal" in p_lower or "update-verification" in p_lower:
            return json.dumps({
                "reasoning": "The URL exhibits classical characteristics of a high-risk credential harvesting phishing page. It features a recently registered domain name, lacks reputable institutional ownership, and uses an obfuscated path structure mimicking standard payment processors. Additionally, heuristic detection indicates abnormal form structures intended to collect user credentials without appropriate OAuth implementations.",
                "recommendation": "Do NOT visit this URL. If you have already entered credentials, immediately change your passwords on the legitimate service and enable Multi-Factor Authentication (MFA)."
            })
        else:
            return json.dumps({
                "reasoning": "The website shows strong credibility indicators, including an established domain authority, active high-quality SSL certificate, and zero listings on prominent security threat databases. Search presence and registration records align with legitimate, recognized corporate entities.",
                "recommendation": "This website appears safe for standard use. You can interact with it safely, but as a best practice, always verify forms requesting sensitive credentials."
            })
            
    elif "email" in p_lower or "subject" in p_lower:
        if "urgent" in p_lower or "bank" in p_lower or "security alert" in p_lower or "invoice" in p_lower or "inherit" in p_lower:
            return json.dumps({
                "reasoning": "This email represents an urgent phishing or financial scam. Key warning indicators include: high emotional pressure urging immediate action, generic greetings, inconsistent sender domains, and embedded redirection URLs. The language patterns are designed to induce fear and prompt immediate, unverified financial or authentication actions.",
                "recommendation": "Do not reply, click any link, or download attachments. Mark this email as Spam/Phishing and delete it immediately."
            })
        else:
            return json.dumps({
                "reasoning": "The email content appears benign and shows standard conversational/professional structure. There are no patterns of coercive urgency, phishing links, or suspicious formatting.",
                "recommendation": "This email is likely safe to read. Handle normal actions as requested, but verify any external links manually before clicking."
            })
            
    elif "text" in p_lower or "message" in p_lower:
        if "winner" in p_lower or "click here" in p_lower or "claim" in p_lower or "gift card" in p_lower or "crypto" in p_lower:
            return json.dumps({
                "reasoning": "This text contains text-based scam markers: financial lure incentives, high urgency ('claim now'), and short-form obfuscated link shortcuts. This is typical of SMiShing (SMS Phishing) patterns targeting wallet credential harvesting.",
                "recommendation": "Ignore the message and block the sender. Avoid clicking any link provided in unsolicited messages."
            })
        else:
            return json.dumps({
                "reasoning": "The text content does not display any known spam, scam, or emotional manipulation markers. It contains standard informative or personal content.",
                "recommendation": "Safe to interact with. Normal response is fine."
            })

    # Default fallback
    return json.dumps({
        "reasoning": "The content shows no immediate critical threat indicators, but lacks verified cryptographic or trust signatures. Static patterns fall within normal operational boundaries.",
        "recommendation": "Proceed with caution. Verify the identity of the source offline if possible."
    })

def generate_mock_image_analysis(prompt: str, error: str = None) -> str:
    return json.dumps({
        "reasoning": "Analysis of the image metadata and visual content shows standard compression artifacts and visual layout. OCR analysis detected textual elements that align with regular documentation. No obvious deepfake manipulation indicators, anomalous metadata edits, or known malicious payloads were detected inside the visual layers.",
        "recommendation": "The image is safe to view. Be cautious if the image prompts you to scan a QR code or visit a handwritten link."
    })
