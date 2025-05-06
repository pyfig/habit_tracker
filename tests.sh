#!/usr/bin/env bash
set -euo pipefail

REPORT_FILE=${1:-results.txt}             # путь к файлу-отчёту (по умолчанию results.txt)
PYTEST_ARGS=${2:-}                        

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# ───────────────────────────────── trap: всегда удаляем тестовые контейнеры ─────────────────────────
cleanup() {
  echo -e "\n🧹 Чищу контейнеры..."
  docker-compose down -v --remove-orphans
}
trap cleanup EXIT

# ───────────────────────────────── docker build (только tests) ──────────────────────────────────────
echo "🔄 Собираю контейнер с тестами.."
docker-compose build tests

# ───────────────────────────────── зависимости + тесты ─────────────────────────────────────────────
echo "🚀 Запускаю зависимости (db).."
docker-compose up -d db

echo "🧪 Запускаю pytest внутри контейнера..."
docker-compose run --rm tests pytest \
  --cov=backend/app --cov-report=term-missing ${PYTEST_ARGS} | tee "$REPORT_FILE"

echo "✅ Тесты завершены. Информация о тестах сохранена в $REPORT_FILE"
