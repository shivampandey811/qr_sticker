from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.router import api_router
from app.api.routes.public import limiter
from app.core.config import settings
from app.core.database import close_database, connect_database, get_database
from app.core.security import hash_password
from app.models.common import utc_now


@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_database()
    await seed_admin()
    yield
    await close_database()


async def seed_admin() -> None:
    db = get_database()
    if not await db.users.find_one({"email": settings.admin_email.lower()}):
        await db.users.insert_one({
            "name": "CarPing Admin",
            "email": settings.admin_email.lower(),
            "mobile": "+910000000000",
            "whatsapp": "+910000000000",
            "password_hash": hash_password(settings.admin_password),
            "role": "admin",
            "email_verified": True,
            "is_active": True,
            "fcm_tokens": [],
            "created_at": utc_now(),
            "updated_at": utc_now(),
        })


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Anonymous QR-based vehicle owner contact platform.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["System"])
async def health() -> dict:
    await get_database().command("ping")
    return {"status": "healthy", "service": "carping-api"}

