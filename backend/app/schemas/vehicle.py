from typing import Literal

from pydantic import Field

from app.schemas.common import APIModel


class VehicleCreate(APIModel):
    vehicle_number: str = Field(min_length=3, max_length=20)
    vehicle_type: Literal["car", "motorcycle", "scooter", "truck", "other"]
    vehicle_brand: str = Field(min_length=1, max_length=50)
    vehicle_model: str = Field(min_length=1, max_length=50)
    nickname: str = Field(min_length=1, max_length=40)
    qr_sticker_id: str | None = None


class VehicleUpdate(APIModel):
    vehicle_number: str | None = Field(default=None, min_length=3, max_length=20)
    vehicle_type: Literal["car", "motorcycle", "scooter", "truck", "other"] | None = None
    vehicle_brand: str | None = Field(default=None, min_length=1, max_length=50)
    vehicle_model: str | None = Field(default=None, min_length=1, max_length=50)
    nickname: str | None = Field(default=None, min_length=1, max_length=40)
    qr_sticker_id: str | None = None


class StickerActivationRequest(APIModel):
    activation_code: str = Field(min_length=6, max_length=40)
    vehicle_id: str | None = None

