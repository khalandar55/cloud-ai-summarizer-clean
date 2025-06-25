from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from llm_handler import summarize_text
import os
import re

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

# In-memory storage for uploaded document
document_storage = {"text": ""}

def clean_text(text):
    if not text:
        return ""
    # Remove numbered citations like [39]
    text = re.sub(r"\[\d+\]", "", text)
    # Remove citation notes
    text = re.sub(r"\[citation needed\]", "", text, flags=re.IGNORECASE)
    return text.strip()

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/upload", methods=["POST"])
def upload_text():
    data = request.get_json()
    raw_text = data.get("text", "").strip()
    cleaned = clean_text(raw_text)
    document_storage["text"] = cleaned
    return jsonify({"message": "Text uploaded successfully."})

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    pasted_text = data.get("text", "").strip()
    uploaded_text = document_storage.get("text", "").strip()

    # Use pasted or uploaded text as context
    context = pasted_text if pasted_text else uploaded_text
    context = clean_text(context)

    if not prompt and not context:
        return jsonify({"response": "❌ No prompt or document provided."})

    try:
        response = summarize_text(prompt, context)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"❌ Error: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
