from typing import Literal

from pydantic import Field

from app.schemas.common import APIModel


MessageType = Literal["blocking", "headlights", "emergency", "flat_tyre", "accident", "custom"]


class ContactRequestCreate(APIModel):
    message_type: MessageType
    custom_message: str | None = Field(default=None, max_length=300)
    captcha_token: str | None = None


class FCMTokenRequest(APIModel):
    token: str = Field(min_length=20, max_length=4096)
    platform: Literal["web", "android", "ios"] = "web"

