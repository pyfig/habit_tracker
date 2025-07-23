
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
* **Mark completed / undo**

### Progress Tracking
* **Daily completion marks**
* **Calendar view** with streaks
* **Today’s completed list**
* **Delete mark**

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
| GET    | `/`                                   | Health-check “Welcome” message     | ❌   |

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
````

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Backend      | [http://localhost:8000](http://localhost:8000) |
| Frontend     | [http://localhost:3000](http://localhost:3000) |
| Telegram Bot | -- requires `BOT_TOKEN` env -- |

Set `BOT_TOKEN` in your environment before running `./main.sh` to enable the bot.

Front-end is a static SPA (HTML / CSS / vanilla JS) served by Nginx.

---

## Testing & Coverage
```bash
# inside project root
./tests.sh                        # report in results.txt  
                                  # spins up Postgres -> runs backend tests -> shows coverage
```

## Project Structure

```
📦 habit_tracker
├─ backend/             # FastAPI application
│  ├─ app/              # routes, models, schemas, auth, main.py
│  └─ tests/            # pytest suite (runs inside container)
├─ frontend/            # Static SPA
├─ tests.sh             # one-liner test runner (Docker Compose)
├─ main.sh              # one-liner app runner (Docker Compose)
├─ pytest.ini           # pytest config
├─ docker-compose.yml   # db, backend, frontend, tests
└─ README.md / README_RUS.md
```

---

## Roadmap

* ✅ JWT auth, archive/restore, calendar streaks, >80 % coverage
* 🚀 Grafana dashboard with metrics
* 🚀 Telegram notifications for completed habits

```
```
