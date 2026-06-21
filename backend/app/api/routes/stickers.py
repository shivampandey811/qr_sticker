from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.core.database import get_database
from app.core.security import hash_activation_code
from app.models.common import serialize_document, utc_now
from app.schemas.vehicle import StickerActivationRequest
from app.services.audit import write_audit


router = APIRouter(prefix="/stickers", tags=["Stickers"])


@router.get("")
async def list_stickers(user: Annotated[dict, Depends(get_current_user)]) -> list[dict]:
    items = await get_database().stickers.find({"owner_id": user["id"]}).sort("created_at", -1).to_list(100)
    return [serialize_document(item) for item in items]


@router.post("/activate")
async def activate_sticker(payload: StickerActivationRequest, user: Annotated[dict, Depends(get_current_user)]) -> dict:
    db = get_database()
    code_hash = hash_activation_code(payload.activation_code)
    code = await db.activation_codes.find_one({"code_hash": code_hash, "used_at": None})
    if not code:
        raise HTTPException(status_code=400, detail="Activation code is invalid or already used")
    sticker = await db.stickers.find_one({"_id": ObjectId(code["sticker_id"]), "owner_id": None, "enabled": True})
    if not sticker:
        raise HTTPException(status_code=409, detail="Sticker is unavailable")
    if payload.vehicle_id:
        vehicle = await db.vehicles.find_one({"_id": ObjectId(payload.vehicle_id), "owner_id": user["id"]})
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")
    activated_at = utc_now()
    claimed = await db.activation_codes.find_one_and_update(
        {"_id": code["_id"], "used_at": None},
        {"$set": {"used_at": activated_at, "used_by": user["id"]}},
    )
    if not claimed:
        raise HTTPException(status_code=409, detail="Activation code was already claimed")
    linked = await db.stickers.update_one(
        {"_id": sticker["_id"], "owner_id": None, "enabled": True},
        {"$set": {"owner_id": user["id"], "vehicle_id": payload.vehicle_id, "activated_at": activated_at}},
    )
    if not linked.modified_count:
        await db.activation_codes.update_one({"_id": code["_id"], "used_by": user["id"]}, {"$set": {"used_at": None, "used_by": None}})
        raise HTTPException(status_code=409, detail="Sticker was already claimed")
    if payload.vehicle_id:
        await db.vehicles.update_one({"_id": ObjectId(payload.vehicle_id)}, {"$set": {"qr_sticker_id": sticker["qr_id"], "updated_at": activated_at}})
    await write_audit("activate", "sticker", user["id"], str(sticker["_id"]), {"qr_id": sticker["qr_id"]})
    sticker.update({"owner_id": user["id"], "vehicle_id": payload.vehicle_id, "activated_at": activated_at})
    return serialize_document(sticker)
