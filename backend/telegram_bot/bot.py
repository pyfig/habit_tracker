import os
import logging
import asyncio
from datetime import datetime
from telegram import Bot
from telegram.error import TelegramError
from typing import Optional, List
import json

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class TelegramNotifier:
    def __init__(self, token: str, chat_id: Optional[str] = None):
        """
        Initialize Telegram notifier
        
        Args:
            token: Telegram bot token
            chat_id: Default chat ID for notifications (optional)
        """
        self.bot = Bot(token=token)
        self.chat_id = chat_id
        self._validate_token()
    
    def _validate_token(self):
        """Validate the bot token by making a test request"""
        try:
            # Test the bot by getting its info
            bot_info = asyncio.run(self.bot.get_me())
            logger.info(f"Bot initialized successfully: @{bot_info.username}")
        except Exception as e:
            logger.error(f"Failed to initialize bot: {e}")
            raise
    
    async def send_notification(self, message: str, chat_id: Optional[str] = None) -> bool:
        """
        Send a notification message
        
        Args:
            message: Message to send
            chat_id: Chat ID to send to (uses default if not provided)
            
        Returns:
            bool: True if message sent successfully, False otherwise
        """
        target_chat_id = chat_id or self.chat_id
        if not target_chat_id:
            logger.error("No chat_id provided and no default chat_id set")
            return False
        
        try:
            await self.bot.send_message(
                chat_id=target_chat_id,
                text=message,
                parse_mode='HTML'
            )
            logger.info(f"Notification sent successfully to {target_chat_id}")
            return True
        except TelegramError as e:
            logger.error(f"Failed to send notification: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending notification: {e}")
            return False
    
    async def send_startup_notification(self, service_name: str = "Habit Tracker") -> bool:
        """Send startup notification"""
        message = f"🚀 <b>{service_name}</b> started successfully!\n"
        message += f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        message += "✅ All services are running"
        return await self.send_notification(message)
    
    async def send_shutdown_notification(self, service_name: str = "Habit Tracker") -> bool:
        """Send shutdown notification"""
        message = f"🛑 <b>{service_name}</b> is shutting down\n"
        message += f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        return await self.send_notification(message)
    
    async def send_error_notification(self, error: str, service_name: str = "Habit Tracker") -> bool:
        """Send error notification"""
        message = f"❌ <b>{service_name}</b> encountered an error\n"
        message += f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        message += f"🔍 Error: {error}"
        return await self.send_notification(message)
    
    async def send_health_check(self, status: str, service_name: str = "Habit Tracker") -> bool:
        """Send health check notification"""
        emoji = "✅" if status == "healthy" else "⚠️" if status == "warning" else "❌"
        message = f"{emoji} <b>{service_name}</b> Health Check\n"
        message += f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
        message += f"📊 Status: {status.capitalize()}"
        return await self.send_notification(message)

def create_notifier() -> Optional[TelegramNotifier]:
    """Create a Telegram notifier instance from environment variables"""
    token = os.getenv('TELEGRAM_BOT_TOKEN')
    chat_id = os.getenv('TELEGRAM_CHAT_ID')
    
    if not token:
        logger.warning("TELEGRAM_BOT_TOKEN not set, notifications disabled")
        return None
    
    if not chat_id:
        logger.warning("TELEGRAM_CHAT_ID not set, notifications disabled")
        return None
    
    try:
        return TelegramNotifier(token=token, chat_id=chat_id)
    except Exception as e:
        logger.error(f"Failed to create Telegram notifier: {e}")
        return None

# Convenience functions for easy use
async def send_startup_notification(service_name: str = "Habit Tracker"):
    """Send startup notification"""
    notifier = create_notifier()
    if notifier:
        await notifier.send_startup_notification(service_name)

async def send_shutdown_notification(service_name: str = "Habit Tracker"):
    """Send shutdown notification"""
    notifier = create_notifier()
    if notifier:
        await notifier.send_shutdown_notification(service_name)

async def send_error_notification(error: str, service_name: str = "Habit Tracker"):
    """Send error notification"""
    notifier = create_notifier()
    if notifier:
        await notifier.send_error_notification(error, service_name)

async def send_health_check(status: str, service_name: str = "Habit Tracker"):
    """Send health check notification"""
    notifier = create_notifier()
    if notifier:
        await notifier.send_health_check(status, service_name)