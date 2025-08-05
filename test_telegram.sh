#!/bin/bash

# Test Telegram Bot functionality
# Usage: ./test_telegram.sh

set -e

echo "🧪 Testing Telegram Bot functionality..."

# Check if environment variables are set
if [[ -z "$TELEGRAM_BOT_TOKEN" ]]; then
    echo "❌ TELEGRAM_BOT_TOKEN is not set"
    echo "Please set your Telegram bot token:"
    echo "export TELEGRAM_BOT_TOKEN=your_bot_token_here"
    exit 1
fi

if [[ -z "$TELEGRAM_CHAT_ID" ]]; then
    echo "❌ TELEGRAM_CHAT_ID is not set"
    echo "Please set your Telegram chat ID:"
    echo "export TELEGRAM_CHAT_ID=your_chat_id_here"
    exit 1
fi

echo "✅ Environment variables are set"

# Test the bot by sending a test message
echo "📤 Sending test message..."

response=$(curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=🧪 Test message from Habit Tracker Bot! ✅" \
    -d "parse_mode=HTML")

# Check if the message was sent successfully
if echo "$response" | grep -q '"ok":true'; then
    echo "✅ Test message sent successfully!"
    echo "📱 Check your Telegram for the test message"
else
    echo "❌ Failed to send test message"
    echo "Response: $response"
    exit 1
fi

echo "🎉 Telegram Bot test completed successfully!"