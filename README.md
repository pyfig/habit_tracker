
# Habit Tracker

A simple, container-ready application for forming and maintaining daily habits.  
Create, edit, archive, restore and track progress through a calendar.

---

## Features
### Authentication
* **Registration / Login / Logout** (JWT)

### Habit Management
* **Create / Edit / Delete**
* **Archive** and **Restore**
* **Mark completed / undo** with database persistence
* **Complete habits** with automatic mark creation

### Progress Tracking
* **Daily completion marks**
* **Calendar view** with streaks
* **Today's completed list**
* **Delete mark**
* **Visual progress indicators**

### Database & Testing
* **PostgreSQL** database with SQLAlchemy ORM
* **94.32% test coverage** with comprehensive test suite
* **End-to-end testing** for all functionality
* **SQLite** for testing with automatic setup

---

## API

| Method | Endpoint                              | Description                        | Auth |
|--------|---------------------------------------|------------------------------------|------|
| POST   | `/api/auth/register`                  | Register a new user                | ❌   |
| POST   | `/api/auth/login`                     | Obtain JWT token                   | ❌   |
| GET    | `/api/habits/`                        | List active habits                 | ✅   |
| POST   | `/api/habits/`                        | Create a habit                     | ✅   |
| PUT    | `/api/habits/{habit_id}`              | Update a habit                     | ✅   |
| DELETE | `/api/habits/{habit_id}`              | Delete a habit                     | ✅   |
| POST   | `/api/habits/{habit_id}/archive`      | Archive a habit                    | ✅   |
| POST   | `/api/habits/{habit_id}/restore`      | Restore a habit                    | ✅   |
| GET    | `/api/habits/archived`                | List archived habits               | ✅   |
| GET    | `/api/habits/completed`               | List completed habits              | ✅   |
| POST   | `/api/habits/{habit_id}/complete`     | Mark habit completed today         | ✅   |
| POST   | `/api/habits/{habit_id}/uncomplete`   | Undo completion mark               | ✅   |
| POST   | `/api/marks/`                         | Create a mark (any date)           | ✅   |
| GET    | `/api/marks/habit/{habit_id}/`        | All marks for a habit              | ✅   |
| DELETE | `/api/marks/{mark_id}`                | Delete a mark                      | ✅   |
| GET    | `/api/profile/metrics`                | Get user metrics                   | ✅   |
| GET    | `/`                                   | Health-check "Welcome" message     | ❌   |

> **✅** Authenticated endpoints require `Authorization: Bearer token;`
  where the token comes from `/api/auth/login`.

---

## Quick Start

### Requirements
* Docker & Docker Compose  
* Git

```bash
git clone https://github.com/your-org/habit_tracker.git
cd habit_tracker
./main.sh      
```

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Backend  | [http://localhost:8000](http://localhost:8000) |
| Frontend | [http://localhost:3000](http://localhost:3000) |                     

Front-end is a static SPA (HTML / CSS / vanilla JS) served by Nginx.

---

## Testing & Coverage

### Run Tests
```bash
# inside project root
./tests.sh                        # report in results.txt  
                                  # spins up Postgres -> runs backend tests -> shows coverage
```

### Test Coverage
- **Current Coverage: 94.32%** (exceeds 80% requirement)
- **17 tests passing** with comprehensive coverage
- **End-to-end testing** for habit completion functionality
- **Integration tests** for API endpoints

### Test Structure
```
backend/tests/
├── test_auth.py                      # Authentication tests
├── test_habits.py                    # Habit CRUD tests
├── test_marks.py                     # Mark tests
├── test_metrics.py                   # Profile metrics tests
├── test_archive.py                   # Archive/restore tests
├── test_complete_functionality.py    # E2E completion test
├── test_db_setup.py                  # Database setup debug
├── create_test_db.py                 # Database creation debug
├── conftest.py                       # Pytest configuration
└── README.md                         # Test documentation
```

---

## Project Structure

```
📦 habit_tracker
├─ backend/             # FastAPI application
│  ├─ app/              # routes, models, schemas, auth, main.py
│  ├─ tests/            # pytest suite (runs inside container)
│  └─ requirements.txt  # Python dependencies
├─ frontend/            # Static SPA
├─ tests.sh             # one-liner test runner (Docker Compose)
├─ main.sh              # one-liner app runner (Docker Compose)
├─ pytest.ini           # pytest config
├─ docker-compose.yml   # db, backend, frontend, tests
└─ README.md / README_RUS.md
```

---

## Recent Updates

### ✅ Completed Features
* **JWT authentication** with secure token handling
* **Habit completion** with database persistence
* **Archive/restore** functionality
* **Calendar streaks** and visual progress
* **Comprehensive test suite** with 94.32% coverage
* **End-to-end testing** for complete workflows
* **SQLite testing** with automatic database setup
* **Frontend improvements** with proper API integration

### 🚀 Planned Features
* Grafana dashboard with metrics
* Telegram notifications for completed habits
* Advanced analytics and reporting
* Mobile-responsive design improvements

---

## Technical Details

### Backend
- **FastAPI** with automatic API documentation
- **SQLAlchemy ORM** with PostgreSQL/SQLite support
- **JWT authentication** with secure password hashing
- **Pydantic validation** for request/response schemas
- **Comprehensive error handling** and validation

### Frontend
- **Vanilla JavaScript** with modern ES6+ features
- **Responsive design** with CSS Grid and Flexbox
- **Real-time updates** without page refreshes
- **Local storage** for authentication persistence

### Testing
- **Pytest** with async support
- **Coverage reporting** with HTML output
- **Docker-based testing** for consistency
- **Integration tests** for API endpoints
