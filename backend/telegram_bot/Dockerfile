FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the telegram_bot module
COPY telegram_bot/ ./telegram_bot/

# Copy the main service file
COPY telegram_bot/service.py ./service.py

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Run the service
CMD ["python", "service.py"]