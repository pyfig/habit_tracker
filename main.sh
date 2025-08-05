#!/bin/bash

set -e  # Остановить скрипт при ошибке

# ---------- Telegram notifications -----------
BOT_TOKEN="${BOT_TOKEN}"
CHAT_ID="${CHAT_ID}"

send_telegram() {
  local message="$1"
  if [[ -n "$BOT_TOKEN" && -n "$CHAT_ID" ]]; then
    curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
      -d chat_id="${CHAT_ID}" \
      --data-urlencode text="${message}" > /dev/null
  else
    echo "BOT_TOKEN or CHAT_ID not set, skipping telegram notification"
  fi
}

# Notify about script start
send_telegram "🚀 Deployment started on $(hostname)."

# Set traps for success and error
trap 'send_telegram "✅ Deployment finished successfully on $(hostname)."' EXIT
trap 'send_telegram "❌ Deployment failed on $(hostname)."' ERR

echo "Останавливаю и удаляю контейнеры..."
docker-compose down

echo "Пересобираю образы..."
docker-compose build 

echo "Запускаю контейнеры в фоновом режиме..."
docker-compose up -d

# echo "Открываю http://localhost:3000 в браузере..."
# if command -v xdg-open > /dev/null; then
#     xdg-open http://localhost:3000
# elif command -v open > /dev/null; then
#     open http://localhost:3000
# else
#     echo "Не удалось автоматически открыть браузер. Перейдите на http://localhost:3000 вручную."
# fi
