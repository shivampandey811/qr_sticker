from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_current_user


router = APIRouter(prefix="/integrations", tags=["Future Integrations"])


@router.post("/{channel}/requests", status_code=status.HTTP_202_ACCEPTED)
async def request_integration(channel: str, user: Annotated[dict, Depends(get_current_user)]) -> dict:
    supported = {"whatsapp", "voice", "sms", "mobile-app"}
    if channel not in supported:
        return {"accepted": False, "message": "Unsupported integration channel"}
    return {"accepted": True, "status": "planned", "channel": channel, "message": "Integration endpoint reserved for a future provider adapter."}

