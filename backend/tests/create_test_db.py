#!/usr/bin/env python3
import os
import sys

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.db import engine, Base
from app.models import User, Habit, Mark

def create_test_db():
    print("Creating test database tables...")
    Base.metadata.create_all(bind=engine)
    print("Test database tables created successfully!")

if __name__ == "__main__":
    create_test_db() 