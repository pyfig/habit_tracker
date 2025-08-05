# Telegram Bot Integration Setup

This guide explains how to set up and use Telegram notifications in the Habit Tracker application.

## Prerequisites

1. A Telegram account
2. Access to create a Telegram bot

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a conversation with BotFather by sending `/start`
3. Create a new bot by sending `/newbot`
4. Choose a name for your bot (e.g., "My Habit Tracker Bot")
5. Choose a username for your bot (must end with "bot", e.g., "myhabittracker_bot")
6. BotFather will provide you with a bot token. **Save this token securely!**

Example token format: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

## Step 2: Configure the Application

### Option A: Using the setup script
```bash
# Set your bot token
export TELEGRAM_BOT_TOKEN=your_bot_token_here

# Run the setup
./main.sh --setup-telegram
```

### Option B: Manual configuration
1. Create a `.env` file in the project root:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
DAILY_REMINDER_TIME=09:00
```

2. Start the application:
```bash
./main.sh
```

## Step 3: Get Your Chat ID

1. Start a conversation with your bot by searching for its username in Telegram
2. Send `/start` to your bot
3. To find your Chat ID, you can:
   - Use `@userinfobot` in Telegram to get your Chat ID
   - Or check the bot logs after sending a message
   - Or use the test endpoint to verify

## Step 4: Configure Notifications in the App

### Via API
```bash
# Set your Telegram Chat ID
curl -X POST "http://localhost:8000/api/telegram/settings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"telegram_chat_id": "your_chat_id"}'
```

### Via Web Interface
1. Open the Habit Tracker web app
2. Go to Settings/Profile
3. Enter your Telegram Chat ID
4. Save the settings

## Features

### 1. Daily Reminders
- Automated reminders sent at a configurable time (default: 9:00 AM)
- Lists all incomplete habits for the day
- Only sent if you have incomplete habits

### 2. Streak Notifications
- Automatic notifications when you complete habits
- Special messages for milestones (1, 7, 30 days, every 10 days)
- Sent immediately when you mark a habit as complete

### 3. Manual Notifications
Send a manual reminder for today's habits:
```bash
curl -X POST "http://localhost:8000/api/telegram/send-reminder" \
  -H "Authorization: Bearer your_jwt_token"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/telegram/settings` | Set Telegram Chat ID |
| GET | `/api/telegram/settings` | Get current settings |
| DELETE | `/api/telegram/settings` | Remove Telegram settings |
| POST | `/api/telegram/send-reminder` | Send manual reminder |
| POST | `/api/telegram/send-streak-notification/{habit_id}` | Send streak notification |
| GET | `/api/telegram/bot-info` | Check bot status |
| POST | `/api/telegram/send-daily-reminders` | Trigger daily reminders (admin) |

## Troubleshooting

### Check Bot Status
```bash
./main.sh --check-telegram
```

### Send Test Message
```bash
# Set your chat ID first
export TELEGRAM_CHAT_ID=your_chat_id

./main.sh --send-test-notification
```

### Common Issues

1. **Bot token invalid**: Verify the token from BotFather
2. **Chat ID not working**: Make sure you've started a conversation with the bot first
3. **Messages not arriving**: Check that the bot isn't blocked and notifications are enabled
4. **Service not starting**: Check Docker logs: `docker-compose logs telegram-scheduler`

### View Logs
```bash
# All services
docker-compose logs -f

# Just Telegram scheduler
docker-compose logs -f telegram-scheduler

# Backend logs
docker-compose logs -f backend
```

## Customization

### Change Reminder Time
Set the `DAILY_REMINDER_TIME` environment variable:
```env
DAILY_REMINDER_TIME=08:00  # 8:00 AM
DAILY_REMINDER_TIME=20:30  # 8:30 PM
```

### Disable Telegram
Run without Telegram services:
```bash
./main.sh --no-telegram
```

## Security Notes

1. **Keep your bot token secure** - never commit it to version control
2. **Chat IDs are personal** - don't share them
3. **Bot permissions** - your bot can only send messages to users who have started a conversation with it
4. **Rate limits** - Telegram has rate limits for bot messages

## Message Examples

### Daily Reminder
```
🎯 Daily Habit Reminder - 2024-01-15

Don't forget to complete your habits today:

• Drink 8 glasses of water
  📝 Stay hydrated throughout the day
• 30 minutes exercise
• Read for 20 minutes

💪 You've got this! Stay consistent!
```

### Streak Notification
```
🔥 Amazing! You've completed 'Exercise' for 7 days straight!
```

## Advanced Configuration

### Custom Messages
You can modify messages by editing `/backend/app/telegram_service.py`

### Additional Notifications
- Weekly summaries
- Achievement notifications
- Habit streak warnings
- Custom motivational messages

All of these can be implemented by extending the `TelegramBot` class in the service module.