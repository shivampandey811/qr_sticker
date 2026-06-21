from datetime import datetime, timezone
from typing import Any

from bson import ObjectId


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def serialize_document(document: dict[str, Any] | None) -> dict[str, Any] | None:
    if document is None:
        return None
    result = dict(document)
    if "_id" in result:
        result["id"] = str(result.pop("_id"))
    for key, value in result.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
    return result

