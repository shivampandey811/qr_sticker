from datetime import datetime, timezone
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.api.dependencies import get_current_user
from app.core.database import get_database
from app.core.security import create_access_token, create_action_token, create_refresh_token, decode_token, hash_password, verify_password
from app.models.common import serialize_document, utc_now
from app.schemas.auth import ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, RefreshRequest, RegisterRequest, ResetPasswordRequest, TokenResponse
from app.schemas.common import MessageResponse
from app.services.audit import write_audit
from app.services.email import send_action_email


router = APIRouter(prefix="/auth", tags=["Authentication"])


def safe_user(user: dict) -> dict:
    serialized = serialize_document(user) or {}
    for field in ("password_hash", "fcm_tokens"):
        serialized.pop(field, None)
    return serialized


@router.post("/register", response_model=MessageResponse, status_code=201)
async def register(payload: RegisterRequest, background_tasks: BackgroundTasks) -> MessageResponse:
    db = get_database()
    document = {
        "name": payload.name,
        "email": payload.email.lower(),
        "mobile": payload.mobile,
        "whatsapp": payload.whatsapp,
        "password_hash": hash_password(payload.password),
        "role": "user",
        "email_verified": False,
        "is_active": True,
        "fcm_tokens": [],
        "created_at": utc_now(),
        "updated_at": utc_now(),
    }
    try:
        result = await db.users.insert_one(document)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="Email or mobile number is already registered")
    token = create_action_token(str(result.inserted_id), "verify_email")
    background_tasks.add_task(send_action_email, document["email"], "Verify your CarPing email", "verify-email", token)
    await write_audit("register", "user", str(result.inserted_id), str(result.inserted_id))
    return MessageResponse(message="Registration successful. Please verify your email.")


@router.get("/verify-email", response_model=MessageResponse)
async def verify_email(token: str) -> MessageResponse:
    try:
        payload = decode_token(token, "verify_email")
        user_id = ObjectId(payload["sub"])
    except (ValueError, KeyError):
        raise HTTPException(status_code=400, detail="Invalid or expired verification link")
    result = await get_database().users.update_one({"_id": user_id}, {"$set": {"email_verified": True, "updated_at": utc_now()}})
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="User not found")
    return MessageResponse(message="Email verified successfully")


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest) -> TokenResponse:
    user = await get_database().users.find_one({"email": payload.email.lower(), "is_active": True})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    if not user.get("email_verified"):
        raise HTTPException(status_code=403, detail="Verify your email before signing in")
    user_id = str(user["_id"])
    await write_audit("login", "user", user_id, user_id)
    return TokenResponse(access_token=create_access_token(user_id, user["role"]), refresh_token=create_refresh_token(user_id, user["role"]), user=safe_user(user))


@router.post("/refresh", response_model=TokenResponse)
async def refresh(payload: RefreshRequest) -> TokenResponse:
    try:
        claims = decode_token(payload.refresh_token, "refresh")
        user = await get_database().users.find_one({"_id": ObjectId(claims["sub"]), "is_active": True})
    except (ValueError, KeyError):
        user = None
    if not user:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user_id = str(user["_id"])
    return TokenResponse(access_token=create_access_token(user_id, user["role"]), refresh_token=create_refresh_token(user_id, user["role"]), user=safe_user(user))


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(payload: ForgotPasswordRequest, background_tasks: BackgroundTasks) -> MessageResponse:
    user = await get_database().users.find_one({"email": payload.email.lower(), "is_active": True})
    if user:
        token = create_action_token(str(user["_id"]), "reset_password")
        background_tasks.add_task(send_action_email, user["email"], "Reset your CarPing password", "reset-password", token)
    return MessageResponse(message="If the account exists, a reset link has been sent.")


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest) -> MessageResponse:
    try:
        claims = decode_token(payload.token, "reset_password")
        user_id = ObjectId(claims["sub"])
    except (ValueError, KeyError):
        raise HTTPException(status_code=400, detail="Invalid or expired reset link")
    await get_database().users.update_one({"_id": user_id}, {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": utc_now()}})
    await write_audit("password_reset", "user", str(user_id), str(user_id))
    return MessageResponse(message="Password updated successfully")


@router.post("/change-password", response_model=MessageResponse)
async def change_password(payload: ChangePasswordRequest, user: Annotated[dict, Depends(get_current_user)]) -> MessageResponse:
    stored = await get_database().users.find_one({"_id": ObjectId(user["id"])})
    if not stored or not verify_password(payload.current_password, stored["password_hash"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    await get_database().users.update_one({"_id": stored["_id"]}, {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": utc_now()}})
    return MessageResponse(message="Password changed successfully")


@router.get("/me")
async def me(user: Annotated[dict, Depends(get_current_user)]) -> dict:
    return safe_user(user)

