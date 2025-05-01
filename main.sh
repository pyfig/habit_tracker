#!/bin/bash

set -e  # Остановить скрипт при ошибке

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
