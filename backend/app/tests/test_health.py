import pytest
from fastapi.testclient import TestClient
from app.main import app

from httpx import AsyncClient
from fastapi import FastAPI
import pytest

from app.main import app  

@pytest.mark.asyncio
async def test_something():
    async with AsyncClient(base_url="http://test", app=app) as ac:
        response = await ac.get("/")
        assert response.status_code == 200
