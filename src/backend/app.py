from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from llm_handler import summarize_text
import os

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

document_storage = {"text": ""}

@app.route("/")
def serve_index():
    return send_from_directory(app.static_folder, "index.html")

@app.route("/upload", methods=["POST"])
def upload_text():
    data = request.get_json()
    document_storage["text"] = data.get("text", "")
    return jsonify({"message": "Text uploaded successfully."})

@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    prompt = data.get("prompt", "").strip()
    text = data.get("text", "").strip()

    if not text:
        text = document_storage.get("text", "").strip()

    if not text:
        return jsonify({"response": "❌ No document uploaded or text provided."})

    full_input = f"{prompt}\n\n{text}"
    try:
        response = summarize_text(full_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"❌ Error: {str(e)}"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
