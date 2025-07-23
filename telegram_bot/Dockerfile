FROM python:3.9-slim
WORKDIR /app
COPY bot.py .
RUN pip install --no-cache-dir python-telegram-bot==20.3
CMD ["python", "bot.py"]
