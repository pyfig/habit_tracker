FROM python:3.9-slim

# ───── 0.  Postgres (for tests-containers: pg_isready, psql) ─────
RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql-client \
 && rm -rf /var/lib/apt/lists/*

# ───── 1.  Базовая директория и PYTHONPATH ─────────────────────────────────
WORKDIR /app
ENV PYTHONPATH=/app

# ───── 2.  Runtime-зависимости ────────────────────────────────────────────
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ───── 3.  Dev requirements ──────────────────────────────────────────────
COPY requirements-dev.txt .
RUN if [ -f requirements-dev.txt ]; then \
        pip install --no-cache-dir -r requirements-dev.txt ; \
    fi

# ───── 4.  Source to deployment ────────────────────────────────────────────────
COPY . .

# ───── 5.  run here ────────
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
