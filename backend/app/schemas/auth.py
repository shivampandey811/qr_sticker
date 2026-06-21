import re

from pydantic import EmailStr, Field, field_validator

from app.schemas.common import APIModel


class RegisterRequest(APIModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    mobile: str = Field(min_length=8, max_length=18)
    whatsapp: str = Field(min_length=8, max_length=18)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value) or not re.search(r"[a-z]", value) or not re.search(r"\d", value):
            raise ValueError("Password must contain upper, lower, and numeric characters")
        return value


class LoginRequest(APIModel):
    email: EmailStr
    password: str


class TokenResponse(APIModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class RefreshRequest(APIModel):
    refresh_token: str


class ForgotPasswordRequest(APIModel):
    email: EmailStr


class ResetPasswordRequest(APIModel):
    token: str
    new_password: str = Field(min_length=8, max_length=72)


class ChangePasswordRequest(APIModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=72)

