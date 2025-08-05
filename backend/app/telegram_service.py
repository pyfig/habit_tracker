import os
import logging
import asyncio
from typing import Optional, List
import requests
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import User, Habit, Mark

logger = logging.getLogger(__name__)

class TelegramBot:
    def __init__(self):
        self.bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
        self.base_url = f"https://api.telegram.org/bot{self.bot_token}"
        
    def send_message(self, chat_id: str, message: str) -> bool:
        """Send a message to a Telegram chat"""
        if not self.bot_token:
            logger.error("TELEGRAM_BOT_TOKEN not set")
            return False
            
        url = f"{self.base_url}/sendMessage"
        payload = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                logger.info(f"Message sent successfully to chat {chat_id}")
                return True
            else:
                logger.error(f"Failed to send message: {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending message: {str(e)}")
            return False
    
    def send_habit_reminder(self, chat_id: str, habits: List[dict]) -> bool:
        """Send habit reminder notification"""
        if not habits:
            return True
            
        today = datetime.now().strftime("%Y-%m-%d")
        message = f"🎯 <b>Daily Habit Reminder - {today}</b>\n\n"
        message += "Don't forget to complete your habits today:\n\n"
        
        for habit in habits:
            message += f"• {habit['name']}\n"
            if habit.get('description'):
                message += f"  📝 {habit['description']}\n"
        
        message += f"\n💪 You've got this! Stay consistent!"
        
        return self.send_message(chat_id, message)
    
    def send_streak_notification(self, chat_id: str, habit_name: str, streak_count: int) -> bool:
        """Send streak achievement notification"""
        if streak_count == 1:
            message = f"🎉 Great start! You completed '<b>{habit_name}</b>' today!"
        elif streak_count == 7:
            message = f"🔥 Amazing! You've completed '<b>{habit_name}</b>' for 7 days straight!"
        elif streak_count == 30:
            message = f"🏆 Incredible! You've completed '<b>{habit_name}</b>' for 30 days straight!"
        elif streak_count % 10 == 0:
            message = f"💎 Outstanding! You've completed '<b>{habit_name}</b>' for {streak_count} days straight!"
        else:
            message = f"✅ You completed '<b>{habit_name}</b>' today! Current streak: {streak_count} days"
            
        return self.send_message(chat_id, message)
    
    def send_weekly_summary(self, chat_id: str, user_stats: dict) -> bool:
        """Send weekly progress summary"""
        message = f"📊 <b>Weekly Progress Summary</b>\n\n"
        message += f"This week you completed:\n"
        message += f"• {user_stats.get('completed_habits', 0)} habits\n"
        message += f"• {user_stats.get('completion_rate', 0):.1f}% completion rate\n"
        message += f"• Longest streak: {user_stats.get('longest_streak', 0)} days\n\n"
        
        if user_stats.get('completion_rate', 0) >= 80:
            message += "🌟 Excellent work! Keep it up!"
        elif user_stats.get('completion_rate', 0) >= 60:
            message += "👍 Good progress! You're doing well!"
        else:
            message += "💪 There's room for improvement. You can do it!"
            
        return self.send_message(chat_id, message)

# Global bot instance
telegram_bot = TelegramBot()

def get_user_incomplete_habits(user_id: int, db: Session) -> List[dict]:
    """Get user's incomplete habits for today"""
    today = datetime.now().date()
    
    # Get all active habits for user
    habits = db.query(Habit).filter(
        Habit.user_id == user_id,
        Habit.archived == False
    ).all()
    
    incomplete_habits = []
    for habit in habits:
        # Check if habit is completed today
        mark = db.query(Mark).filter(
            Mark.habit_id == habit.id,
            Mark.date == today
        ).first()
        
        if not mark:
            incomplete_habits.append({
                'id': habit.id,
                'name': habit.name,
                'description': habit.description
            })
    
    return incomplete_habits

def calculate_streak(habit_id: int, db: Session) -> int:
    """Calculate current streak for a habit"""
    marks = db.query(Mark).filter(
        Mark.habit_id == habit_id
    ).order_by(Mark.date.desc()).all()
    
    if not marks:
        return 0
    
    today = datetime.now().date()
    streak = 0
    current_date = today
    
    for mark in marks:
        if mark.date == current_date:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
    
    return streak

def send_daily_reminders():
    """Send daily reminders to all users with Telegram chat IDs"""
    try:
        db = next(get_db())
        users = db.query(User).filter(User.telegram_chat_id.isnot(None)).all()
        
        for user in users:
            incomplete_habits = get_user_incomplete_habits(user.id, db)
            if incomplete_habits:
                telegram_bot.send_habit_reminder(user.telegram_chat_id, incomplete_habits)
                
    except Exception as e:
        logger.error(f"Error sending daily reminders: {str(e)}")
    finally:
        db.close()