from fastapi import APIRouter

from app.api.routes import admin, auth, dashboard, integrations, public, stickers, vehicles


api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(vehicles.router)
api_router.include_router(stickers.router)
api_router.include_router(public.router)
api_router.include_router(dashboard.router)
api_router.include_router(admin.router)
api_router.include_router(integrations.router)

