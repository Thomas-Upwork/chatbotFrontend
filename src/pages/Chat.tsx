import { useState, useCallback, useRef, useEffect } from "react";
import type { IMessage } from "../interfaces";

const initialData: IMessage[] = [
  {
    role: "assistant",
    content: "Founder training engine at your service",
  }
];

function Chat() {
  const [messages, setMessages] = useState<IMessage[]>(initialData);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [model,/* setModel */]=useState<string>('openai')

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = useCallback(async () => {
    if (!inputValue.trim()) return;

    // Abort previous request if still loading
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false); // Reset loading state
      return;
    }

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
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 20000); 

      // const url = `/api/abort`;
      const url=`/api/chat/${model}`
      const response = await fetch(url, {
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
      abortControllerRef.current = null; // Clear after successful request

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if(!data.ok){
        setError(data.message)
        return
      }

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
  }, [inputValue, messages, model,isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
      {/* <select
      className="m-4"
      onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>setModel(e.target.value)}
      >
      <option value="llama3">Llama 3</option>
      <option value="openai">Chatgpt 4.1</option>
      </select> */}

      <div className="w-full maindiv text-white max-w-2xl p-6 rounded-md bg-black shadow-lg border-1 border-b-blue-50">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl  bg-black font-bold mb-4 text-center">
            Founder Training Engine
          </h2>
          <button className="m-4 rounded-md px-4 py-2 text-white hover:bg-blue-600 bg-gray-500 transition-colors">
            <a href="/api/login/logout">Log out</a>
          </button>
        </div>
        <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-black">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gray-800 ml-auto max-w-xs'
                  : 'bg-black mr-auto max-w-xs'
              }`}
            >
              <p className="font-semibold capitalize">{message.role}</p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isLoading && (
            <div className="bg-black mr-auto max-w-xs">
              <p>Thinking...</p>
            </div>
          )}

          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          <div ref={messagesEndRef} />
        </div>

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
            className="rounded-md px-4 py-2 bg-blue-400 text-white hover:bg-blue-600 disabled:bg-gray-500 transition-colors"
            disabled={!inputValue.trim() }
            onClick={handleSend}
          >
            {isLoading ? 'Abort?...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;