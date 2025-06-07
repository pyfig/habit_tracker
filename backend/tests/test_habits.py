import pytest
import uuid

@pytest.mark.asyncio
async def test_create_habit(authenticated_client):
    response = await authenticated_client.post("/api/habits/", json={
        "name": "Reading",
        "description": "Read 20 pages"
    })
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_get_habits(authenticated_client):
    await authenticated_client.post("/api/habits/", json={"name": "Jogging", "description": "Morning jog"})
    response = await authenticated_client.get("/api/habits/")
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_update_habit(authenticated_client):
    # создаём
    r = await authenticated_client.post("/api/habits/", json={"name":"Upd","description":""})
    habit_id = r.json()["id"]

    # апдейт
    r = await authenticated_client.put(f"/api/habits/{habit_id}", json={"name":"New","description":"Desc"})
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "New"
    assert body["description"] == "Desc"

@pytest.mark.asyncio
async def test_update_habit_not_found(authenticated_client):
    bad_id = uuid.uuid4()
    r = await authenticated_client.put(f"/api/habits/{bad_id}", json={"name":"X"})
    assert r.status_code == 404
@pytest.mark.asyncio
async def test_complete_and_uncomplete_habit(authenticated_client_with_habit):
    ac, habit_id = authenticated_client_with_habit
    r = await ac.post(f"/api/habits/{habit_id}/complete")
    assert r.status_code == 204

    completed = await ac.get("/api/habits/completed")
    assert habit_id in [h["id"] for h in completed.json()]

    r = await ac.post(f"/api/habits/{habit_id}/uncomplete")
    assert r.status_code == 204
    completed = await ac.get("/api/habits/completed")
    assert habit_id not in [h["id"] for h in completed.json()]

@pytest.mark.asyncio
async def test_delete_habit(authenticated_client_with_habit):
    ac, habit_id = authenticated_client_with_habit
    r = await ac.delete(f"/api/habits/{habit_id}")
    assert r.status_code == 204
    r = await ac.get("/api/habits/")
    assert habit_id not in [h["id"] for h in r.json()]
