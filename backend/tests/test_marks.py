import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine
from datetime import date

# Настройка базы данных для тестов
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def get_token(username, password):
    client.post("/api/auth/register", json={"username": username, "password": password})
    response = client.post("/api/auth/login", json={"username": username, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]

def test_mark_crud():
    token = get_token("markuser", "markpass")
    headers = {"Authorization": f"Bearer {token}"}

    # Создаем новую привычку для отметок
    habit_data = {"name": "HabitA", "description": "For marks"}
    response = client.post("/api/habits/", headers=headers, json=habit_data)
    assert response.status_code == 200
    habit = response.json()
    habit_id = habit["id"]

    # Добавление отметки
    mark_data = {"habit_id": habit_id, "date": date.today().isoformat()}
    response = client.post("/api/marks/", headers=headers, json=mark_data)
    assert response.status_code == 200
    mark = response.json()
    assert mark["habit_id"] == habit_id
    assert mark["date"] == mark_data["date"]
    mark_id = mark["id"]

    # Повторная попытка добавить такую же отметку (должна быть ошибка)
    response = client.post("/api/marks/", headers=headers, json=mark_data)
    assert response.status_code == 400

    # Получение отметок по привычке
    response = client.get(f"/api/marks/habit/{habit_id}", headers=headers)
    assert response.status_code == 200
    marks_list = response.json()
    assert any(m["id"] == mark_id for m in marks_list)

    # Удаление отметки
    response = client.delete(f"/api/marks/{mark_id}", headers=headers)
    assert response.status_code == 204

    # Убедиться, что отметка удалена
    response = client.get(f"/api/marks/habit/{habit_id}", headers=headers)
    assert response.status_code == 200
    marks_list = response.json()
    assert all(m["id"] != mark_id for m in marks_list)
