import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const handleStartChat = () => {
        if (!input.trim()) return;
        navigate('/ai-chat', { state: { initialMessage: input } });
    };

    return (
        <section className="py-16 md:py-24 bg-slate-950 relative overflow-hidden transition-colors">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="w-11/12 max-w-4xl mx-auto relative z-10 text-center">
                <div className="mb-8 md:mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 md:mb-6"
                    >
                        <Sparkles size={14} />
                        New Update
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter leading-none px-2">
                        AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Voice Assistant</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">24/7 Intelligent Medical Guidance</p>
                </div>

                {/* THE ORB */}
                <div className="relative flex justify-center mb-8 md:mb-12 scale-90 md:scale-100">
                    <motion.div
                        animate={{ 
                            y: [0, -15, 0],
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-40 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-400 rounded-full blur-2xl opacity-20"></div>
                        <div className="w-full h-full rounded-full border border-white/20 backdrop-blur-3xl bg-white/5 shadow-[inset_0_0_40px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden">
                            <div className="flex gap-2 items-center">
                                <motion.div animate={{ height: [20, 40, 20] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 bg-white rounded-full shadow-[0_0_15px_#fff]" />
                                <motion.div animate={{ height: [40, 60, 40] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-1.5 bg-white rounded-full shadow-[0_0_15px_#fff]" />
                                <motion.div animate={{ height: [20, 40, 20] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-1.5 bg-white rounded-full shadow-[0_0_15px_#fff]" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* INPUT AREA */}
                <div className="max-w-xl mx-auto px-2">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[20px] md:rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-[20px] md:rounded-[24px] backdrop-blur-xl group-focus-within:border-blue-500/50 transition-all">
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
                                placeholder="Type health concern..."
                                className="flex-1 bg-transparent border-none focus:outline-none text-white font-bold placeholder:text-slate-600 px-4 md:px-6 py-3 text-sm"
                            />
                            <button 
                                onClick={handleStartChat}
                                className="p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all active:scale-90 shadow-lg"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-[8px] md:text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
                        ⚠️ Safe private consultation
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AIAssistant;
