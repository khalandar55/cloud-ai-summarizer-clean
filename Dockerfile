# Stage 1: Build React frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY src/frontend/package*.json ./
RUN npm install
COPY src/frontend/ ./
RUN npm run build

# Stage 2: Build Flask backend and serve frontend
FROM python:3.11-slim

WORKDIR /home/src

# Install Python dependencies
COPY src/backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY src/backend/ ./backend

# ✅ Copy frontend build output into backend/static
COPY --from=frontend-builder /app/dist/ ./backend/static/

EXPOSE 8080
CMD ["python", "backend/app.py"]
