from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db import get_db
from app.models import Habit, User
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
    # Возвращаем только активные (неархивные и невыполненные) привычки
    habits = (
        db.query(Habit)
          .filter(
              Habit.user_id == current_user.id,
              Habit.archived == False,
              Habit.completed == False  # исключаем выполненные
          )
          .all()
    )
    return habits


@router.get("/{habit_id}", response_model=HabitRead)
async def get_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found")
    return habit

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

@router.post("/{habit_id}/archive", status_code=status.HTTP_204_NO_CONTENT)
async def archive_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found or doesn't belong to current user")
    
    
    habit.archived = True  
    db.commit()
    db.refresh(habit)
    return None

@router.get("/completed", response_model=List[HabitRead])
async def get_completed_habits(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    completed_habits = (
        db.query(Habit)
          .filter(
              Habit.user_id == current_user.id,
              Habit.completed == True
          )
          .all()
    )
    return completed_habits



@router.post("/{habit_id}/complete", status_code=status.HTTP_204_NO_CONTENT)
async def complete_habit(
    habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found or doesn't belong to current user")
    
    # Помечаем привычку как выполненную
    habit.completed = True  
    db.commit()
    db.refresh(habit)
    return None
