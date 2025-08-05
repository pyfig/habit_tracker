#!/bin/bash

set -e  # Остановить скрипт при ошибке

# Function to send Telegram notification
send_telegram_notification() {
    local message="$1"
    local token="${TELEGRAM_BOT_TOKEN:-}"
    local chat_id="${TELEGRAM_CHAT_ID:-}"
    
    if [[ -n "$token" && -n "$chat_id" ]]; then
        curl -s -X POST "https://api.telegram.org/bot${token}/sendMessage" \
            -d "chat_id=${chat_id}" \
            -d "text=${message}" \
            -d "parse_mode=HTML" > /dev/null 2>&1
        echo "Telegram notification sent: $message"
    else
        echo "Telegram credentials not set, skipping notification"
    fi
}

# Function to check if services are healthy
check_services_health() {
    local max_attempts=30
    local attempt=1
    
    echo "Checking services health..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps | grep -q "Up"; then
            echo "✅ All services are running successfully!"
            send_telegram_notification "🚀 Habit Tracker started successfully! ✅ All services are running"
            return 0
        fi
        
        echo "⏳ Waiting for services to start... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Services failed to start properly"
    send_telegram_notification "❌ Habit Tracker failed to start properly"
    return 1
}

echo "🔄 Starting Habit Tracker deployment..."

# Send startup notification
send_telegram_notification "🔄 Starting Habit Tracker deployment..."

echo "🛑 Stopping and removing containers..."
docker-compose down

echo "🔨 Rebuilding images..."
docker-compose build 

echo "🚀 Starting containers in background mode..."
docker-compose up -d

# Check if services started successfully
if check_services_health; then
    echo "✅ Deployment completed successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8000"
    echo "📊 Database: localhost:5432"
    
    # Try to open browser
    if command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3000
    elif command -v open > /dev/null; then
        open http://localhost:3000
    else
        echo "📝 Please open http://localhost:3000 manually in your browser."
    fi
else
    echo "❌ Deployment failed!"
    exit 1
fi
