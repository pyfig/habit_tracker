#!/bin/bash

# Telegram Bot Setup Script
# This script helps you set up your Telegram bot for notifications

set -e

echo "🤖 Telegram Bot Setup for Habit Tracker"
echo "========================================"
echo ""

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "❌ curl is required but not installed. Please install curl first."
    exit 1
fi

echo "📋 This script will help you set up your Telegram bot for notifications."
echo ""

# Step 1: Bot Token
echo "Step 1: Bot Token"
echo "-----------------"
echo "1. Open Telegram and search for @BotFather"
echo "2. Send /newbot command"
echo "3. Follow the instructions to create your bot"
echo "4. Copy the bot token (it looks like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)"
echo ""

read -p "Enter your bot token: " BOT_TOKEN

if [[ -z "$BOT_TOKEN" ]]; then
    echo "❌ Bot token is required"
    exit 1
fi

# Validate bot token format
if [[ ! "$BOT_TOKEN" =~ ^[0-9]+:[A-Za-z0-9_-]+$ ]]; then
    echo "❌ Invalid bot token format. Should be like: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
    exit 1
fi

echo "✅ Bot token format looks good"
echo ""

# Step 2: Test bot token
echo "Step 2: Testing Bot Token"
echo "-------------------------"
echo "Testing your bot token..."

response=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe")

if echo "$response" | grep -q '"ok":true'; then
    bot_username=$(echo "$response" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Bot token is valid!"
    echo "🤖 Bot username: @$bot_username"
else
    echo "❌ Invalid bot token. Please check your token and try again."
    echo "Response: $response"
    exit 1
fi

echo ""

# Step 3: Get Chat ID
echo "Step 3: Chat ID"
echo "---------------"
echo "1. Start a conversation with your bot (@$bot_username)"
echo "2. Send any message to the bot (like 'Hello')"
echo "3. Press Enter when you've sent a message to the bot"
echo ""

read -p "Press Enter after sending a message to your bot..."

echo "Getting your chat ID..."

response=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getUpdates")

if echo "$response" | grep -q '"ok":true'; then
    chat_id=$(echo "$response" | grep -o '"chat":{"id":[^,]*' | grep -o ':"id":[^,]*' | cut -d':' -f3)
    
    if [[ -n "$chat_id" ]]; then
        echo "✅ Chat ID found: $chat_id"
    else
        echo "❌ Could not find chat ID. Please make sure you sent a message to the bot."
        echo "Response: $response"
        exit 1
    fi
else
    echo "❌ Failed to get updates. Please try again."
    echo "Response: $response"
    exit 1
fi

echo ""

# Step 4: Test the complete setup
echo "Step 4: Testing Complete Setup"
echo "------------------------------"
echo "Sending a test message..."

test_response=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${chat_id}" \
    -d "text=🎉 Test message from Habit Tracker setup script! ✅" \
    -d "parse_mode=HTML")

if echo "$test_response" | grep -q '"ok":true'; then
    echo "✅ Test message sent successfully!"
    echo "📱 Check your Telegram for the test message"
else
    echo "❌ Failed to send test message"
    echo "Response: $test_response"
    exit 1
fi

echo ""

# Step 5: Save configuration
echo "Step 5: Saving Configuration"
echo "----------------------------"

# Create .env file
cat > .env << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=$BOT_TOKEN
TELEGRAM_CHAT_ID=$chat_id
EOF

echo "✅ Configuration saved to .env file"
echo ""

# Step 6: Instructions
echo "Step 6: Next Steps"
echo "------------------"
echo "✅ Your Telegram bot is now configured!"
echo ""
echo "To start the application with notifications:"
echo "  ./main.sh"
echo ""
echo "To test the bot anytime:"
echo "  ./test_telegram.sh"
echo ""
echo "To check the bot logs:"
echo "  docker-compose logs telegram-bot"
echo ""
echo "🎉 Setup complete! Your bot will now send notifications when:"
echo "  • The application starts up"
echo "  • The application shuts down"
echo "  • Health checks are performed"
echo "  • Errors occur"
echo ""

echo "📝 Configuration Summary:"
echo "  Bot Token: $BOT_TOKEN"
echo "  Chat ID: $chat_id"
echo "  Bot Username: @$bot_username"
echo ""