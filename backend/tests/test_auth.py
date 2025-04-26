import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db import Base, engine, get_db
from sqlalchemy.orm import sessionmaker

# Настраиваем тестовую БД SQLite (в памяти)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
TestEngine = engine  # здесь можно перенастроить engine на SQLite, если требуется

# Создаем таблицы в тестовой БД
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_register_and_login():
    # Регистрируем пользователя
    response = client.post("/api/auth/register", json={"username": "user1", "password": "pass123"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "user1"

    # Повторная регистрация тем же именем должна дать ошибку
    response = client.post("/api/auth/register", json={"username": "user1", "password": "pass123"})
    assert response.status_code == 400

    # Успешный вход
    response = client.post("/api/auth/login", json={"username": "user1", "password": "pass123"})
    assert response.status_code == 200
    token = response.json().get("access_token")
    assert token is not None

    # Неправильный пароль
    response = client.post("/api/auth/login", json={"username": "user1", "password": "wrong"})
    assert response.status_code == 401
