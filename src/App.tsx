import { useState, useCallback, useRef, useEffect } from "react";
import type { IMessage } from "./interfaces";

const initialData: IMessage[] = [
  {
    role: 'system',
    content: "You are an AI assistan, but you give only short answers",
  },
  {
    role: "user",
    content: "What's the gravity on the moon?",
  },
  {
    role: "assistant",
    content: "1/6 the gravity of Earth",
  },
];

function App() {
  const [messages, setMessages] = useState<IMessage[]>(initialData);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userMessage: IMessage = {
        role: "user",
        content: inputValue,
      };
      
      setMessages((prev) => [...prev, userMessage]);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
        signal: controller.signal,
        

      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("data ",data)
      const assistantMessage: IMessage = {
        role: "assistant",
        content: data.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setInputValue("");
      // scrollToBottom()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("API call failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-2xl p-6 rounded-md bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Chat</h2>
        
        <div className="h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-100 ml-auto max-w-xs"
                  : "bg-gray-100 mr-auto max-w-xs"
              }`}
            >
              <p className="font-semibold capitalize">{message.role}</p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 p-3 rounded-lg mr-auto max-w-xs">
              <p>Thinking...</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div className="text-red-500 mb-4 text-center">{error}</div>
        )}

        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={!inputValue.trim() || isLoading}
            onClick={handleSend}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;