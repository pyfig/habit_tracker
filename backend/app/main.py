from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, habits, marks, profile, health
from app.models import Base
from app.db import engine
import asyncio
import sys
import os

# Add the parent directory to the path to import telegram_bot
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from telegram_bot.bot import send_startup_notification, send_shutdown_notification
except ImportError:
    # Telegram bot not available, create dummy functions
    async def send_startup_notification(*args, **kwargs):
        pass
    
    async def send_shutdown_notification(*args, **kwargs):
        pass

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
app.include_router(health.router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Create database tables on startup and send startup notification"""
    Base.metadata.create_all(bind=engine)
    
    # Send startup notification
    try:
        await send_startup_notification("Habit Tracker Backend")
    except Exception as e:
        print(f"Failed to send startup notification: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Send shutdown notification"""
    try:
        await send_shutdown_notification("Habit Tracker Backend")
    except Exception as e:
        print(f"Failed to send shutdown notification: {e}")


@app.get("/")
async def root():
    return {"message": "Welcome to Habit Tracker API"}