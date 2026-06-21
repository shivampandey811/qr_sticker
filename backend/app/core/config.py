from functools import lru_cache
from typing import Literal

from pydantic import EmailStr, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "CarPing API"
    environment: Literal["development", "test", "production"] = "development"
    api_v1_prefix: str = "/api/v1"
    frontend_url: str = "http://localhost:5173"
    mongo_url: str = "mongodb://mongo:27017"
    mongo_db: str = "carping"
    jwt_secret: str = Field(default="change-me-in-production-at-least-32-characters")
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 30
    refresh_token_days: int = 30
    verification_token_hours: int = 24
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_username: str | None = None
    smtp_password: str | None = None
    email_from: EmailStr = "hello@carping.com"
    firebase_credentials_path: str | None = None
    turnstile_secret_key: str | None = None
    public_rate_limit: str = "10/minute"
    admin_email: EmailStr = "admin@carping.com"
    admin_password: str = "ChangeMe123!"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

