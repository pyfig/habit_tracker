from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db
from app.models import Habit, Mark, User
from app.schemas import Profile
from app.auth import get_current_user

router = APIRouter(tags=["profile"])

@router.get("/", response_model=Profile)
async def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Общее количество привычек
    total_habits = db.query(func.count(Habit.id)).filter(Habit.user_id == current_user.id).scalar()
    # Количество архивированных привычек
    archived_habits = db.query(func.count(Habit.id)).filter(Habit.user_id == current_user.id, Habit.is_archived == True).scalar()
    # Количество выполнений привычек (меток)
    completed_habits = db.query(func.count(Mark.id)).join(Habit).filter(Habit.user_id == current_user.id).scalar()
    # Количество уникальных "зелёных" дней
    green_days = db.query(func.count(func.distinct(Mark.date))).join(Habit).filter(Habit.user_id == current_user.id).scalar()
    return {
        "total_habits": total_habits,
        "completed_habits": completed_habits,
        "green_days": green_days,
        "archived_habits": archived_habits
    }
