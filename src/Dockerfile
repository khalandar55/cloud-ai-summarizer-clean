# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build Flask backend + serve frontend from static
FROM python:3.11-slim

WORKDIR /home/src

# Install Python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source
COPY . .

# ✅ Copy built frontend into backend/static
RUN mkdir -p backend/static && \
    cp -r /app/dist/* backend/static/

# Flask will serve from backend/static
EXPOSE 8080

CMD ["python", "backend/app.py"]
