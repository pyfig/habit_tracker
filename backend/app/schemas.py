from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List
from datetime import date

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: UUID
    username: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class HabitBase(BaseModel):
    name: str
    description: Optional[str] = None

class HabitCreate(HabitBase):
    pass

class HabitUpdate(HabitBase):
    name: Optional[str] = None

class HabitRead(HabitBase):
    id: UUID
    user_id: UUID

    class Config:
        orm_mode = True

class MarkCreate(BaseModel):
    habit_id: UUID
    date: date

class MarkRead(BaseModel):
    id: UUID
    habit_id: UUID
    date: date

    class Config:
        orm_mode = True