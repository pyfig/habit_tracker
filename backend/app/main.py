from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import func
from prometheus_fastapi_instrumentator import Instrumentator

from app.routes import auth, habits, marks, profile  # добавлен profile
from app.models import Base
from app.db import engine

# Создаем таблицы в базе данных
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Habit Tracker API")

# Настройка CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:*",
    "http://127.0.0.1:*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем маршруты
app.include_router(auth.router, prefix="/api")
app.include_router(habits.router, prefix="/api")
app.include_router(marks.router, prefix="/api")
app.include_router(profile.router, prefix="/api")  # новый роутер

@app.get("/")
async def root():
    return {"message": "Welcome to Habit Tracker API"}

# Обработчик HTTPException – возвращает детальное сообщение
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"message": exc.detail})

# Обработчик ошибок валидации – возвращает одно сообщение
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(status_code=400, content={"message": "Validation error"})

# Общий обработчик непредвиденных ошибок
@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"message": "Internal server error"})

# Настройка Prometheus-инструментатора
Instrumentator().instrument(app).expose(app)
