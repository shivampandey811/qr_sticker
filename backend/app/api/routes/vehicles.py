from typing import Annotated

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.core.database import get_database
from app.models.common import serialize_document, utc_now
from app.schemas.common import MessageResponse
from app.schemas.vehicle import VehicleCreate, VehicleUpdate
from app.services.audit import write_audit


router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("")
async def list_vehicles(user: Annotated[dict, Depends(get_current_user)]) -> list[dict]:
    vehicles = await get_database().vehicles.find({"owner_id": user["id"]}).sort("created_at", -1).to_list(100)
    return [serialize_document(item) for item in vehicles]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_vehicle(payload: VehicleCreate, user: Annotated[dict, Depends(get_current_user)]) -> dict:
    db = get_database()
    document = payload.model_dump()
    document.update({"vehicle_number": payload.vehicle_number.upper(), "owner_id": user["id"], "created_at": utc_now(), "updated_at": utc_now()})
    if payload.qr_sticker_id:
        sticker = await db.stickers.find_one({"qr_id": payload.qr_sticker_id.upper(), "owner_id": user["id"], "enabled": True})
        if not sticker:
            raise HTTPException(status_code=400, detail="Sticker is not available for this account")
    result = await db.vehicles.insert_one(document)
    await write_audit("create", "vehicle", user["id"], str(result.inserted_id))
    return serialize_document(await db.vehicles.find_one({"_id": result.inserted_id}))


@router.patch("/{vehicle_id}")
async def update_vehicle(vehicle_id: str, payload: VehicleUpdate, user: Annotated[dict, Depends(get_current_user)]) -> dict:
    try:
        object_id = ObjectId(vehicle_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vehicle ID")
    updates = payload.model_dump(exclude_none=True)
    if "vehicle_number" in updates:
        updates["vehicle_number"] = updates["vehicle_number"].upper()
    updates["updated_at"] = utc_now()
    result = await get_database().vehicles.find_one_and_update({"_id": object_id, "owner_id": user["id"]}, {"$set": updates}, return_document=True)
    if not result:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await write_audit("update", "vehicle", user["id"], vehicle_id)
    return serialize_document(result)


@router.delete("/{vehicle_id}", response_model=MessageResponse)
async def delete_vehicle(vehicle_id: str, user: Annotated[dict, Depends(get_current_user)]) -> MessageResponse:
    try:
        object_id = ObjectId(vehicle_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid vehicle ID")
    result = await get_database().vehicles.delete_one({"_id": object_id, "owner_id": user["id"]})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await get_database().stickers.update_many({"vehicle_id": vehicle_id, "owner_id": user["id"]}, {"$set": {"vehicle_id": None}})
    await write_audit("delete", "vehicle", user["id"], vehicle_id)
    return MessageResponse(message="Vehicle removed")

