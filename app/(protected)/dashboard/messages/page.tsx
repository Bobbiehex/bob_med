"use client";

import { useState, useRef, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useSession } from "next-auth/react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  timestamp?: string;
}

export default function Chat() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "guest";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState(""); // AI typing text
  const [typingDots, setTypingDots] = useState(""); // animated dots
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [feedbackGiven, setFeedbackGiven] = useState<{ [key: string]: "up" | "down" }>({});

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, streamingText]);

  // Animate dots while AI is typing
  useEffect(() => {
    if (!loading) {
      setTypingDots("");
      return;
    }
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4; // 0 → 1 → 2 → 3 → 0
      setTypingDots(".".repeat(count));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = Date.now().toString();
    const newMessages: ChatMessage[] = [...messages, { role: "user" as const, text: input, timestamp }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, user_id: userId }),
      });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let aiReply = "";
      const aiTimestamp = Date.now().toString();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        const words = chunk.split(/(\s+)/);
        for (const word of words) {
          aiReply += word;
          setStreamingText(aiReply);
          await new Promise((r) => setTimeout(r, 30));
        }
      }

      setMessages([...newMessages, { role: "assistant" as const, text: aiReply, timestamp: aiTimestamp }]);
      setStreamingText("");
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: "assistant" as const, text: "⚠ Failed to contact AI service", timestamp: Date.now().toString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (timestamp: string | undefined, reward: number) => {
    if (!timestamp) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timestamp, reward }),
      });
      setFeedbackGiven((prev) => ({
        ...prev,
        [timestamp]: reward === 1 ? "up" : "down",
      }));
    } catch (err) {
      console.error("Feedback error:", err);
    }
  };

  const renderAIText = (text: string) => {
    const paragraphs = text.split("\n\n");
    return paragraphs.map((para, i) => {
      if (/^\d+\./.test(para.trim())) {
        const lines = para.split("\n").map((line) => line.trim());
        return (
          <ol key={i} className="list-decimal list-inside mb-2">
            {lines.map((line, j) => <li key={j}>{line.replace(/^\d+\.\s*/, "")}</li>)}
          </ol>
        );
      }

      if (/^(\-|\*)\s/.test(para.trim())) {
        const lines = para.split("\n").map((line) => line.trim());
        return (
          <ul key={i} className="list-disc list-inside mb-2">
            {lines.map((line, j) => <li key={j}>{line.replace(/^(\-|\*)\s*/, "")}</li>)}
          </ul>
        );
      }

      return <p key={i} className="mb-2">{para}</p>;
    });
  };

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-3 border border-gray-300 dark:border-gray-700 p-3 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              m.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white self-start"
            }`}
          >
            <strong>{m.role === "user" ? "You" : "AI"}:</strong>
            {m.role === "assistant" ? renderAIText(m.text) : <span> {m.text}</span>}
            {m.role === "assistant" && (
              <div className="flex gap-3 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => sendFeedback(m.timestamp, 1)}
                  className={`flex items-center gap-1 hover:text-green-600 ${
                    feedbackGiven[m.timestamp || ""] === "up" ? "text-green-600" : ""
                  }`}
                >
                  <ThumbsUp size={16} /> Helpful
                </button>
                <button
                  onClick={() => sendFeedback(m.timestamp, -1)}
                  className={`flex items-center gap-1 hover:text-red-600 ${
                    feedbackGiven[m.timestamp || ""] === "down" ? "text-red-600" : ""
                  }`}
                >
                  <ThumbsDown size={16} /> Not helpful
                </button>
              </div>
            )}
          </div>
        ))}

        {streamingText && (
          <div className="p-2 rounded max-w-[80%] bg-gray-200 text-black dark:bg-gray-800 dark:text-white self-start">
            <strong>AI:</strong>
            {renderAIText(streamingText)}
            <span className="ml-1">{typingDots}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
        {loading && !streamingText && <div className="text-gray-500 italic">AI is thinking...</div>}
      </div>

      <div className="flex mt-4">
        <input
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded p-2 mr-2 
                     bg-white text-black dark:bg-gray-900 dark:text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded 
                     disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
