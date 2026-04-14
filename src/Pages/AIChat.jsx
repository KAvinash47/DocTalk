import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User, Sparkles, Shield, Paperclip, Image as ImageIcon, X } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import ReactMarkdown from 'react-markdown';

const AIChat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initial message from home page
    useEffect(() => {
        const initialMsg = location.state?.initialMessage;
        if (initialMsg) {
            handleSendMessage(initialMsg);
        } else {
            setMessages([{ text: "Hello! I am PulseTalk AI. You can ask me medical questions or **upload a medical report/prescription image** for me to explain!", sender: 'ai' }]);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async (msgText) => {
        const textToSend = msgText || input;
        if (!textToSend.trim() && !selectedImage) return;

        const newUserMsg = { 
            text: textToSend, 
            sender: 'user', 
            image: selectedImage 
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setSelectedImage(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: selectedImage 
                        ? `[IMAGE ATTACHED] User has uploaded a medical report. Please analyze the context of this message: ${textToSend || 'Explain this report'}` 
                        : textToSend 
                })
            });
            const data = await response.json();
            if (response.ok) {
                setMessages(prev => [...prev, { text: data.reply, sender: 'ai' }]);
            } else {
                setMessages(prev => [...prev, { text: data.reply || "AI Service Error", sender: 'ai' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { text: "I'm having trouble connecting to PulseTalk servers. Please try again later.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col relative overflow-hidden transition-colors">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px]"></div>
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-600 dark:text-white">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Bot size={24} className="text-white" />
                        </div>
                        <div>
                            <h1 className="font-black text-lg tracking-tight text-slate-900 dark:text-white">PulseTalk AI</h1>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">Medical Intelligence Active</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                    <Shield size={14} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">Secure & Private</span>
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
                                    ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-sm'}`}>
                                    {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-600 dark:text-white" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-xl
                                    ${msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-700 dark:text-slate-200 rounded-tl-none backdrop-blur-md'
                                    }`}
                                >
                                    {msg.image && (
                                        <div className="mb-3 rounded-xl overflow-hidden border-2 border-white/20">
                                            <img src={msg.image} alt="Uploaded Report" className="max-w-full h-auto" />
                                            <div className="bg-white/10 p-2 text-[10px] font-black uppercase text-center">Medical Report Attached</div>
                                        </div>
                                    )}
                                    {msg.sender === 'ai' ? (
                                        <div className="prose prose-sm dark:prose-invert max-w-none 
                                            prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100
                                            prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-ul:list-disc prose-ol:list-decimal">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center">
                                <Bot size={16} className="text-slate-600 dark:text-white" />
                            </div>
                            <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-4 rounded-2xl rounded-tl-none shadow-md">
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
            <footer className="relative z-10 p-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 transition-colors">
                <div className="max-w-4xl mx-auto">
                    {/* Image Preview */}
                    <AnimatePresence>
                        {selectedImage && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="mb-4 relative inline-block group"
                            >
                                <img src={selectedImage} className="h-24 w-24 object-cover rounded-2xl border-2 border-blue-500 shadow-xl" alt="Preview" />
                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg group-hover:scale-110 transition-transform"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-600/10 dark:bg-blue-600/20 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-2 p-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[24px] backdrop-blur-xl">
                            
                            <input 
                                type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden"
                            />
                            <button 
                                onClick={() => fileInputRef.current.click()}
                                className="p-3 text-slate-400 hover:text-blue-500 transition-colors"
                                title="Upload Medical Report"
                            >
                                <ImageIcon size={22} />
                            </button>

                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Explain this blood report..."
                                className="flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
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
                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">
                        <Shield size={12} className="text-blue-500" />
                        We Provide Best Medical Services
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AIChat;
