#!/usr/bin/env python3
"""
Telegram Notification Scheduler
Sends daily habit reminders to users
"""

import os
import sys
import time
import schedule
import logging
from datetime import datetime

# Add the app directory to the Python path
sys.path.append('/app')

from app.telegram_service import send_daily_reminders
from app.db import engine
from app.models import Base

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/telegram_scheduler.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def job():
    """Job function that runs daily reminders"""
    try:
        logger.info("Starting daily reminder job")
        send_daily_reminders()
        logger.info("Daily reminder job completed successfully")
    except Exception as e:
        logger.error(f"Error in daily reminder job: {str(e)}")

def main():
    """Main scheduler function"""
    logger.info("Starting Telegram notification scheduler")
    
    # Ensure database tables exist
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables ensured")
    except Exception as e:
        logger.error(f"Database error: {str(e)}")
        return
    
    # Schedule daily reminders
    reminder_time = os.getenv("DAILY_REMINDER_TIME", "09:00")  # Default 9:00 AM
    schedule.every().day.at(reminder_time).do(job)
    
    logger.info(f"Scheduled daily reminders at {reminder_time}")
    
    # Keep the scheduler running
    while True:
        try:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Scheduler stopped by user")
            break
        except Exception as e:
            logger.error(f"Scheduler error: {str(e)}")
            time.sleep(60)  # Wait before retrying

if __name__ == "__main__":
    main()