from app.core.database import get_database
from app.models.common import utc_now


async def write_audit(action: str, entity: str, actor_id: str | None = None, entity_id: str | None = None, metadata: dict | None = None) -> None:
    await get_database().audit_logs.insert_one({
        "actor_id": actor_id,
        "action": action,
        "entity": entity,
        "entity_id": entity_id,
        "metadata": metadata or {},
        "created_at": utc_now(),
    })

