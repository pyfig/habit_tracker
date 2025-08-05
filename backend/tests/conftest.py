import pytest_asyncio
import os
import sys
from httpx import AsyncClient
import uuid

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.main import app
from app.db import engine, Base
from app.models import User, Habit, Mark

def create_test_tables():
    Base.metadata.create_all(bind=engine)

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_db():
    create_test_tables()
    yield
    Base.metadata.drop_all(bind=engine)

@pytest_asyncio.fixture(autouse=True)
async def ensure_tables():
    create_test_tables()

@pytest_asyncio.fixture
async def authenticated_client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        username = f"user_{uuid.uuid4().hex[:6]}"
        await ac.post("/api/auth/register", json={"username": username, "password": "testpass"})
        login_resp = await ac.post("/api/auth/login", json={"username": username, "password": "testpass"})
        token = login_resp.json()["access_token"]
        ac.headers.update({"Authorization": f"Bearer {token}"})
        yield ac

@pytest_asyncio.fixture
async def authenticated_client_with_habit(authenticated_client):
    ac = authenticated_client
    response = await ac.post("/api/habits/", json={"name": "Exercise", "description": "Daily exercise"})
    habit_id = response.json()["id"]
    return ac, habit_id
