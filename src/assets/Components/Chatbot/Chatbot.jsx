import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X, MessageSquare } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am CivicBot. How can I help you with CivicLens today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const currentInput = input;
    setInput("");

    try {
      // API call to your Backend
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) throw new Error("Backend response error");

      const data = await response.json();

      // Backend should return { reply: "..." }
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: "bot", 
        text: "Please check if your server is running!" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-instrument">
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[999] p-4 rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center
          ${isOpen ? 'bg-red-500 rotate-90' : 'bg-emerald-600 rotate-0'}`}
      >
        {isOpen ? <X size={28} className="text-white" /> : <Bot size={28} className="text-white" />}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-24 right-6 z-[998] w-[350px] sm:w-[400px] h-[550px] bg-[#0b1410] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right
        ${isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-6 bg-emerald-600/10 border-b border-white/5 flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white text-sm font-black uppercase tracking-widest">CivicBot</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">AI Assistant</p>
          </div>
        </div>

        {/* Messages Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-gray-300 border border-white/5 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-emerald-500 text-[10px] font-bold uppercase animate-pulse">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              CivicBot is thinking...
            </div>
          )}
        </div>

        {/* Input Field */}
        <div className="p-6 bg-black/40 border-t border-white/5">
          <div className="flex gap-2 bg-[#050d0a] border border-white/10 rounded-2xl p-2 focus-within:border-emerald-500 transition-all">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-3 py-2 text-xs text-white outline-none"
            />
            <button 
              onClick={handleSend} 
              disabled={loading}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl text-white transition-all shadow-lg"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Chatbot;