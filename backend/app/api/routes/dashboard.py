from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.core.database import get_database
from app.models.common import serialize_document, utc_now
from app.schemas.contact import FCMTokenRequest


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
async def dashboard_summary(user: Annotated[dict, Depends(get_current_user)]) -> dict:
    db = get_database()
    stickers = await db.stickers.find({"owner_id": user["id"]}).to_list(100)
    vehicles = await db.vehicles.find({"owner_id": user["id"]}).to_list(100)
    requests = await db.contact_requests.find({"owner_id": user["id"]}).sort("created_at", -1).limit(8).to_list(8)
    notifications = await db.notifications.find({"user_id": user["id"]}).sort("created_at", -1).limit(8).to_list(8)
    return {
        "total_scans": sum(item.get("scan_count", 0) for item in stickers),
        "linked_vehicles": len(vehicles),
        "active_stickers": sum(1 for item in stickers if item.get("enabled")),
        "unread_notifications": await db.notifications.count_documents({"user_id": user["id"], "read": False}),
        "vehicles": [serialize_document(item) for item in vehicles],
        "stickers": [serialize_document(item) for item in stickers],
        "recent_requests": [serialize_document(item) for item in requests],
        "recent_notifications": [serialize_document(item) for item in notifications],
    }


@router.get("/analytics")
async def analytics(user: Annotated[dict, Depends(get_current_user)], period: str = "daily") -> dict:
    days = {"daily": 7, "weekly": 56, "monthly": 365}.get(period, 7)
    unit = {"daily": "%Y-%m-%d", "weekly": "%G-W%V", "monthly": "%Y-%m"}.get(period, "%Y-%m-%d")
    pipeline = [
        {"$match": {"owner_id": user["id"], "created_at": {"$gte": utc_now() - timedelta(days=days)}}},
        {"$group": {"_id": {"$dateToString": {"format": unit, "date": "$created_at"}}, "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    points = await get_database().scan_events.aggregate(pipeline).to_list(100)
    return {"period": period, "points": [{"label": item["_id"], "value": item["count"]} for item in points]}


@router.get("/contact-requests")
async def contact_history(user: Annotated[dict, Depends(get_current_user)], page: int = 1, page_size: int = 20) -> dict:
    page, page_size = max(page, 1), min(max(page_size, 1), 100)
    query = {"owner_id": user["id"]}
    db = get_database()
    items = await db.contact_requests.find(query).sort("created_at", -1).skip((page - 1) * page_size).limit(page_size).to_list(page_size)
    return {"items": [serialize_document(item) for item in items], "total": await db.contact_requests.count_documents(query), "page": page, "page_size": page_size}


@router.post("/fcm-token", status_code=204)
async def register_fcm_token(payload: FCMTokenRequest, user: Annotated[dict, Depends(get_current_user)]) -> None:
    await get_database().users.update_one({"_id": __import__("bson").ObjectId(user["id"])}, {"$pull": {"fcm_tokens": {"token": payload.token}}})
    await get_database().users.update_one({"_id": __import__("bson").ObjectId(user["id"])}, {"$push": {"fcm_tokens": {"token": payload.token, "platform": payload.platform, "created_at": utc_now()}}})
