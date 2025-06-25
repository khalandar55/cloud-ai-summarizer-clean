# 🧠 AI Document Analysis App

This is a full-stack AI-powered document analysis tool. Users can upload or paste a document and ask questions about it. The app uses an LLM backend and a modern React frontend.

---

## 🚀 Features

- Upload `.txt` files or paste content
- Ask natural language questions
- Summarized answers from backend LLM
- Dockerized: one command runs the whole app

---

## 📦 Project Structure

- `frontend/` — React + Vite frontend
- `backend/` — Flask backend API
- `tests/` — Unit tests
- `Dockerfile` — Full build and runtime definition

---

## 🐳 Running in Docker

```bash
docker build -t cloud-ai-app .
docker run -p 8080:8080 cloud-ai-app
