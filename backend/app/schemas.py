from pydantic import BaseModel, Field, validator
from uuid import UUID
from typing import Optional, List
from datetime import date
import re

class UserCreate(BaseModel):
    username: str
    password: str
    
    @validator('username')
    def username_must_be_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]{3,20}$', v):
            raise ValueError('Имя пользователя должно содержать от 3 до 20 символов и может включать только буквы, цифры, дефис и подчеркивание')
        return v
        
    @validator('password')
    def password_must_be_valid(cls, v):
        if not re.match(r'^[a-zA-Z0-9@#$%^&+=]{6,20}$', v):
            raise ValueError('Пароль должен содержать от 6 до 20 символов и может включать буквы, цифры и специальные символы (@#$%^&+=)')
        return v

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
    archived: Optional[bool] = None


class HabitRead(HabitBase):
    id: UUID
    user_id: UUID
    completed: bool

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