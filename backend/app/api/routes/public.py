from fastapi import APIRouter, BackgroundTasks, HTTPException, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.core.database import get_database
from app.models.common import serialize_document, utc_now
from app.schemas.contact import ContactRequestCreate
from app.services.captcha import verify_captcha
from app.services.notifications import MESSAGES, send_owner_notifications


router = APIRouter(prefix="/public", tags=["Public QR"])
limiter = Limiter(key_func=get_remote_address)


@router.get("/stickers/{qr_id}")
@limiter.limit(settings.public_rate_limit)
async def sticker_landing(request: Request, qr_id: str) -> dict:
    db = get_database()
    sticker = await db.stickers.find_one({"qr_id": qr_id.upper(), "enabled": True, "owner_id": {"$ne": None}})
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker is inactive or not found")
    vehicle = await db.vehicles.find_one({"qr_sticker_id": sticker["qr_id"], "owner_id": sticker["owner_id"]})
    await db.scan_events.insert_one({
        "owner_id": sticker["owner_id"],
        "qr_id": sticker["qr_id"],
        "ip_address": request.client.host if request.client else None,
        "created_at": utc_now(),
    })
    await db.stickers.update_one({"_id": sticker["_id"]}, {"$inc": {"scan_count": 1}, "$set": {"last_scanned_at": utc_now()}})
    return {"qr_id": sticker["qr_id"], "vehicle": {"nickname": vehicle.get("nickname") if vehicle else None, "type": vehicle.get("vehicle_type") if vehicle else None}, "active": True}


@router.post("/stickers/{qr_id}/contact", status_code=201)
@limiter.limit(settings.public_rate_limit)
async def create_contact_request(request: Request, qr_id: str, payload: ContactRequestCreate, background_tasks: BackgroundTasks) -> dict:
    await verify_captcha(payload.captcha_token, request.client.host if request.client else None)
    if payload.message_type == "custom" and not payload.custom_message:
        raise HTTPException(status_code=422, detail="A custom message is required")
    db = get_database()
    sticker = await db.stickers.find_one({"qr_id": qr_id.upper(), "enabled": True, "owner_id": {"$ne": None}})
    if not sticker:
        raise HTTPException(status_code=404, detail="Sticker is inactive or not found")
    owner = await db.users.find_one({"_id": __import__("bson").ObjectId(sticker["owner_id"]), "is_active": True})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner account is unavailable")
    document = {
        "owner_id": sticker["owner_id"],
        "qr_id": sticker["qr_id"],
        "message_type": payload.message_type,
        "custom_message": payload.custom_message,
        "ip_address": request.client.host if request.client else None,
        "user_agent": request.headers.get("user-agent"),
        "status": "new",
        "created_at": utc_now(),
    }
    result = await db.contact_requests.insert_one(document)
    notification = {"user_id": sticker["owner_id"], "contact_request_id": str(result.inserted_id), "title": "Vehicle alert", "body": payload.custom_message or MESSAGES[payload.message_type], "read": False, "created_at": utc_now()}
    await db.notifications.insert_one(notification)
    background_tasks.add_task(send_owner_notifications, serialize_document(owner), payload.message_type, payload.custom_message, sticker["qr_id"])
    return {"message": "The owner has been notified anonymously.", "request_id": str(result.inserted_id)}


from pydantic import BaseModel
from typing import List
import httpx

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatbotRequest(BaseModel):
    messages: List[ChatMessage]

SYSTEM_PROMPT = """You are the CarPing Assistant, a friendly, concise, and professional helper on the CarPing platform.
CarPing is a secure, anonymous QR-based communication system for vehicle owners. 

Key details of the system:
1. Product/Service: Weather-proof smart QR stickers affixed to a vehicle's windshield/windscreen.
2. Purpose: Allows anyone to contact the driver/owner securely without exposing phone numbers, email addresses, or personal identity.
3. Use cases:
   - "Vehicle blocking access"
   - "Headlights left on"
   - "Emergency alerts"
   - "Flat tyre notification"
   - "Accident or damage warnings"
   - Custom anonymous messaging.
4. Privacy: Contact is 100% anonymous, fast (avg latency 80ms), rate-limit protected, and doesn't require any app installation or account creation to send alerts.
5. Setup: Quick 3-step setup: Affix the sticker -> Scan once to activate -> Link to your dashboard.
6. Custom Styles: We offer 10+ custom sticker designs (Holographic, Cyberpunk, Amber Glow, Carbon Fiber, Brushed Titanium, Neon Violet, Matte White, Gold Leaf Deluxe, Tactical Camo, Reflective Grid) ranging from ₹200 to ₹800.
7. Admin credentials: Pre-seeded admin user is admin@scan2owner.com with password ChangeMe123!.
8. Developer environment: Email verification is mocked & bypassed locally in development.

Answer questions concisely in 1-3 sentences. Keep formatting clean."""

@router.post("/chatbot")
async def chatbot(payload: ChatbotRequest):
    if not settings.groq_api_key:
        raise HTTPException(status_code=500, detail="Chatbot API key is not configured")
    
    api_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in payload.messages:
        api_messages.append({"role": msg.role, "content": msg.content})
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.groq_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama3-8b-8192",
                    "messages": api_messages,
                    "temperature": 0.5,
                    "max_tokens": 400
                },
                timeout=15.0
            )
            response.raise_for_status()
            res_data = response.json()
            reply = res_data["choices"][0]["message"]["content"]
            return {"reply": reply}
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error connecting to Chatbot backend: {str(e)}")
