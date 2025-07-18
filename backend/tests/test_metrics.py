import pytest
from httpx import AsyncClient
from datetime import date
from app.main import app

@pytest.mark.asyncio
async def test_profile_metrics(authenticated_client_with_habit):
    ac, habit_id = authenticated_client_with_habit
    # add mark for today
    r = await ac.post("/api/marks/", json={"habit_id": habit_id, "date": date.today().isoformat()})
    assert r.status_code == 200

    metrics = await ac.get("/api/profile/metrics")
    body = metrics.json()
    assert metrics.status_code == 200
    assert body["total_habits"] == 1
    assert body["active_habits"] == 1
    assert body["completed_habits"] == 1
    assert body["archived_habits"] == 0
    assert body["marks_total"] == 1
    assert body["marks_today"] == 1
