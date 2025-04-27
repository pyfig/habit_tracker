# README.md (English)

# Habit Tracker

Simple and intuitive app to form and maintain daily habits. Create, edit, track progress in the calendar, and see completed habits for today.

## Features

### Authentication
- **Register**: create a new account with username and password
- **Login**: access your personal habit tracker
- **Logout**: securely end your session

### Habit Management
- **Create**: add a new habit with name and optional description
- **Edit**: update habit details
- **Delete**: remove unnecessary habits
- **Archive**: move inactive habits to archive

### Progress Tracking
- **Mark Completion**: mark a habit as completed on a selected day
- **Calendar View**: visualize your streaks and history
- **Today's Completed Habits**: see a list of today's successes
- **Remove Mark**: undo wrong marks

## Quick Start

### Requirements

- Docker  
- Git

### Installation

```bash
git clone git@github.com:pyfig/habit_tracker.git
cd habit_tracker
./main.sh
```

- **Backend**: http://localhost:8000  
- **Frontend**: http://localhost:3000  
- **Database**: port 5432


## Project Structure

```
📦 habit_tracker
├─ backend/
├─ frontend/
├─ docker-compose.yml
├─ main.sh
├─ package.json
└─ README.md
```

## API Overview

| Method | Endpoint                     | Description                 |
|--------|------------------------------|-----------------------------|
| POST   | `/api/auth/register`         | Register new user           |
| POST   | `/api/auth/login`            | Login user                  |
| GET    | `/api/habits`                | Get all habits              |
| POST   | `/api/habits`                | Create a new habit          |
| GET    | `/api/habits/{habit_id}`     | Get habit details           |
| PUT    | `/api/habits/{habit_id}`     | Update habit                |
| DELETE | `/api/habits/{habit_id}`     | Delete habit                |
| POST   | `/api/marks`                 | Create a mark (track habit) |
| GET    | `/api/marks/habit/{habit_id}`| Get all marks for habit     |
| DELETE | `/api/marks/{mark_id}`       | Delete a mark               |

## Technologies

**Backend**  
- FastAPI, Uvicorn, SQLAlchemy, PostgreSQL, Docker

**Frontend**  
- HTML5, CSS3, JavaScript, AJAX, FontAwesome, Vite

## Roadmap

- Automatic tests
- Habit archive browsing
- Habit recovery from archive
- Mobile optimization
- Analytics and statistics

---
