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