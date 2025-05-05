
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient):
    response = await async_client.post(
        "/auth/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 201

@pytest.mark.asyncio
async def test_register_duplicate_user(async_client: AsyncClient):
    await async_client.post(
        "/auth/register",
        json={"username": "testuser2", "password": "testpassword"},
    )
    response = await async_client.post(
        "/auth/register",
        json={"username": "testuser2", "password": "testpassword"},
    )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient):
    await async_client.post(
        "/auth/register",
        json={"username": "loginuser", "password": "loginpass"},
    )
    response = await async_client.post(
        "/auth/login",
        data={"username": "loginuser", "password": "loginpass"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_fail(async_client: AsyncClient):
    response = await async_client.post(
        "/auth/login",
        data={"username": "wronguser", "password": "wrongpass"},
    )
    assert response.status_code == 401
