import logging
from datetime import datetime
import traceback

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse
from typing import Dict, Optional
from pydantic import BaseModel, EmailStr

from app.utils.auth import create_access_token, decode_access_token, verify_firebase_token
from app.utils.db import db_helper
from app.models.schemas import UserProfile
from app.config import settings

logger = logging.getLogger('uvicorn')
router = APIRouter(prefix='/auth', tags=['Authentication'])


class GoogleAuthPayload(BaseModel):
    uid: str
    name: str
    email: EmailStr
    photoURL: str
    idToken: str


class UserResponse(BaseModel):
    user: UserProfile
    token: str


@router.post('/google', response_model=Dict[str, object])
async def google_auth(payload: GoogleAuthPayload):
    try:
        decoded_token = verify_firebase_token(payload.idToken)
    except Exception:
        logger.error('Firebase verification failed')
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid Firebase credentials.',
        )

    if decoded_token.get('uid') != payload.uid or decoded_token.get('email') != payload.email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Firebase token does not match user info.',
        )

    timestamp = decoded_token.get('iat', 0)
    if isinstance(timestamp, int):
        timestamp_str = datetime.utcfromtimestamp(timestamp).isoformat() + 'Z'
    else:
        timestamp_str = str(timestamp)

    user_doc = {
        'uid': payload.uid,
        'name': payload.name,
        'email': payload.email,
        'photoURL': payload.photoURL,
        'lastLogin': timestamp_str,
    }

    try:
        saved_user = await db_helper.save_or_update_user(user_doc)
    except Exception as exc:
        logger.error(f'Failed saving authenticated user: {exc}')
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Unable to persist user profile.',
        )

    token = create_access_token({'uid': saved_user['uid'], 'email': saved_user['email']})
    response = JSONResponse(content={'user': saved_user, 'token': token})
    response.set_cookie(
        key='truth_engine_session',
        value=token,
        httponly=True,
        secure=settings.APP_ENV == 'production',
        samesite='lax',
        max_age=settings.JWT_EXPIRES_MINUTES * 60,
        path='/',
    )
    return response


def get_token_from_header(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization:
        return None
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == 'bearer':
        return parts[1]
    return None


@router.get('/me', response_model=UserProfile)
async def get_current_user(request: Request, token: Optional[str] = Depends(get_token_from_header)):
    if not token:
        token = request.cookies.get('truth_engine_session')

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Authorization token missing.',
        )

    try:
        payload = decode_access_token(token)
    except Exception as exc:
        logger.warning(f'JWT verification failed: {exc}')
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired token.',
        )

    user = await db_helper.get_user(payload.get('uid'))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User profile not found.',
        )
    return user


@router.post('/logout', status_code=status.HTTP_204_NO_CONTENT)
async def logout_user():
    response = JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={})
    response.delete_cookie('truth_engine_session', path='/')
    return response