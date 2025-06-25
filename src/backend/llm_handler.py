# llm_handler.py
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

model_name = "google/flan-t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

def summarize_text(prompt, context=""):
    combined_input = f"{prompt}\n\n{context}" if context else prompt

    inputs = tokenizer(combined_input, return_tensors="pt", truncation=True, max_length=1024)
    output = model.generate(
        **inputs,
        max_length=350,  # increased from 200
        min_length=100,
        length_penalty=1.0,
        num_beams=4,
        early_stopping=True
    )
    return tokenizer.decode(output[0], skip_special_tokens=True)
