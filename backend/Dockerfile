FROM python:3.11-slim

WORKDIR /app

# First copy only requirements to leverage Docker cache
COPY backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY backend/ .

EXPOSE 10000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]