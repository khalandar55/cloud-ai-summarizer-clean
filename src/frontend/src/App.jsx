import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ApiKeyModal from "./components/ApiKeyModal";
import axios from "axios";

function App() {
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: `👋 Hello! I can help you analyze documents and answer questions. You can:\n\n• Upload a document for analysis\n• Paste text directly\n• Ask questions about the content`,
    },
  ]);
  const [prompt, setPrompt] = useState("");
  const [documentText, setDocumentText] = useState(""); // uploaded text
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendPrompt();
  };

  const sendPrompt = async () => {
    if (!prompt.trim() || isLoading) return;

    const textBlock = prompt.trim();
    const isPastedText = textBlock.length > 200 || textBlock.split(" ").length > 30;
    const isDocQuery = /summarize|analyze|what|explain/i.test(textBlock);

    if (isDocQuery && !isPastedText && !documentText) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ No document uploaded or pasted. Please upload a file or paste the content directly.",
        },
      ]);
      return;
    }

    setChat((prev) => [...prev, { sender: "user", text: textBlock }]);
    setPrompt("");
    setIsLoading(true);

    try {
      const res = await axios.post("/ask", {
        prompt,
        text: documentText,  // only send uploaded or pasted document
      });

      setChat((prev) => [...prev, { sender: "bot", text: res.data.response }]);

      if (uploadSuccess && isDocQuery && !isPastedText) {
        setUploadSuccess(false);
      }
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error: " + err.message },
      ]);
    }

    setIsLoading(false);
  };

  const uploadText = async (text) => {
    setDocumentText(text);
    setUploadSuccess(false);

    try {
      await axios.post("/upload", { text });
      setUploadSuccess(true);

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Document uploaded successfully. Ask me anything!",
        },
      ]);
    } catch (err) {
      setError("❌ Upload failed: " + err.message);
      setUploadSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-6 px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">🧠 AI Document Analysis</h1>
          <p className="text-sm text-gray-600">
            Upload documents or ask questions about your text
          </p>
        </div>

        {/* Main chat area */}
        <div className="p-4 flex-1 overflow-y-auto">
          <ApiKeyModal apiKey={apiKey} setApiKey={setApiKey} />
          <ChatWindow chat={chat} />
          {isLoading && (
            <div className="text-sm text-gray-500 mt-2">🤖 Thinking...</div>
          )}
        </div>

        {/* Upload + Input */}
        <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center bg-gray-100 px-3 py-1 rounded text-sm text-gray-800 cursor-pointer hover:bg-gray-200">
              📄 Upload Document
              <input
                type="file"
                accept=".txt"
                className="hidden"
                onClick={(e) => {
                  e.target.value = null;
                }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type === "text/plain") {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const text = reader.result;
                      uploadText(text);
                    };
                    reader.readAsText(file);
                  }
                }}
              />
            </label>

            {uploadSuccess && (
              <span className="text-green-600 text-sm font-medium">
                ✅ Document uploaded!
              </span>
            )}
          </div>

          {/* Prompt Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border px-4 py-2 rounded shadow-sm"
              placeholder="Ask a question like 'What is dropout in deep learning?'"
              disabled={isLoading}
            />
            <button
              onClick={sendPrompt}
              disabled={isLoading}
              className={`px-4 rounded shadow ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? "Sending..." : "Send 🚀"}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-2 text-red-600 bg-red-100 border-t text-center text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
