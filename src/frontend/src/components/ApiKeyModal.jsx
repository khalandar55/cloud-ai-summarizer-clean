function ApiKeyModal({ apiKey, setApiKey }) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">🔑 API Key (Optional)</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded text-sm"
          placeholder="Enter HuggingFace or OpenAI key if needed"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
    );
  }
  
  export default ApiKeyModal;
  