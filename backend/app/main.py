from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, habits, marks
from app.models import Base
from app.db import engine

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене следует указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем маршруты
app.include_router(auth.router)
app.include_router(habits.router)
app.include_router(marks.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Habit Tracker API"}