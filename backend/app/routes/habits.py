from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import date

from app.db import get_db
from app.models import Habit, User, Mark
from app.schemas import HabitCreate, HabitRead, HabitUpdate
from app.auth import get_current_user
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/habits", tags=["habits"])

@router.post("/", response_model=HabitRead)
async def create_habit(habit_data: HabitCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        new_habit = Habit(
            user_id=current_user.id,
            name=habit_data.name,
            description=habit_data.description
        )
        db.add(new_habit)
        db.commit()
        db.refresh(new_habit)
        return new_habit
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Habit already exists or other integrity error")

@router.get("/", response_model=List[HabitRead])
async def get_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Habit)
          .filter(Habit.user_id == current_user.id, Habit.archived == False)
          .all()
    )

@router.put("/{habit_id}", response_model=HabitRead)
async def update_habit(habit_id: UUID, habit_data: HabitUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    for key, value in habit_data.dict(exclude_unset=True).items():
        setattr(habit, key, value)
    db.commit()
    db.refresh(habit)
    return habit

@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    db.delete(habit)
    db.commit()
    return None

@router.get("/archived", response_model=List[HabitRead])
async def get_archived_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Habit)
          .filter(Habit.user_id == current_user.id, Habit.archived.is_(True))
          .all()
    )

@router.get("/completed", response_model=List[HabitRead])
async def get_completed_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Habit)
          .join(Mark)
          .filter(
              Habit.user_id == current_user.id,
              Habit.completed.is_(True),
              Mark.date == date.today(),
          )
          .all()
    )

@router.post("/{habit_id}/complete", status_code=status.HTTP_204_NO_CONTENT)
async def complete_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    existing_mark = db.query(Mark).filter(Mark.habit_id == habit_id, Mark.date == date.today()).first()
    if not existing_mark:
        db.add(Mark(habit_id=habit_id, date=date.today()))
    habit.completed = True
    db.commit()
    return None

@router.post("/{habit_id}/uncomplete", status_code=status.HTTP_204_NO_CONTENT)
async def uncomplete_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    mark = db.query(Mark).filter(Mark.habit_id == habit_id, Mark.date == date.today()).first()
    if mark:
        db.delete(mark)
    habit.completed = False
    db.commit()
    return None

@router.post("/{habit_id}/archive")
async def archive_habit(habit_id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Привычка не найдена")
    habit.archived = True
    db.commit()
    db.refresh(habit)
    return habit

@router.post("/{habit_id}/restore", response_model=HabitRead)
async def restore_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Не найдена привычка")
    habit.archived = False
    db.commit()
    db.refresh(habit)
    return habit
