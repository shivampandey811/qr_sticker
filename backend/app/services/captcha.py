import httpx
from fastapi import HTTPException

from app.core.config import settings


async def verify_captcha(token: str | None, remote_ip: str | None) -> None:
    if not settings.turnstile_secret_key and settings.environment != "production":
        return
    if not token or not settings.turnstile_secret_key:
        raise HTTPException(status_code=400, detail="Captcha verification required")
    async with httpx.AsyncClient(timeout=8) as client:
        response = await client.post("https://challenges.cloudflare.com/turnstile/v0/siteverify", data={
            "secret": settings.turnstile_secret_key,
            "response": token,
            "remoteip": remote_ip,
        })
    if not response.json().get("success"):
        raise HTTPException(status_code=400, detail="Captcha verification failed")

