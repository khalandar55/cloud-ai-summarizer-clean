import { useState } from "react";

function UploadInput({ onUpload }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleTextUpload = () => {
    if (!text.trim()) {
      setError("Please paste some text.");
      return;
    }
    onUpload(text);
    setText("");
    setError("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      setError("Only plain text files are supported.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result);
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">📄 Upload Document</h2>

      <textarea
        className="w-full h-24 border p-2 rounded mb-2"
        placeholder="Paste your document text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={handleTextUpload}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Upload Text
        </button>
        <input type="file" accept=".txt" onChange={handleFileUpload} />
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default UploadInput;
