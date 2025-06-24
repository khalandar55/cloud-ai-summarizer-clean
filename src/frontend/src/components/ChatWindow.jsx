import { useEffect, useRef } from "react";

function ChatWindow({ chat }) {
  const bottomRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded shadow-inner">
      {chat.length === 0 ? (
        <p className="text-gray-400 italic">No conversation yet.</p>
      ) : (
        chat.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } mb-2`}
          >
            <div
              className={`px-4 py-2 max-w-xs rounded-lg text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))
      )}
      {/* Empty div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatWindow;
