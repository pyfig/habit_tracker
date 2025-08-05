#!/bin/bash

set -e  # Остановить скрипт при ошибке

# Функция для отображения помощи
show_help() {
    echo "Использование: $0 [ОПЦИЯ]"
    echo ""
    echo "Опции:"
    echo "  --help, -h                 Показать эту справку"
    echo "  --setup-telegram           Настроить Telegram бота"
    echo "  --send-test-notification   Отправить тестовое уведомление"
    echo "  --check-telegram           Проверить статус Telegram бота"
    echo "  --no-telegram             Запустить без Telegram сервиса"
    echo ""
    echo "Переменные окружения:"
    echo "  TELEGRAM_BOT_TOKEN         Токен Telegram бота"
    echo "  DAILY_REMINDER_TIME        Время ежедневных напоминаний (по умолчанию 09:00)"
    echo ""
    echo "Примеры:"
    echo "  TELEGRAM_BOT_TOKEN=your_token $0"
    echo "  $0 --setup-telegram"
    echo "  $0 --no-telegram"
}

# Функция для настройки Telegram
setup_telegram() {
    echo "🤖 Настройка Telegram бота..."
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
        echo "❌ Не задан TELEGRAM_BOT_TOKEN"
        echo "Получите токен у @BotFather в Telegram и установите переменную окружения:"
        echo "export TELEGRAM_BOT_TOKEN=your_bot_token_here"
        exit 1
    fi
    
    echo "✅ Токен бота найден"
    echo "📝 Сохраняю конфигурацию в .env файл..."
    
    cat > .env << EOF
TELEGRAM_BOT_TOKEN=$TELEGRAM_BOT_TOKEN
DAILY_REMINDER_TIME=${DAILY_REMINDER_TIME:-09:00}
EOF
    
    echo "✅ Конфигурация сохранена в .env"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Запустите приложение: ./main.sh"
    echo "2. Зарегистрируйтесь или войдите в систему"
    echo "3. Найдите ваш Chat ID в Telegram:"
    echo "   - Напишите боту /start"
    echo "   - Используйте @userinfobot для получения Chat ID"
    echo "4. Настройте Chat ID через API: POST /api/telegram/settings"
}

# Функция для проверки статуса Telegram бота
check_telegram() {
    echo "🔍 Проверка статуса Telegram бота..."
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
        echo "❌ TELEGRAM_BOT_TOKEN не установлен"
        return 1
    fi
    
    echo "📡 Проверка подключения к Telegram API..."
    response=$(curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe")
    
    if echo "$response" | grep -q '"ok":true'; then
        bot_name=$(echo "$response" | grep -o '"first_name":"[^"]*"' | cut -d'"' -f4)
        bot_username=$(echo "$response" | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
        echo "✅ Бот активен!"
        echo "📝 Имя бота: $bot_name"
        echo "🔗 Username: @$bot_username"
    else
        echo "❌ Ошибка подключения к боту"
        echo "Ответ API: $response"
        return 1
    fi
}

# Функция для отправки тестового уведомления
send_test_notification() {
    echo "📤 Отправка тестового уведомления..."
    
    if [ -z "$TELEGRAM_CHAT_ID" ]; then
        echo "❌ Не задан TELEGRAM_CHAT_ID"
        echo "Установите переменную окружения с вашим Chat ID:"
        echo "export TELEGRAM_CHAT_ID=your_chat_id"
        exit 1
    fi
    
    if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
        echo "❌ Не задан TELEGRAM_BOT_TOKEN"
        exit 1
    fi
    
    message="🎯 Тестовое уведомление от Habit Tracker!
    
Время: $(date)
Если вы видите это сообщение, то Telegram бот работает корректно! ✅"
    
    response=$(curl -s -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage" \
        -H "Content-Type: application/json" \
        -d "{
            \"chat_id\": \"$TELEGRAM_CHAT_ID\",
            \"text\": \"$message\",
            \"parse_mode\": \"HTML\"
        }")
    
    if echo "$response" | grep -q '"ok":true'; then
        echo "✅ Тестовое уведомление отправлено успешно!"
    else
        echo "❌ Ошибка отправки уведомления"
        echo "Ответ API: $response"
    fi
}

# Обработка аргументов командной строки
SKIP_TELEGRAM=false

case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --setup-telegram)
        setup_telegram
        exit 0
        ;;
    --check-telegram)
        check_telegram
        exit 0
        ;;
    --send-test-notification)
        send_test_notification
        exit 0
        ;;
    --no-telegram)
        SKIP_TELEGRAM=true
        ;;
esac

echo "🚀 Запуск Habit Tracker..."

# Проверка конфигурации Telegram
if [ "$SKIP_TELEGRAM" = false ]; then
    if [ -f ".env" ]; then
        echo "📝 Загрузка конфигурации из .env файла..."
        source .env
    fi
    
    if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
        echo "🤖 Telegram бот настроен"
        check_telegram || echo "⚠️  Предупреждение: Проблемы с Telegram ботом"
    else
        echo "⚠️  Telegram бот не настроен"
        echo "💡 Используйте: $0 --setup-telegram для настройки"
    fi
fi

echo "⏹️  Останавливаю и удаляю контейнеры..."
docker-compose down

echo "🔨 Пересобираю образы..."
docker-compose build 

echo "🚀 Запускаю контейнеры в фоновом режиме..."
if [ "$SKIP_TELEGRAM" = true ]; then
    echo "📴 Запуск без Telegram сервиса..."
    docker-compose up -d backend frontend db
else
    docker-compose up -d
fi

echo ""
echo "✅ Приложение запущено!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"

if [ "$SKIP_TELEGRAM" = false ] && [ -n "$TELEGRAM_BOT_TOKEN" ]; then
    echo "🤖 Telegram уведомления: Активны"
    echo "⏰ Время напоминаний: ${DAILY_REMINDER_TIME:-09:00}"
else
    echo "📴 Telegram уведомления: Отключены"
fi

echo ""
echo "📋 Для настройки Telegram уведомлений:"
echo "1. Настройте бота: $0 --setup-telegram"
echo "2. Получите Chat ID в Telegram"
echo "3. Настройте через API или веб-интерфейс"
echo ""
echo "🔍 Проверить логи: docker-compose logs -f"
echo "⏹️  Остановить: docker-compose down"

# echo "Открываю http://localhost:3000 в браузере..."
# if command -v xdg-open > /dev/null; then
#     xdg-open http://localhost:3000
# elif command -v open > /dev/null; then
#     open http://localhost:3000
# else
#     echo "Не удалось автоматически открыть браузер. Перейдите на http://localhost:3000 вручную."
# fi
