import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Sparkles, Shield } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const AIChat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    // Initial message from home page
    useEffect(() => {
        const initialMsg = location.state?.initialMessage;
        if (initialMsg) {
            handleSendMessage(initialMsg);
        } else {
            setMessages([{ text: "Hello! I am your AI medical assistant. How can I help you today?", sender: 'ai' }]);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (msgText) => {
        const textToSend = msgText || input;
        if (!textToSend.trim()) return;

        if (!msgText) {
            setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
            setInput('');
        } else {
            setMessages(prev => [...prev, { text: textToSend, sender: 'user' }]);
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: textToSend })
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
            } else {
                setMessages(prev => [...prev, { text: data.reply || "AI Service Error", sender: 'ai' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: "I'm having trouble connecting to the server. Please check your internet or try again later.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg tracking-tight">Gemini Assistant</h1>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Consultation</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <Shield size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-slate-300">Secure & Private</span>
                </div>
            </header>

            {/* Chat Area */}
            <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar max-w-4xl mx-auto w-full">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 
                                    ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/10'}`}>
                                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-2xl
                                    ${msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-md'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                                <Bot size={16} />
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Input Area */}
            <footer className="relative z-10 p-6 bg-slate-950 border-t border-white/10">
                <div className="max-w-4xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/20 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-[24px] backdrop-blur-xl">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none focus:outline-none px-6 py-3 text-sm font-bold text-white placeholder:text-slate-600"
                            />
                            <button 
                                onClick={() => handleSendMessage()}
                                disabled={isLoading}
                                className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
                        <Sparkles size={12} className="text-blue-500" />
                        AI Powered Medical Guidance
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AIChat;
