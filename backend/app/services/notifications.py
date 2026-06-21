import asyncio
import smtplib
from email.message import EmailMessage

from app.core.config import settings


MESSAGES = {
    "blocking": "Someone reported that your vehicle is blocking access.",
    "headlights": "Someone reported that your vehicle headlights are still ON.",
    "emergency": "Someone needs to contact you about an emergency involving your vehicle.",
    "flat_tyre": "Someone reported that your vehicle has a flat tyre.",
    "accident": "Someone reported possible accident damage to your vehicle.",
    "custom": "Someone sent a message about your vehicle.",
}


async def send_owner_notifications(user: dict, message_type: str, custom_message: str | None, qr_id: str) -> dict:
    body = custom_message if message_type == "custom" and custom_message else MESSAGES[message_type]
    results = {"email": "skipped", "push": "skipped"}
    if settings.smtp_host:
        try:
            await asyncio.to_thread(_send_email, user["email"], "CarPing vehicle alert", body)
            results["email"] = "sent"
        except Exception:
            results["email"] = "failed"
    if user.get("fcm_tokens") and settings.firebase_credentials_path:
        try:
            results["push"] = await asyncio.to_thread(_send_push, user["fcm_tokens"], body, qr_id)
        except Exception:
            results["push"] = "failed"
    return results


def _send_email(recipient: str, subject: str, body: str) -> None:
    message = EmailMessage()
    message["From"] = str(settings.email_from)
    message["To"] = recipient
    message["Subject"] = subject
    message.set_content(body)
    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
        smtp.starttls()
        if settings.smtp_username and settings.smtp_password:
            smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)


def _send_push(tokens: list[dict], body: str, qr_id: str) -> str:
    import firebase_admin
    from firebase_admin import credentials, messaging

    if not firebase_admin._apps:
        firebase_admin.initialize_app(credentials.Certificate(settings.firebase_credentials_path))
    token_values = [item["token"] for item in tokens]
    response = messaging.send_each_for_multicast(messaging.MulticastMessage(
        tokens=token_values,
        notification=messaging.Notification(title="Vehicle alert", body=body),
        data={"qr_id": qr_id, "type": "contact_request"},
    ))
    return "sent" if response.success_count else "failed"

