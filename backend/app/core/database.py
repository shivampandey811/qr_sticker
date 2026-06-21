from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings


client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


async def connect_database() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongo_url, uuidRepresentation="standard")
    database = client[settings.mongo_db]
    await database.command("ping")
    await _create_indexes(database)


async def close_database() -> None:
    global client
    if client:
        client.close()


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("Database is not connected")
    return database


async def _create_indexes(db: AsyncIOMotorDatabase) -> None:
    await db.users.create_index("email", unique=True)
    await db.users.create_index("mobile", unique=True)
    await db.vehicles.create_index([("owner_id", 1), ("vehicle_number", 1)], unique=True)
    await db.stickers.create_index("qr_id", unique=True)
    await db.stickers.create_index("owner_id")
    await db.activation_codes.create_index("code_hash", unique=True)
    await db.contact_requests.create_index([("qr_id", 1), ("created_at", -1)])
    await db.contact_requests.create_index([("owner_id", 1), ("created_at", -1)])
    await db.scan_events.create_index([("owner_id", 1), ("created_at", -1)])
    await db.notifications.create_index([("user_id", 1), ("created_at", -1)])
    await db.audit_logs.create_index([("created_at", -1)])
