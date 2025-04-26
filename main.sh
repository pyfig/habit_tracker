#!/bin/bash

set -e

echo "Собираем контейнеры..."
docker-compose build --no-cache

echo "Запускаем контейнеры..."
docker-compose up -d

URL="http://localhost:3000"

OS_TYPE="$(uname -s)"

echo "Открываем сайт: $URL"

case "$OS_TYPE" in
    Linux*)
        # Проверяем, установлен ли xdg-open
        if command -v xdg-open > /dev/null; then
            xdg-open "$URL"
        else
            echo "xdg-open не найден. Откройте вручную: $URL"
        fi
        ;;
    Darwin*)
        # MacOS
        open "$URL"
        ;;
    *)
        # Другие системы
        echo "ОС не поддерживается автоматическим открытием. Перейдите по ссылке: $URL"
        ;;
esac
