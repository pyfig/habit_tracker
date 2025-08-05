#!/usr/bin/env python3
import os
import sys

os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from app.db import engine, Base
from app.models import User, Habit, Mark

def test_db_setup():
    print("Creating test database tables...")
    Base.metadata.create_all(bind=engine)
    print("Test database tables created successfully!")
    
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Tables in database: {tables}")
    
    from app.db import SessionLocal
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"Users in database: {len(users)}")
    except Exception as e:
        print(f"Error querying users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_db_setup() 