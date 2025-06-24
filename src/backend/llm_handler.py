# llm_handler.py

from transformers import pipeline

# Replace this line with one of the below options if you want to try others
summarizer = pipeline("summarization", model="JustinDu/BARTxiv")  # ✅ fine-tuned on arxiv-summarization

def summarize_text(text):
    summary = summarizer(text, max_length=150, min_length=40, do_sample=False)
    return summary[0]['summary_text']
