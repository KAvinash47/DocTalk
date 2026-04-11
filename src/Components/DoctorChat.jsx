import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Mic, MicOff } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const DoctorChat = ({ doctor, onClose }) => {
    const storageKey = `chat_${doctor.id}`;
    
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : [
            { text: `Hello! I'm the AI assistant for ${doctor.name}. How can I help you today?`, sender: 'ai' }
        ];
    });
    
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Voice Recognition Setup
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support voice recognition.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
        recognition.start();
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg,
                    doctorName: doctor.name,
                    specialty: doctor.specialization 
                })
            });
            const data = await response.json();
            
            // Start Typing Animation
            simulateTyping(data.reply);
        } catch (error) {
            setMessages(prev => [...prev, { text: "Doctor AI is currently unavailable.", sender: 'ai' }]);
            setIsLoading(false);
        }
    };

    const simulateTyping = (fullText) => {
        let currentText = "";
        const words = fullText.split(" ");
        let i = 0;
        
        setIsLoading(false);
        const typingMsg = { text: "", sender: 'ai', isTyping: true };
        setMessages(prev => [...prev, typingMsg]);

        const interval = setInterval(() => {
            if (i < words.length) {
                currentText += (i === 0 ? "" : " ") + words[i];
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].text = currentText;
                    return newMsgs;
                });
                i++;
            } else {
                clearInterval(interval);
                setMessages(prev => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1].isTyping = false;
                    return newMsgs;
                });
            }
        }, 100); // Speed of typing
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[600px]">
                
                {/* Header */}
                <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Bot size={24} />
                        <div>
                            <h3 className="font-black text-lg">Chat with {doctor.name}</h3>
                            <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest">{doctor.specialization} AI Assistant</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
                </div>

                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 rounded-2xl text-sm font-medium shadow-sm max-w-[85%]
                                ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                                {msg.text}
                                {msg.isTyping && <span className="inline-block w-1.5 h-4 bg-blue-400 ml-1 animate-pulse" />}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="animate-pulse text-slate-400 text-xs font-bold uppercase ml-2">AI is analyzing...</div>}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-2">
                        <button onClick={startListening} className={`p-3 rounded-xl transition-colors ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-slate-400 hover:text-blue-600'}`}>
                            {isListening ? <Mic size={20} /> : <Mic size={20} />}
                        </button>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isListening ? "Listening..." : "Ask your doctor..."}
                            className="flex-1 bg-transparent border-none focus:outline-none px-4 text-sm font-bold text-slate-800 dark:text-white" />
                        <button onClick={handleSend} disabled={isLoading} className="p-3 bg-blue-600 text-white rounded-xl shadow-lg active:scale-95 disabled:opacity-50">
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DoctorChat;
