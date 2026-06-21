from datetime import datetime

from pydantic import BaseModel, ConfigDict


class APIModel(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, populate_by_name=True)


class MessageResponse(APIModel):
    message: str


class PaginatedResponse(APIModel):
    items: list[dict]
    total: int
    page: int
    page_size: int


class AuditRecord(APIModel):
    actor_id: str | None
    action: str
    entity: str
    entity_id: str | None
    metadata: dict = {}
    created_at: datetime

