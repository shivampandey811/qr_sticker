from app.core.config import settings
from app.services.notifications import _send_email


async def send_action_email(recipient: str, subject: str, path: str, token: str) -> None:
    import asyncio

    if not settings.smtp_host:
        return
    url = f"{settings.frontend_url}/{path}?token={token}"
    await asyncio.to_thread(_send_email, recipient, subject, f"Open this secure link to continue: {url}")

