# Utils for storing/retrieving document

def store_document(store, text):
    store["text"] = text

def get_document_text(store):
    return store.get("text", "")
