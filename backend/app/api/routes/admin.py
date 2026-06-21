import secrets
import string
from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_admin
from app.core.database import get_database
from app.core.security import hash_activation_code
from app.models.common import serialize_document, utc_now
from app.schemas.admin import StickerBatchCreate, StickerStatusRequest, TransferStickerRequest
from app.services.audit import write_audit


router = APIRouter(prefix="/admin", tags=["Admin"])


def make_code(length: int = 9) -> str:
    alphabet = string.ascii_uppercase + string.digits
    raw = "".join(secrets.choice(alphabet) for _ in range(length))
    return "-".join(raw[index:index + 3] for index in range(0, length, 3))


@router.post("/stickers/batch", status_code=201)
async def create_sticker_batch(payload: StickerBatchCreate, admin: Annotated[dict, Depends(get_current_admin)]) -> dict:
    db = get_database()
    created = []
    for _ in range(payload.quantity):
        qr_id = f"{payload.prefix.upper()}{secrets.token_hex(4).upper()}"
        activation_code = make_code()
        sticker = {"qr_id": qr_id, "owner_id": None, "vehicle_id": None, "enabled": True, "scan_count": 0, "activated_at": None, "created_at": utc_now()}
        result = await db.stickers.insert_one(sticker)
        await db.activation_codes.insert_one({"sticker_id": str(result.inserted_id), "code_hash": hash_activation_code(activation_code), "used_at": None, "used_by": None, "created_at": utc_now()})
        created.append({"qr_id": qr_id, "activation_code": activation_code})
    await write_audit("batch_create", "sticker", admin["id"], metadata={"quantity": payload.quantity})
    return {"stickers": created}


@router.get("/users")
async def list_users(admin: Annotated[dict, Depends(get_current_admin)], page: int = 1) -> dict:
    db = get_database()
    items = await db.users.find({}).sort("created_at", -1).skip((max(page, 1) - 1) * 25).limit(25).to_list(25)
    safe = []
    for item in items:
        item.pop("password_hash", None)
        item.pop("fcm_tokens", None)
        safe.append(serialize_document(item))
    return {"items": safe, "total": await db.users.count_documents({})}


@router.get("/vehicles")
async def list_all_vehicles(admin: Annotated[dict, Depends(get_current_admin)], page: int = 1) -> dict:
    db = get_database()
    items = await db.vehicles.find({}).sort("created_at", -1).skip((max(page, 1) - 1) * 25).limit(25).to_list(25)
    return {"items": [serialize_document(item) for item in items], "total": await db.vehicles.count_documents({})}


@router.patch("/stickers/{qr_id}/status")
async def set_sticker_status(qr_id: str, payload: StickerStatusRequest, admin: Annotated[dict, Depends(get_current_admin)]) -> dict:
    item = await get_database().stickers.find_one_and_update({"qr_id": qr_id.upper()}, {"$set": {"enabled": payload.enabled}}, return_document=True)
    if not item:
        raise HTTPException(status_code=404, detail="Sticker not found")
    await write_audit("status_change", "sticker", admin["id"], str(item["_id"]), {"enabled": payload.enabled})
    return serialize_document(item)


@router.post("/stickers/{qr_id}/transfer")
async def transfer_sticker(qr_id: str, payload: TransferStickerRequest, admin: Annotated[dict, Depends(get_current_admin)]) -> dict:
    db = get_database()
    new_owner = await db.users.find_one({"email": payload.new_owner_email.lower(), "is_active": True})
    if not new_owner:
        raise HTTPException(status_code=404, detail="New owner not found")
    item = await db.stickers.find_one_and_update({"qr_id": qr_id.upper()}, {"$set": {"owner_id": str(new_owner["_id"]), "vehicle_id": None, "transferred_at": utc_now()}}, return_document=True)
    if not item:
        raise HTTPException(status_code=404, detail="Sticker not found")
    await db.vehicles.update_many({"qr_sticker_id": qr_id.upper()}, {"$set": {"qr_sticker_id": None}})
    await write_audit("transfer", "sticker", admin["id"], str(item["_id"]), {"new_owner": str(new_owner["_id"])})
    return serialize_document(item)


@router.get("/audit-logs")
async def audit_logs(admin: Annotated[dict, Depends(get_current_admin)]) -> list[dict]:
    items = await get_database().audit_logs.find({}).sort("created_at", -1).limit(100).to_list(100)
    return [serialize_document(item) for item in items]

