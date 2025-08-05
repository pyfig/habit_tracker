# Telegram Bot Integration

This project includes a Telegram bot for sending notifications about the Habit Tracker application status.

## Features

- ✅ Startup notifications when services start
- ✅ Shutdown notifications when services stop
- ✅ Error notifications when issues occur
- ✅ Health check notifications
- ✅ Test message functionality
- ✅ Integration with Docker Compose
- ✅ Environment-based configuration

## Setup Instructions

### 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (you'll need it later)

### 2. Get Your Chat ID

1. Start a conversation with your bot
2. Send any message to the bot
3. Visit this URL in your browser (replace with your bot token):
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. Look for the `"chat":{"id":` field in the response
5. Save the chat ID (it's usually a negative number for private chats)

### 3. Configure Environment Variables

Set the environment variables in your shell:

```bash
export TELEGRAM_BOT_TOKEN=your_bot_token_here
export TELEGRAM_CHAT_ID=your_chat_id_here
```

Or create a `.env` file in the project root:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

### 4. Test the Bot

Run the test script to verify your configuration:

```bash
./test_telegram.sh
```

## Usage

### Starting the Application

The Telegram bot is automatically started with the main application:

```bash
./main.sh
```

This will:
- Send a startup notification when deployment begins
- Send a success notification when all services are running
- Send an error notification if deployment fails

### Manual Testing

You can test the bot manually:

```bash
# Test the standalone service
docker-compose run --rm telegram-bot python service.py test

# Or test via curl
curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  -d "text=Test message" \
  -d "parse_mode=HTML"
```

## Docker Compose Integration

The Telegram bot is included as a service in `docker-compose.yml`:

```yaml
telegram-bot:
  build: 
    context: ./backend
    dockerfile: telegram_bot/Dockerfile
  environment:
    - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN:-}
    - TELEGRAM_CHAT_ID=${TELEGRAM_CHAT_ID:-}
  networks: [habit-network]
  restart: always
  depends_on:
    - backend
```

## Notification Types

### Startup Notification
```
🚀 Habit Tracker started successfully!
⏰ Time: 2024-01-15 10:30:00
✅ All services are running
```

### Shutdown Notification
```
🛑 Habit Tracker is shutting down
⏰ Time: 2024-01-15 10:30:00
```

### Error Notification
```
❌ Habit Tracker encountered an error
⏰ Time: 2024-01-15 10:30:00
🔍 Error: Service connection failed
```

### Health Check Notification
```
✅ Habit Tracker Health Check
⏰ Time: 2024-01-15 10:30:00
📊 Status: Healthy
```

## Troubleshooting

### Bot Not Sending Messages

1. Check that `TELEGRAM_BOT_TOKEN` is correct
2. Check that `TELEGRAM_CHAT_ID` is correct
3. Make sure you've started a conversation with your bot
4. Check the bot logs: `docker-compose logs telegram-bot`

### Common Issues

- **"Forbidden" error**: Make sure you've started a conversation with your bot
- **"Chat not found" error**: Check that the chat ID is correct
- **"Unauthorized" error**: Check that the bot token is correct

### Getting Help

1. Check the Docker logs: `docker-compose logs telegram-bot`
2. Test the bot manually using the test script
3. Verify your bot token and chat ID are correct

## Security Notes

- Never commit your bot token to version control
- Use environment variables for sensitive data
- The bot token should be kept secret
- Consider using a dedicated bot for production environments

## API Reference

The bot uses the Telegram Bot API. For more information, visit:
https://core.telegram.org/bots/api