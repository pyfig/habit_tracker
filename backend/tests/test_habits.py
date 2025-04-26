import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine

# Настройка базы данных для тестов
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def get_token(username, password):
    client.post("/api/auth/register", json={"username": username, "password": password})
    response = client.post("/api/auth/login", json={"username": username, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]

def test_habit_crud_archive_and_profile():
    token = get_token("testuser", "testpass")
    headers = {"Authorization": f"Bearer {token}"}

    # Создание привычки
    habit_data = {"name": "Habit1", "description": "Test habit", "priority": 4, "importance": 5}
    response = client.post("/api/habits/", headers=headers, json=habit_data)
    assert response.status_code == 200
    habit = response.json()
    habit_id = habit["id"]
    assert habit["name"] == "Habit1"
    assert habit["description"] == "Test habit"
    assert habit["priority"] == 4
    assert habit["importance"] == 5
    assert habit["is_archived"] == False

    # Редактирование привычки
    update_data = {"name": "Habit1 Updated", "description": "Updated", "priority": 2}
    response = client.put(f"/api/habits/{habit_id}", headers=headers, json=update_data)
    assert response.status_code == 200
    updated = response.json()
    assert updated["name"] == "Habit1 Updated"
    assert updated["description"] == "Updated"
    assert updated["priority"] == 2
    assert updated["importance"] == 5

    # Архивация привычки
    response = client.post(f"/api/habits/{habit_id}/archive", headers=headers)
    assert response.status_code == 204

    # После архивации привычки она не должна возвращаться в общий список
    response = client.get("/api/habits", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert all(h["id"] != habit_id for h in data)

    # Проверка статистики пользователя
    response = client.get("/api/profile/", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["total_habits"] == 1
    assert profile["archived_habits"] == 1
    assert profile["completed_habits"] == 0
    assert profile["green_days"] == 0

    # Удаление привычки
    response = client.delete(f"/api/habits/{habit_id}", headers=headers)
    assert response.status_code == 204

    # Статистика после удаления
    response = client.get("/api/profile/", headers=headers)
    assert response.status_code == 200
    profile = response.json()
    assert profile["total_habits"] == 0
    assert profile["archived_habits"] == 0
