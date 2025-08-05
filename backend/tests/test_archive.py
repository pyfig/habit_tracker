import pytest
from datetime import date


@pytest.mark.asyncio
async def test_archive_and_restore_habit(authenticated_client):
    resp = await authenticated_client.post(
        "/api/habits/", json={"name": "ArchiveMe", "description": "to be archived"}
    )
    assert resp.status_code == 200
    habit_id = resp.json()["id"]

    resp = await authenticated_client.post(f"/api/habits/{habit_id}/archive")
    assert resp.status_code == 200
    assert resp.json()["archived"] is True

    active = await authenticated_client.get("/api/habits/")
    assert habit_id not in [h["id"] for h in active.json()]

    archived = await authenticated_client.get("/api/habits/archived")
    assert habit_id in [h["id"] for h in archived.json()]

    resp = await authenticated_client.post(f"/api/habits/{habit_id}/restore")
    assert resp.status_code == 200

    archived = await authenticated_client.get("/api/habits/archived")
    assert habit_id not in [h["id"] for h in archived.json()]

    active = await authenticated_client.get("/api/habits/")
    assert habit_id in [h["id"] for h in active.json()]
