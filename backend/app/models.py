from sqlalchemy import Column, String, Text, ForeignKey, Date, Boolean  
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")

class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    archived = Column(Boolean, default=False, nullable=False)    
    completed = Column(Boolean, default=False) 
    user = relationship("User", back_populates="habits")
    marks = relationship("Mark", back_populates="habit", cascade="all, delete-orphan")

class Mark(Base):
    __tablename__ = "marks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    habit_id = Column(UUID(as_uuid=True), ForeignKey("habits.id"), nullable=False)
    date = Column(Date, nullable=False)
    
    habit = relationship("Habit", back_populates="marks")