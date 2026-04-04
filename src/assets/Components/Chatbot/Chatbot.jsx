import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
const Chatbot = () => {
  const { user } = useAuth(); // 2. Access the user object
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(""); 
  
  // 3. Update initial state to use the username if available
  const [messages, setMessages] = useState([
    { 
      role: "bot", 
      text: `Hello ${user?.username || "Citizen"}! I am CivicBot. How can I help you today?` 
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const scrollRef = useRef(null);

  // Update the greeting if the user logs in while the component is mounted
  useEffect(() => {
    if (user?.username) {
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[0] = { 
          role: "bot", 
          text: `Hello ${user.username}! I am CivicBot. How can I help you today?` 
        };
        return newMsgs;
      });
    }
  }, [user?.username]);

  useEffect(() => {
    const handleRoleChange = () => {
      const currentRole = localStorage.getItem("role");
      setUserRole(currentRole);
    };

    const interval = setInterval(handleRoleChange, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const normalizedRole = userRole ? userRole.trim().toLowerCase() : "";
  
  if (normalizedRole !== "normal user") {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    const textToSend = input;
    setInput(""); 

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Backend not connected." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 999999 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          backgroundColor: isOpen ? '#016749' : '#00592E',
          color: 'white', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '80px', right: '0',
          width: '350px', height: '500px', backgroundColor: '#0b1410',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '15px', background: 'rgba(5, 150, 105, 0.2)', color: 'white', fontWeight: 'bold' }}>
            CivicBot
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? '#059669' : 'rgba(255,255,255,0.1)',
                padding: '10px', borderRadius: '10px', color: 'white', fontSize: '13px', maxWidth: '80%'
              }}>
                {msg.text}
              </div>
            ))}
            {loading && <div style={{ color: '#059669', fontSize: '10px' }}>Thinking...</div>}
          </div>

          <div style={{ padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', background: '#050d0a' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type here..."
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', outline: 'none' }}
            />
            <button onClick={handleSend} style={{ padding: '10px 15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;