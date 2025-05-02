# Habit Tracker

A simple application for forming and maintaining daily habits. Create, edit, mark progress, and track achievements through a calendar.

---

## Features

### Authentication  
- **Registration**: create an account with username and password  
- **Login**: access your personal dashboard  
- **Logout**: end the session  

### Habit Management  
- **Create**: add new habits with descriptions  
- **Edit**: update habit details  
- **Delete**: remove habits  
- **Archive**: move obsolete habits to archive  
- **Restore from Archive**: return archived habits to active status  

### Progress Tracking  
- **Completion Marks**: mark habits as completed for specific dates  
- **Calendar**: visualize success streaks  
- **Today's Completed Habits List**  
- **Mark Deletion**: correct mistakes  
- **View Archived Habits**: access saved habits via a modal window  

---

## Quick Start

### Requirements  
- Docker installed  
- Git installed  

### Installation  
```bash
git clone git@github.com:pyfig/habit_tracker.git
cd habit_tracker
./main.sh
```

- **Backend**: http://localhost:8000  
- **Frontend**: http://localhost:3000  
- **Database (PostgreSQL)**: port 5432  

---

## Project Structure  
```
📦 habit_tracker
├─ backend/               # FastAPI backend
├─ frontend/              # HTML/CSS/JS frontend
├─ docker-compose.yml     # Container configuration
├─ main.sh                # Startup script
├─ package.json           # Frontend dependencies
└─ README_RUS.md          # Documentation
```

---

## API  

| Method | Endpoint                        | Description                    |
|-------|----------------------------------|------------------------------|
| POST  | `/api/auth/register`             | Register a new user          |
| POST  | `/api/auth/login`                | Log in to the system         |
| GET   | `/api/habits`                    | Get all habits               |
| POST  | `/api/habits`                    | Create a new habit           |
| GET   | `/api/habits/{habit_id}`         | Get habit details            |
| PUT   | `/api/habits/{habit_id}`         | Update a habit               |
| DELETE| `/api/habits/{habit_id}`         | Delete a habit               |
| POST  | `/api/habits/{habit_id}/archive` | Archive a habit              |
| POST  | `/api/habits/{habit_id}/restore` | Restore from archive         |
| GET   | `/api/habits/archived/`          | Get archived habits          |
| POST  | `/api/marks`                     | Create a progress mark       |
| GET   | `/api/marks/habit/{habit_id}`    | Get all marks for a habit    |
| DELETE| `/api/marks/{mark_id}`           | Delete a mark                |

---

## Technologies  

**Backend**  
- FastAPI, Uvicorn, SQLAlchemy, PostgreSQL, Docker-Compose, Bash  

**Frontend**  
- HTML5, CSS3, JavaScript, AJAX, FontAwesome, Vite  

---

## Roadmap  

✅ **Implemented**:  
- Habit restoration from archive  
- All alerts converted to modal windows  
- Archive button moves to a dedicated window with archived habits  
- Restore button returns habits to active list  
- Added today's completed habits list  
- Updated UI with styles, icons, animations, and color scheme changes  
- Habit editing  
- JWT-based authentication/authorization  
- Docker-Compose + Bash automated builds  
- Calendar-based progress tracking (green calendar markers)  
- Calendar updates limited to current date only  

🚀 **In Development**:  
- Grafana dashboard  
- Telegram notifications for completed habits  

