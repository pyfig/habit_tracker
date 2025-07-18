from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.db import get_db
from app.models import User, Habit, Mark
from app.auth import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/metrics")
async def get_metrics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_habits = db.query(Habit).filter(Habit.user_id == current_user.id).count()
    archived_habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.archived.is_(True)).count()
    completed_habits = (
        db.query(Habit)
          .join(Mark)
          .filter(Habit.user_id == current_user.id, Mark.date == date.today())
          .count()
    )
    active_habits = db.query(Habit).filter(Habit.user_id == current_user.id, Habit.archived.is_(False)).count()
    marks_total = db.query(Mark).join(Habit).filter(Habit.user_id == current_user.id).count()
    marks_today = db.query(Mark).join(Habit).filter(Habit.user_id == current_user.id, Mark.date == date.today()).count()
    return {
        "total_habits": total_habits,
        "archived_habits": archived_habits,
        "completed_habits": completed_habits,
        "active_habits": active_habits,
        "marks_total": marks_total,
        "marks_today": marks_today,
    }
