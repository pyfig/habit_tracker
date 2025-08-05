import uuid
import pytest
from httpx import AsyncClient
from jose import jwt

from app.main import app
from app.auth import hash_password, verify_password, SECRET_KEY, ALGORITHM


def test_hash_and_verify_password():
    raw = "superSecret42"
    hashed = hash_password(raw)

    assert hashed != raw
    assert verify_password(raw, hashed)
    assert not verify_password("badPassword", hashed)


@pytest.mark.asyncio
async def test_register_validation_errors():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.post("/api/auth/register", json={"username": "ab", "password": "GoodPass1"})
        assert r.status_code == 422

        r = await ac.post("/api/auth/register", json={"username": "valid_name", "password": "123"})
        assert r.status_code == 422


@pytest.mark.asyncio
async def test_jwt_contains_user_id():
    uname = f"user_{uuid.uuid4().hex[:6]}"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        reg = await ac.post("/api/auth/register", json={"username": uname, "password": "testpass"})
        user_id = reg.json()["id"]

        login = await ac.post("/api/auth/login", json={"username": uname, "password": "testpass"})
        token = login.json()["access_token"]

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == user_id


@pytest.mark.asyncio
async def test_protected_route_requires_token():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/api/habits/")
        assert r.status_code == 401

@pytest.mark.asyncio
async def test_login_wrong_password():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        uname = f"user_{uuid.uuid4().hex[:6]}"
        await ac.post("/api/auth/register", json={"username": uname, "password": "goodpass"})
        r = await ac.post("/api/auth/login", json={"username": uname, "password": "otherpass"})
        assert r.status_code == 401

@pytest.mark.asyncio
async def test_invalid_token_access():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        ac.headers.update({"Authorization": "Bearer invalid"})
        r = await ac.get("/api/habits/")
        assert r.status_code == 401
