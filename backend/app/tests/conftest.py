import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app  # make sure this is your FastAPI app

@pytest.fixture
async def async_client():
    transport = ASGITransport(app=app, lifespan="on")
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
