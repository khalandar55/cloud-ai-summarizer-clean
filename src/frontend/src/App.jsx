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
  const [documentText, setDocumentText] = useState(""); // ✅ store uploaded or pasted document
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");

  // Sends user prompt and document context to backend
  const sendPrompt = async () => {
    if (!prompt.trim()) return;
  
    setChat((prev) => [...prev, { sender: "user", text: prompt }]);
    setPrompt("");
  
    try {
      const res = await axios.post("http://localhost:5001/ask", {
        prompt,
        text: documentText || prompt, // 👈 use prompt as fallback context if no document
      });
  
      setChat((prev) => [...prev, { sender: "bot", text: res.data.response }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error: " + err.message },
      ]);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  // Handle text upload from file
  const uploadText = async (text) => {
    setDocumentText(text); // ✅ store for follow-up Qs

    try {
      await axios.post("http://localhost:5001/upload", { text });
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Document uploaded successfully. Ask me anything!",
        },
      ]);
    } catch (err) {
      setError("❌ Upload failed: " + err.message);
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
        </div>

        {/* Upload + Input */}
        <div className="p-4 bg-gray-50 border-t flex flex-col gap-2">
          {/* Upload Button */}
          <div className="flex justify-start">
            <label className="inline-flex items-center bg-gray-100 px-3 py-1 rounded text-sm text-gray-800 cursor-pointer hover:bg-gray-200">
              📄 Upload Document
              <input
                type="file"
                accept=".txt"
                className="hidden"
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
          </div>

          {/* Prompt Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border px-4 py-2 rounded shadow-sm"
              placeholder="Type your message or paste text here..."
            />
            <button
              onClick={sendPrompt}
              className="bg-blue-500 text-white px-4 rounded shadow hover:bg-blue-600"
            >
              Send 🚀
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
