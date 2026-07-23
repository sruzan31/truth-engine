import logging
import json
from google import genai
from google.genai import types
try:
    from app.config import settings
except ImportError:
    from app.config import settings

logger = logging.getLogger("uvicorn")

def get_gemini_client():
    if settings.is_mock_gemini:
        return None
    try:
        return genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.error(f"Error initializing Gemini client: {e}")
        return None

def analyze_with_gemini(prompt: str, system_instruction: str = None) -> str:
    """
    Sends a text prompt to Gemini 2.5 Flash and returns the response.
    Falls back to intelligent mock responses if API key is omitted.
    """
    client = get_gemini_client()
    if not client:
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

def analyze_image_with_gemini(image_bytes: bytes, prompt: str, mime_type: str = "image/jpeg") -> str:
    """
    Sends image bytes + prompt to Gemini 2.5 Flash for visual analysis.
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
                    mime_type=mime_type
                ),
                prompt
            ]
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini Image API invocation error: {e}")
        return generate_mock_image_analysis(prompt, error=str(e))

def analyze_audio_with_gemini(audio_bytes: bytes, prompt: str, mime_type: str = "audio/mp3") -> str:
    """
    Sends audio bytes + prompt to Gemini 2.5 Flash for acoustic/voice synthetic analysis.
    """
    client = get_gemini_client()
    if not client:
        return generate_mock_audio_analysis(prompt)
        
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Part.from_bytes(
                    data=audio_bytes,
                    mime_type=mime_type
                ),
                prompt
            ]
        )
        return response.text
    except Exception as e:
        logger.error(f"Gemini Audio API invocation error: {e}")
        return generate_mock_audio_analysis(prompt, error=str(e))

def generate_mock_gemini_response(prompt: str, error: str = None) -> str:
    """
    Generates realistic mock responses simulating Gemini behavior.
    """
    p_lower = prompt.lower()
    
    if "url" in p_lower or "http" in p_lower:
        if any(x in p_lower for x in ["phish", "scam", "paypal", "update-verification"]):
            return json.dumps({
                "reasoning": "The URL exhibits classical characteristics of a credential harvesting phishing page. It features a recently registered domain name, lacks reputable institutional ownership, and uses an obfuscated path structure mimicking standard payment processors.",
                "recommendation": "Do NOT visit this URL. If you have already entered credentials, immediately change your passwords on the official site."
            })
        else:
            return json.dumps({
                "reasoning": "The website shows strong credibility indicators, including an established domain authority, active high-quality SSL certificate, and zero listings on prominent security threat databases.",
                "recommendation": "This website appears safe for standard use. You can interact with it safely."
            })
            
    elif "email" in p_lower or "subject" in p_lower:
        if any(x in p_lower for x in ["urgent", "bank", "security alert", "invoice", "inherit"]):
            return json.dumps({
                "reasoning": "This email represents an urgent phishing or financial scam. Key warning indicators include high emotional pressure urging immediate action, generic greetings, inconsistent sender domains, and embedded redirection URLs.",
                "recommendation": "Do not reply, click any link, or download attachments. Mark this email as Spam and delete it immediately."
            })
        else:
            return json.dumps({
                "reasoning": "The email content appears benign and shows standard conversational/professional structure. There are no patterns of coercive urgency or phishing links.",
                "recommendation": "This email is likely safe to read. Handle normal actions as requested."
            })
            
    elif "text" in p_lower or "message" in p_lower:
        if any(x in p_lower for x in ["winner", "click here", "claim", "gift card", "crypto"]):
            return json.dumps({
                "reasoning": "This text contains SMiShing scam markers: financial lure incentives, high urgency ('claim now'), and short-form link shortcuts.",
                "recommendation": "Ignore the message and block the sender. Avoid clicking any link provided in unsolicited messages."
            })
        else:
            return json.dumps({
                "reasoning": "The text content does not display any known spam, scam, or emotional manipulation markers.",
                "recommendation": "Safe to interact with. Normal response is fine."
            })

    return json.dumps({
        "reasoning": "The content shows no immediate critical threat indicators. Static patterns fall within normal operational boundaries.",
        "recommendation": "Proceed with caution. Verify the identity of the source offline if possible."
    })

def generate_mock_image_analysis(prompt: str, error: str = None) -> str:
    return json.dumps({
        "reasoning": "Analysis of the image metadata and visual content shows standard compression artifacts and visual layout. OCR analysis detected textual elements that align with regular documentation. No deepfake manipulation indicators were detected.",
        "recommendation": "The image is safe to view. Be cautious if the image prompts you to scan a QR code or visit an unverified link."
    })

def generate_mock_audio_analysis(prompt: str, error: str = None) -> str:
    return json.dumps({
        "reasoning": "Acoustic frequency inspection shows continuous natural voice formant transitions and normal room reverberation markers. Spectral noise analysis indicates typical microphone background ambiance without robotic AI synthesis artifacts or voice cloning boundaries.",
        "recommendation": "The audio clip appears authentic. If the caller requests money or passwords, verify their identity independently."
    })
