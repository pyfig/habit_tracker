from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from datetime import date

from app.db import get_db
from app.models import Mark, Habit, User
from app.schemas import MarkCreate, MarkRead
from app.auth import get_current_user

router = APIRouter(prefix="/marks", tags=["marks"])

@router.post("/", response_model=MarkRead)
async def create_mark(mark_data: MarkCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == mark_data.habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found or doesn't belong to current user")
    
    existing_mark = db.query(Mark).filter(Mark.habit_id == mark_data.habit_id, Mark.date == mark_data.date).first()
    if existing_mark:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mark for this date already exists")
    
    new_mark = Mark(
        habit_id=mark_data.habit_id,
        date=mark_data.date
    )
    db.add(new_mark)
    db.commit()
    db.refresh(new_mark)
    return new_mark

@router.get("/habit/{habit_id}", response_model=List[MarkRead])
async def get_marks_by_habit(habit_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == current_user.id).first()
    if not habit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Habit not found or doesn't belong to current user")
    
    marks = db.query(Mark).filter(Mark.habit_id == habit_id).all()
    return marks

@router.delete("/{mark_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_mark(mark_id: UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mark = db.query(Mark).join(Habit).filter(
        Mark.id == mark_id,
        Habit.user_id == current_user.id
    ).first()
    
    if not mark:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mark not found or doesn't belong to current user")
    
    db.delete(mark)
    db.commit()
    return None