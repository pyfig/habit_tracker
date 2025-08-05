# Test Files Documentation

This directory contains all test files for the Habit Tracker application.

## Test Files

### Core Tests
- **test_auth.py** - Tests for authentication functionality (register, login, token validation)
- **test_habits.py** - Tests for habit CRUD operations and complete/uncomplete functionality
- **test_marks.py** - Tests for mark creation and retrieval
- **test_metrics.py** - Tests for profile metrics functionality
- **test_archive.py** - Tests for habit archiving and restoration

### Integration Tests
- **test_complete_functionality.py** - End-to-end test for habit completion functionality
  - Tests the complete workflow: register user → login → create habit → complete habit → verify completion
  - Uses real HTTP requests to test the API endpoints

### Debug/Setup Files
- **test_db_setup.py** - Database setup verification script
- **create_test_db.py** - Script to manually create test database tables
- **conftest.py** - Pytest configuration and fixtures
- **entrypoint.sh** - Docker entrypoint script for tests

## Running Tests

### Run all tests with coverage:
```bash
cd backend
source venv/bin/activate
python -m pytest --cov=app --cov-report=term-missing --cov-report=html
```

### Run specific test file:
```bash
python -m pytest tests/test_habits.py -v
```

### Run tests with verbose output:
```bash
python -m pytest -v
```

## Coverage Requirements

- Minimum coverage: 80%
- Current coverage: 94.32%
- All tests must pass before merging

## Test Database

Tests use SQLite in-memory database for isolation and speed. The database is automatically created and destroyed for each test session.

## Debug Files

The debug files (`test_db_setup.py` and `create_test_db.py`) are kept for troubleshooting database issues during development. They are not part of the regular test suite. 