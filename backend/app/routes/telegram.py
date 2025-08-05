from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Optional
from pydantic import BaseModel

from app.db import get_db
from app.models import User, Habit
from app.auth import get_current_user
from app.telegram_service import telegram_bot, get_user_incomplete_habits, calculate_streak, send_daily_reminders

router = APIRouter(prefix="/telegram", tags=["telegram"])

class TelegramSettings(BaseModel):
    telegram_chat_id: str

class NotificationRequest(BaseModel):
    message: str

class TestNotificationRequest(BaseModel):
    chat_id: str
    message: str

@router.post("/settings")
async def update_telegram_settings(
    settings: TelegramSettings,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Update user's Telegram chat ID for notifications"""
    current_user.telegram_chat_id = settings.telegram_chat_id
    db.commit()
    return {"message": "Telegram settings updated successfully"}

@router.get("/settings")
async def get_telegram_settings(
    current_user: User = Depends(get_current_user)
) -> Dict[str, Optional[str]]:
    """Get user's current Telegram settings"""
    return {"telegram_chat_id": current_user.telegram_chat_id}

@router.delete("/settings")
async def remove_telegram_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Remove user's Telegram chat ID"""
    current_user.telegram_chat_id = None
    db.commit()
    return {"message": "Telegram settings removed successfully"}

@router.post("/send-reminder")
async def send_habit_reminder(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Send habit reminder to user's Telegram"""
    if not current_user.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Telegram chat ID not configured")
    
    incomplete_habits = get_user_incomplete_habits(current_user.id, db)
    
    if not incomplete_habits:
        return {"message": "No incomplete habits for today"}
    
    success = telegram_bot.send_habit_reminder(current_user.telegram_chat_id, incomplete_habits)
    
    if success:
        return {"message": "Reminder sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send reminder")

@router.post("/send-streak-notification/{habit_id}")
async def send_streak_notification(
    habit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Send streak notification for a specific habit"""
    if not current_user.telegram_chat_id:
        raise HTTPException(status_code=400, detail="Telegram chat ID not configured")
    
    habit = db.query(Habit).filter(
        Habit.id == habit_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    streak_count = calculate_streak(habit_id, db)
    success = telegram_bot.send_streak_notification(
        current_user.telegram_chat_id, 
        habit.name, 
        streak_count
    )
    
    if success:
        return {"message": "Streak notification sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send notification")

@router.post("/test-message")
async def send_test_message(
    test_request: TestNotificationRequest
) -> Dict[str, str]:
    """Send a test message to verify bot is working (admin only)"""
    success = telegram_bot.send_message(test_request.chat_id, test_request.message)
    
    if success:
        return {"message": "Test message sent successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to send test message")

@router.post("/send-daily-reminders")
async def trigger_daily_reminders(
    background_tasks: BackgroundTasks
) -> Dict[str, str]:
    """Trigger daily reminders for all users (admin/cron endpoint)"""
    background_tasks.add_task(send_daily_reminders)
    return {"message": "Daily reminders queued for sending"}

@router.get("/bot-info")
async def get_bot_info() -> Dict[str, str]:
    """Get basic bot information"""
    import os
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    
    if not bot_token:
        return {"status": "Bot token not configured"}
    
    # Try to get bot info
    import requests
    try:
        url = f"https://api.telegram.org/bot{bot_token}/getMe"
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            bot_data = response.json()
            if bot_data.get("ok"):
                result = bot_data.get("result", {})
                return {
                    "status": "Bot is active",
                    "bot_name": result.get("first_name", "Unknown"),
                    "bot_username": result.get("username", "Unknown")
                }
        
        return {"status": "Bot token invalid or bot not accessible"}
        
    except Exception as e:
        return {"status": f"Error checking bot: {str(e)}"}