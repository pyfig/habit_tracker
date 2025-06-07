import pytest_asyncio
from httpx import AsyncClient
from app.main import app
import uuid

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
