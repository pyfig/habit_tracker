from sqlalchemy import Column, String, Text, ForeignKey, Date, Boolean
from sqlalchemy.orm import relationship
from app.db import Base
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")

class Habit(Base):
    __tablename__ = "habits"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    archived = Column(Boolean, default=False, nullable=False)
    completed = Column(Boolean, default=False)
    user = relationship("User", back_populates="habits")
    marks = relationship("Mark", back_populates="habit", cascade="all, delete-orphan")

class Mark(Base):
    __tablename__ = "marks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    habit_id = Column(String, ForeignKey("habits.id"), nullable=False)
    date = Column(Date, nullable=False)
    habit = relationship("Habit", back_populates="marks")
