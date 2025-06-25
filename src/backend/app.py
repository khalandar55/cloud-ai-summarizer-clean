from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from llm_handler import summarize_text
import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = Flask(__name__, static_folder="static", static_url_path="")
CORS(app)

document_storage = {"text": ""}

# Load tokenizer for truncation
# ❗ Replace with your actual model name (same as used for inference)
tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")  # or mistralai/...
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

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

    if not prompt and not text:
        return jsonify({"response": "❌ No document uploaded or text provided."})

    full_input = f"{prompt}\n\n{text}".strip()

    if not full_input:
        return jsonify({"response": "❌ Cannot summarize empty input."})

    # 🔽 Truncate input safely using tokenizer
    try:
        tokens = tokenizer(full_input, truncation=True, max_length=1000, return_tensors="pt")
        truncated_input = tokenizer.decode(tokens["input_ids"][0], skip_special_tokens=True)
    except Exception as e:
        return jsonify({"response": f"❌ Tokenization error: {str(e)}"})

    # 🔁 Summarize or respond
    try:
        response = summarize_text(truncated_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"response": f"❌ Error: {str(e)}"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
