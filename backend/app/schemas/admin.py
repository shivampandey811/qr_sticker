from pydantic import EmailStr, Field

from app.schemas.common import APIModel


class StickerBatchCreate(APIModel):
    quantity: int = Field(ge=1, le=1000)
    prefix: str = Field(default="CAR", min_length=2, max_length=6, pattern=r"^[A-Za-z0-9]+$")


class TransferStickerRequest(APIModel):
    new_owner_email: EmailStr


class StickerStatusRequest(APIModel):
    enabled: bool

