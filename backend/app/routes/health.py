from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from app.db import engine
import asyncio
import sys
import os

# Add the parent directory to the path to import telegram_bot
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
try:
    from telegram_bot.bot import send_health_check
except ImportError:
    # Telegram bot not available, create dummy function
    async def send_health_check(*args, **kwargs):
        pass

router = APIRouter()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            result.fetchone()
        
        # Send health check notification
        try:
            await send_health_check("healthy", "Habit Tracker Backend")
        except Exception as e:
            print(f"Failed to send health check notification: {e}")
        
        return {
            "status": "healthy",
            "database": "connected",
            "message": "All systems operational"
        }
    except Exception as e:
        # Send error notification
        try:
            await send_health_check("error", "Habit Tracker Backend")
        except Exception as notification_error:
            print(f"Failed to send error notification: {notification_error}")
        
        raise HTTPException(
            status_code=503,
            detail=f"Service unhealthy: {str(e)}"
        )

@router.post("/health/notify")
async def send_health_notification():
    """Manually trigger a health notification"""
    try:
        await send_health_check("manual", "Habit Tracker Backend")
        return {"message": "Health notification sent successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to send notification: {str(e)}"
        )