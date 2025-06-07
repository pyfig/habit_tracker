import pytest
from datetime import date

@pytest.mark.asyncio
async def test_create_and_delete_mark(authenticated_client_with_habit):
    ac, habit_id = authenticated_client_with_habit
    r = await ac.post("/api/marks/", json={"habit_id": habit_id, "date": date.today().isoformat()})
    assert r.status_code == 200
    mark_id = r.json()["id"]

    r = await ac.get(f"/api/marks/habit/{habit_id}")
    assert r.status_code == 200
    assert len(r.json()) == 1

    r = await ac.delete(f"/api/marks/{mark_id}")
    assert r.status_code == 204

    r = await ac.get(f"/api/marks/habit/{habit_id}")
    assert r.status_code == 200
    assert len(r.json()) == 0
