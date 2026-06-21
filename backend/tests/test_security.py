from app.core.security import create_access_token, decode_token, hash_activation_code, hash_password, verify_password


def test_password_hashing() -> None:
    hashed = hash_password("SecurePass1")
    assert verify_password("SecurePass1", hashed)
    assert not verify_password("WrongPass1", hashed)


def test_access_token_roundtrip() -> None:
    token = create_access_token("user-id")
    assert decode_token(token, "access")["sub"] == "user-id"


def test_activation_hash_is_normalized() -> None:
    assert hash_activation_code(" abc-123 ") == hash_activation_code("ABC-123")
