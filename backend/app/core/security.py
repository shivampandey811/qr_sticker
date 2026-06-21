import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return password_context.verify(password, hashed)


def hash_activation_code(code: str) -> str:
    normalized = code.strip().upper()
    return hashlib.sha256(f"{settings.jwt_secret}:{normalized}".encode()).hexdigest()


def create_token(subject: str, token_type: str, expires_delta: timedelta, **claims: Any) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": subject, "type": token_type, "iat": now, "exp": now + expires_delta, "jti": secrets.token_urlsafe(12), **claims}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(subject: str, role: str = "user") -> str:
    return create_token(subject, "access", timedelta(minutes=settings.access_token_minutes), role=role)


def create_refresh_token(subject: str, role: str = "user") -> str:
    return create_token(subject, "refresh", timedelta(days=settings.refresh_token_days), role=role)


def create_action_token(subject: str, purpose: str) -> str:
    return create_token(subject, purpose, timedelta(hours=settings.verification_token_hours))


def decode_token(token: str, expected_type: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise ValueError("Invalid or expired token") from exc
    if payload.get("type") != expected_type:
        raise ValueError("Invalid token type")
    return payload

