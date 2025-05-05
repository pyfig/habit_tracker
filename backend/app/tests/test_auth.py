import pytest
from httpx import AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.db import Base, get_db

# Test DB setup
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override DB dependency
@pytest.fixture(autouse=True, scope="module")
def override_get_db():
    Base.metadata.create_all(bind=engine)
    def get_test_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = get_test_db
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.mark.asyncio
async def test_register_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.post("/auth/register", json={"username": "testuser", "password": "testpass"})
    assert res.status_code == 200
    assert res.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_register_duplicate_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        await ac.post("/auth/register", json={"username": "dupe", "password": "123"})
        res = await ac.post("/auth/register", json={"username": "dupe", "password": "456"})
    assert res.status_code == 400
    assert res.json()["detail"] == "Username already registered"

@pytest.mark.asyncio
async def test_login_success():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        await ac.post("/auth/register", json={"username": "loginuser", "password": "pass"})
        res = await ac.post("/auth/login", json={"username": "loginuser", "password": "pass"})
    assert res.status_code == 200
    assert "access_token" in res.json()

@pytest.mark.asyncio
async def test_login_fail():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        res = await ac.post("/auth/login", json={"username": "notexist", "password": "wrong"})
    assert res.status_code == 401
    assert res.json()["detail"] == "Incorrect username or password"

import pytest

@pytest.mark.asyncio
async def test_register_user(async_client):
    response = await async_client.post("/register", json={"username": "test", "password": "pass"})
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_register_duplicate_user(async_client):
    await async_client.post("/register", json={"username": "test", "password": "pass"})
    response = await async_client.post("/register", json={"username": "test", "password": "pass"})
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_login_success(async_client):
    await async_client.post("/register", json={"username": "user", "password": "123"})
    response = await async_client.post("/login", data={"username": "user", "password": "123"})
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_login_fail(async_client):
    response = await async_client.post("/login", data={"username": "wrong", "password": "wrong"})
    assert response.status_code == 401

