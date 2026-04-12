import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Lightbulb, Bot, X, Activity, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { API_BASE_URL } from '../api/config';
import DiseaseCard from '../Components/DiseaseCard';

const HealthGuide = () => {
    const navigate = useNavigate();
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [healthTip, setHealthTip] = useState('');
    
    // Pagination State
    const [visibleCount, setVisibleCount] = useState(6);
    
    // AI Modal State
    const [isCheckerOpen, setIsCheckerOpen] = useState(false);
    const [userSymptoms, setUserSymptoms] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useScrollReveal();

    useEffect(() => {
        const tips = [
            "Drink at least 8 glasses of water daily.",
            "A 30-minute daily walk improves heart health.",
            "Sleep for 7-9 hours for better mental clarity.",
            "Eat leafy greens to boost your immunity.",
            "Take screen breaks every 20 minutes."
        ];
        setHealthTip(tips[Math.floor(Math.random() * tips.length)]);
        
        fetch(`${API_BASE_URL}/api/diseases`)
            .then(res => res.json())
            .then(data => {
                setDiseases(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error:", err);
                setLoading(false);
            });
    }, []);

    const filteredDiseases = diseases.filter(d => {
        const query = searchQuery.toLowerCase().trim();
        const matchesCategory = category === 'All' || d.category === category;
        if (!matchesCategory) return false;
        if (!query) return true;
        return (d.name || "").toLowerCase().includes(query) || 
               (d.description || "").toLowerCase().includes(query);
    });

    const visibleDiseases = filteredDiseases.slice(0, visibleCount);

    const handleGeneralAICheck = async () => {
        if (!userSymptoms.trim()) return;
        setIsChecking(true);
        setAiResponse(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/ai-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: userSymptoms })
            });
            const data = await res.json();
            setAiResponse(data.reply);
        } catch (error) {
            setAiResponse("Symptom checker offline.");
        } finally {
            setIsChecking(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 text-white text-center px-4 relative">
                <div className="relative z-10 animate-fade-up">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase">Health Guide</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px] md:text-xs">Intelligent Disease Encyclopedia & Symptom Checker</p>
                    <button onClick={() => setIsCheckerOpen(true)} className="mt-8 px-8 py-3 bg-white text-blue-600 rounded-full font-black uppercase text-xs hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto">
                        <Bot size={18} /> Start AI Symptom Check
                    </button>
                </div>
            </div>

            <div className="w-11/12 max-w-7xl mx-auto -mt-10 relative z-20">
                {/* Search Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-16 reveal">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search condition (e.g. Pain, Heart)..." 
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => {setSearchQuery(e.target.value); setVisibleCount(6);}}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-xl overflow-x-auto no-scrollbar">
                        {['All', 'Heart', 'Skin', 'Critical', 'Brain', 'Digestion'].map(cat => (
                            <button key={cat} onClick={() => {setCategory(cat); setVisibleCount(6);}} className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
                    {visibleDiseases.map((disease, index) => (
                        <div key={disease.id} className="reveal" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                            <DiseaseCard disease={disease} />
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {visibleCount < filteredDiseases.length && (
                    <div className="text-center mt-16 reveal">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 6)}
                            className="group px-12 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-full font-black uppercase text-xs tracking-widest border border-slate-100 dark:border-slate-800 shadow-xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 mx-auto"
                        >
                            Explore More Diseases
                            <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}

                {filteredDiseases.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Matches Found</h3>
                        <p className="text-slate-500 font-medium">Try different keywords or browse all categories.</p>
                    </div>
                )}
            </div>

            {/* AI Modal (Already Implemented) */}
            <AnimatePresence>
                {isCheckerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] overflow-hidden flex flex-col h-[600px]">
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                                <div className="flex items-center gap-4"><Bot size={24}/><h3 className="font-black text-xl uppercase">AI Symptom Checker</h3></div>
                                <button onClick={() => setIsCheckerOpen(false)}><X size={24} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
                                {!aiResponse ? (
                                    <div className="space-y-6 text-center">
                                        <textarea value={userSymptoms} onChange={(e) => setUserSymptoms(e.target.value)} placeholder="Describe symptoms..." className="w-full h-40 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-inner" />
                                        <button onClick={handleGeneralAICheck} disabled={isChecking || !userSymptoms.trim()} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs hover:scale-105 disabled:opacity-50 transition-all shadow-xl">{isChecking ? "Analyzing..." : "Analyze Now"}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border dark:border-slate-800 whitespace-pre-line font-medium text-slate-700 dark:text-slate-300">{aiResponse}</div>
                                        <button onClick={() => setAiResponse(null)} className="w-full py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-xs">Retry</button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthGuide;
