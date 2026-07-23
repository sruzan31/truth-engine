import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, Optional

import firebase_admin
import jwt
from firebase_admin import auth as firebase_auth, credentials

try:
    from app.config import settings
except ImportError:
    from app.config import settings

logger = logging.getLogger('uvicorn')

FIREBASE_APP = None

def init_firebase_app() -> firebase_auth:
    global FIREBASE_APP
    if FIREBASE_APP is not None:
        return firebase_auth

    if settings.FIREBASE_SERVICE_ACCOUNT_PATH:
        cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    elif settings.FIREBASE_SERVICE_ACCOUNT_JSON:
        cred = credentials.Certificate(json.loads(settings.FIREBASE_SERVICE_ACCOUNT_JSON))
    else:
        raise RuntimeError('Firebase service account credentials are not configured.')

    firebase_admin.initialize_app(cred)
    FIREBASE_APP = firebase_auth
    return firebase_auth


def verify_firebase_token(id_token: str) -> Dict[str, Any]:
    auth_client = init_firebase_app()
    try:
        decoded_token = auth_client.verify_id_token(id_token)
        if not decoded_token.get('uid'):
            raise ValueError('Invalid Firebase token payload.')
        return decoded_token
    except Exception as exc:
        logger.warning(f'Firebase token verification failed: {exc}')
        raise


def create_access_token(data: Dict[str, Any]) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRES_MINUTES)
    payload.update({'exp': expire, 'iat': datetime.utcnow()})
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise
    except jwt.InvalidTokenError as exc:
        logger.warning(f'Invalid JWT token: {exc}')
        raise
