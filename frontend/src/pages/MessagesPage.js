import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/ai-message",
        { message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMsg = { sender: "bot", text: res.data.reply || "No response." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const botMsg = { sender: "bot", text: "⚠️ Failed to get response. Please try again." };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 flex flex-col">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          🤖 AI Career Assistant
        </h2>

        {/* Chat Window */}
        <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl p-4 mb-4 overflow-y-auto h-[60vh] bg-gray-50 dark:bg-gray-800 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
              👋 Start by asking your AI assistant about your career, skills, or learning path!
            </p>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl text-gray-700 dark:text-gray-300 italic">
                Typing<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your career..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none dark:bg-gray-800 dark:text-white"
            disabled={loading}
          />
          <motion.button
            onClick={sendMessage}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Send size={20} />
            Send
          </motion.button>
        </div>
      </div>
    </div>
  );
}
