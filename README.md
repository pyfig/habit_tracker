# Habit Tracker

A simple application to help you build and maintain daily habits. Create, edit, and check off habits; view your progress in a calendar.

## Features

### Authentication
- **Register**: Create a new account with a username and password  
- **Login**: Sign in with your credentials  
- **Logout**: Securely end your session  

### Habit Management
- **Create**: Add new habits with a title and description  
- **Read**: View a list of all your habits  
- **Update**: Edit the title or description of existing habits  
- **Delete**: Remove habits you no longer wish to track  

### Progress Tracking
- **Mark Complete**: Check off a habit on a given date  
- **Calendar View**: See your streaks and history in a calendar layout  
- **Undo Marks**: Remove mistaken completion marks  

## Getting Started

### Prerequisites

- Docker & Docker Compose installed  
- Git  

### Installation

```bash
git clone git@github.com:pyfig/habit_tracker.git
cd habit_tracker
docker-compose build
docker-compose up -d
```
or
```bash
git clone git@github.com:pyfig/habit_tracker.git
cd habit_tracker
./main.sh
```

- **Backend**: http://localhost:8000  
- **Frontend**: http://localhost:3000  
- **Database (PostgreSQL)**: port 5432  

## Project Structure

```
📦 habit_tracker
├─ .gitignore
├─ LICENSE
├─ README.md
├─ backend
│  ├─ Dockerfile
│  ├─ app
│  │  ├─ auth.py
│  │  ├─ db.py
│  │  ├─ main.py
│  │  ├─ models.py
│  │  ├─ routes
│  │  │  ├─ auth.py
│  │  │  ├─ habits.py
│  │  │  └─ marks.py
│  │  └─ schemas.py
│  └─ requirements.txt
├─ docker-compose.yml
├─ frontend
│  ├─ Dockerfile
│  ├─ api.js
│  ├─ app.js
│  ├─ auth.js
│  ├─ calendar.js
│  ├─ habits-handlers.js
│  ├─ habits.js
│  ├─ index.html
│  ├─ nginx.conf
│  └─ styles.css
└─ package.json
```

## API Reference

### Authentication

| Method | Endpoint               | Description            | Body                                |
| ------ | ---------------------- | ---------------------- | ----------------------------------- |
| POST   | `/api/auth/register`   | Register new user      | `{ "username": "...", "password": "..." }` |
| POST   | `/api/auth/login`      | Obtain JWT token       | `{ "username": "...", "password": "..." }` |

### Habits

| Method | Endpoint                  | Description              | Body                                   |
| ------ | ------------------------- | ------------------------ | -------------------------------------- |
| GET    | `/api/habits`             | List all habits          | —                                      |
| POST   | `/api/habits`             | Create a new habit       | `{ "title": "...", "description": "..." }` |
| GET    | `/api/habits/{habit_id}`  | Get habit details        | —                                      |
| PUT    | `/api/habits/{habit_id}`  | Update a habit           | `{ "title": "...", "description": "..." }` |
| DELETE | `/api/habits/{habit_id}`  | Delete a habit           | —                                      |

### Marks

| Method | Endpoint                       | Description                 | Body                         |
| ------ | ------------------------------ | --------------------------- | ---------------------------- |
| POST   | `/api/marks`                   | Create a completion mark    | `{ "habit_id": ..., "date": "YYYY-MM-DD" }` |
| GET    | `/api/marks/habit/{habit_id}`  | List marks for a habit      | —                            |
| DELETE | `/api/marks/{mark_id}`         | Remove a completion mark    | —                            |

## Tech Stack

**Backend**  
- FastAPI (REST API)  
- Uvicorn (ASGI server)  
- Nginx (reverse proxy & static files)  
- PostgreSQL (database)  
- SQLAlchemy (ORM)  
- JWT (authentication)  
- Docker  

**Frontend**  
- HTML5  
- CSS3  
- JavaScript + AJAX  
- Font Awesome (icons)  

## Future Roadmap

- Add automated tests  
- Set up CI/CD pipeline  
- UI/UX improvements  
- Analytics & statistics dashboard (e.g. Grafana, Zabbix)  
