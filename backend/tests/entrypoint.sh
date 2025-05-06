#!/usr/bin/env bash
set -e

until pg_isready -h db -p 5432 -U postgres; do sleep 0.5; done
export PGPASSWORD=${POSTGRES_PASSWORD:-postgres}

psql -h db -U postgres -tc "SELECT 1 FROM pg_database WHERE datname='habit_tracker_test'" |
  grep -q 1 || psql -h db -U postgres -c "CREATE DATABASE habit_tracker_test"

pytest
