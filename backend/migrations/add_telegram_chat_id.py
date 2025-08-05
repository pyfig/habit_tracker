#!/usr/bin/env python3
"""
Migration: Add telegram_chat_id to users table
"""

import os
import sys
sys.path.append('/app')

from sqlalchemy import text
from app.db import engine

def run_migration():
    """Add telegram_chat_id column to users table"""
    try:
        with engine.connect() as connection:
            # Check if column exists
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='users' AND column_name='telegram_chat_id'
            """))
            
            if not result.fetchone():
                # Column doesn't exist, add it
                connection.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN telegram_chat_id VARCHAR NULL
                """))
                connection.commit()
                print("✅ Added telegram_chat_id column to users table")
            else:
                print("ℹ️  telegram_chat_id column already exists")
                
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        raise

if __name__ == "__main__":
    run_migration()