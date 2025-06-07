import uuid
import pytest
from httpx import AsyncClient
from jose import jwt

from app.main import app
from app.auth import hash_password, verify_password, SECRET_KEY, ALGORITHM


# ──────────────────────────────────────────────────────────────────────────────
# 1.  Низкоуровневые функции хэширования
# ──────────────────────────────────────────────────────────────────────────────
def test_hash_and_verify_password():
    raw = "superSecret42"
    hashed = hash_password(raw)

    # хэш отличается от оригинала
    assert hashed != raw
    # положительный и отрицательный кейс verify
    assert verify_password(raw, hashed)
    assert not verify_password("badPassword", hashed)


# ──────────────────────────────────────────────────────────────────────────────
# 2.  Валидация входных данных 
# ──────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_register_validation_errors():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # имя короче 3-х символов
        r = await ac.post("/api/auth/register", json={"username": "ab", "password": "GoodPass1"})
        assert r.status_code == 422

        # пароль короче 6-ти символов
        r = await ac.post("/api/auth/register", json={"username": "valid_name", "password": "123"})
        assert r.status_code == 422


# ──────────────────────────────────────────────────────────────────────────────
# 3.  JWT содержит user_id в payload
# ──────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_jwt_contains_user_id():
    uname = f"user_{uuid.uuid4().hex[:6]}"
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # регистрируемся
        reg = await ac.post("/api/auth/register", json={"username": uname, "password": "testpass"})
        user_id = reg.json()["id"]

        # логинимся
        login = await ac.post("/api/auth/login", json={"username": uname, "password": "testpass"})
        token = login.json()["access_token"]

        # декодируем JWT и сверяем «sub»
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        assert payload["sub"] == user_id


# ──────────────────────────────────────────────────────────────────────────────
# 4.  Защищённый эндпоинт без токена = 401
# ──────────────────────────────────────────────────────────────────────────────
@pytest.mark.asyncio
async def test_protected_route_requires_token():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/api/habits/")          # без заголовка Authorization
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
