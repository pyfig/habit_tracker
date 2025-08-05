from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, habits, marks, profile, telegram
from app.models import Base
from app.db import engine

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
app.include_router(profile.router, prefix="/api")
app.include_router(telegram.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup"""
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Welcome to Habit Tracker API"}