# 🧠 AI Document Analysis Chatbot

This is a full-stack AI-powered web app that allows users to upload `.txt` documents or paste text directly into a chat interface. Users can then ask questions like "Summarize the text" or "What are the key points?" and receive intelligent answers powered by the **FLAN-T5 language model**.

---

## ✨ Features

- 📝 Upload `.txt` documents or paste raw text.
- 💬 Ask natural language questions about the content.
- 🤖 Get summaries or contextual answers using a pretrained LLM.
- 🧽 Auto-cleans citations like `[39]`, `[citation needed]` for better clarity.
- 🧱 Built with React (Vite) frontend, Flask backend, and Transformers.

---

## 🛠 Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Python Flask + HuggingFace Transformers (FLAN-T5)
- **Model**: `google/flan-t5-base`
- **Deployment-ready**: Docker (multi-stage build)

---

## 🚀 Running the App

You can run the app locally in two ways:

---

### 🔧 Option 1: Local Install (No Docker)

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-document-analysis.git
cd ai-document-analysis
```

#### 2. Setup Python Backend

```bash
cd src/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Run Flask Backend

```bash
python app.py
# Available at http://localhost:8080
```

#### 4. Start Frontend (in new terminal)

```bash
cd src/frontend
npm install
npm run dev
# Available at http://localhost:5173
```

> 🔄 Make sure your frontend points requests to the backend URL (e.g., via proxy or baseURL setting).

---

### 🐳 Option 2: Run with Docker

#### 1. Build and Run

```bash
docker compose up --build
```

This will:
- Install dependencies
- Build React frontend
- Serve via Flask on `http://localhost:8080`

---

## 🧪 Testing It

- Upload a `.txt` file with content.
- Or paste text directly into the input box.
- Ask a question like: `Summarize the text` or `What is the main idea?`

---

## 📂 Project Structure

```
cloud-ai-summarizer-clean/
├── src/
│   ├── backend/
│   │   ├── app.py
│   │   ├── llm_handler.py
│   │   ├── requirements.txt
│   ├── frontend/
│   │   ├── index.html
│   │   ├── App.jsx
│   │   └── components/
├── Dockerfile
├── docker-compose.yml
```

---

## 📦 Dependencies

### Backend
- `transformers`
- `torch`
- `flask`
- `flask-cors`

### Frontend
- `react`
- `axios`
- `vite`
- `tailwindcss`

---

## 💡 Future Improvements

- PDF and DOCX support
- Login/user history
- Choose between different LLMs (e.g., GPT, Mistral)

---

## 📄 License

MIT License — feel free to use, fork, and build on it!