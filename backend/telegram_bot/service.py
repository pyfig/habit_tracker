#!/usr/bin/env python3
"""
Standalone Telegram Bot Service
This service runs independently and provides notification functionality
"""

import os
import asyncio
import logging
import signal
import sys
from datetime import datetime
from telegram_bot.bot import TelegramNotifier, create_notifier

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class TelegramBotService:
    def __init__(self):
        self.notifier = create_notifier()
        self.running = False
        
    async def start(self):
        """Start the Telegram bot service"""
        if not self.notifier:
            logger.error("Telegram notifier not available, exiting")
            return
        
        self.running = True
        logger.info("Telegram Bot Service started")
        
        # Send startup notification
        await self.notifier.send_startup_notification("Telegram Bot Service")
        
        # Keep the service running
        while self.running:
            try:
                await asyncio.sleep(60)  # Check every minute
            except asyncio.CancelledError:
                break
    
    async def stop(self):
        """Stop the Telegram bot service"""
        self.running = False
        if self.notifier:
            await self.notifier.send_shutdown_notification("Telegram Bot Service")
        logger.info("Telegram Bot Service stopped")
    
    async def send_test_message(self):
        """Send a test message"""
        if self.notifier:
            await self.notifier.send_notification("🧪 Test message from Telegram Bot Service")

async def main():
    """Main function"""
    service = TelegramBotService()
    
    # Handle shutdown signals
    def signal_handler(signum, frame):
        logger.info(f"Received signal {signum}, shutting down...")
        asyncio.create_task(service.stop())
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        await service.start()
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
    except Exception as e:
        logger.error(f"Service error: {e}")
        if service.notifier:
            await service.notifier.send_error_notification(str(e))
    finally:
        await service.stop()

if __name__ == "__main__":
    # Check if we should send a test message
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        async def test():
            service = TelegramBotService()
            await service.send_test_message()
            await service.stop()
        
        asyncio.run(test())
    else:
        asyncio.run(main())