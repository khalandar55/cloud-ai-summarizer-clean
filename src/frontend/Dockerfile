# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# Stage 2: Build the backend and serve the frontend
FROM python:3.11-slim

WORKDIR /home/src

# Install backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r backend/requirements.txt

# Copy all source code
COPY . .

# ✅ Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist/ backend/static/

# Expose backend port
EXPOSE 8080

# Run the Flask app
CMD ["python", "backend/app.py"]
