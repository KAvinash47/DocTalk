import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Lightbulb, Bot, X, Activity, ChevronDown, Zap } from 'lucide-react';
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
    
    // Pagination
    const [visibleCount, setVisibleCount] = useState(8);
    
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
        
        const fetchDiseases = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/diseases`);
                if (!res.ok) throw new Error("API failed");
                const data = await res.json();
                console.log("Fetched diseases from API:", data.length);
                setDiseases(data);
            } catch (err) {
                console.warn("API failed, falling back to local JSON...");
                try {
                    const localRes = await fetch('/Data/diseases.json');
                    const localData = await localRes.json();
                    console.log("Loaded diseases from local fallback:", localData.length);
                    setDiseases(localData);
                } catch (localErr) {
                    console.error("Critical: Could not load local fallback data.", localErr);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDiseases();
    }, []);

    // Optimized Search + Filter Logic
    const filteredDiseases = diseases.filter(d => {
        const query = searchQuery.toLowerCase().trim();
        
        // Category Filter
        const matchesCategory = category === 'All' || d.category === category;
        if (!matchesCategory) return false;

        // Search Filter
        if (!query) return true;
        
        const name = (d.name || "").toLowerCase();
        const description = (d.description || "").toLowerCase();
        const symptoms = Array.isArray(d.symptoms) ? d.symptoms.join(" ").toLowerCase() : "";

        return name.includes(query) || description.includes(query) || symptoms.includes(query);
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
            setAiResponse("AI service is currently busy. Please try again later.");
        } finally {
            setIsChecking(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 animate-fade-up">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">PulseTalk Health Guide</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">Intelligent Encyclopedia & Expert Symptom Awareness</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <button onClick={() => setIsCheckerOpen(true)} className="px-8 py-3 bg-white text-blue-600 rounded-full font-black uppercase text-xs hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto sm:mx-0">
                            <Bot size={18} /> Check Symptoms
                        </button>
                        <button onClick={() => navigate('/health-tools')} className="px-8 py-3 bg-blue-500 text-white rounded-full font-black uppercase text-xs hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto sm:mx-0 border border-white/20">
                            <Zap size={18} /> Try Health Tools
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-11/12 max-w-7xl mx-auto -mt-10 relative z-20">
                {/* Daily Tip */}
                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 shadow-xl border border-white dark:border-slate-800 flex flex-col md:flex-row items-center gap-6 mb-12 animate-fade-up">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                        <Lightbulb size={32} className="text-white" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-yellow-600 uppercase tracking-widest mb-1">Daily Health Tip</h4>
                        <p className="text-slate-700 dark:text-slate-200 font-bold text-lg md:text-xl italic">"{healthTip}"</p>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col lg:flex-row gap-4 mb-16 reveal">
                    <div className="flex-1 relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name, symptom or specialist..." 
                            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-3xl shadow-2xl font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => {setSearchQuery(e.target.value); setVisibleCount(8);}}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-xl overflow-x-auto no-scrollbar">
                        {['All', 'Heart', 'Skin', 'Brain', 'Digestion', 'Lungs', 'General'].map(cat => (
                            <button 
                                key={cat} 
                                onClick={() => {setCategory(cat); setVisibleCount(8);}} 
                                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase whitespace-nowrap transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Results Grid */}
                {visibleDiseases.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {visibleDiseases.map((disease, index) => (
                                <div key={disease.id} className="reveal" style={{ transitionDelay: `${(index % 4) * 0.1}s` }}>
                                    <DiseaseCard disease={disease} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination Button */}
                        {visibleCount < filteredDiseases.length && (
                            <div className="text-center mt-16">
                                <button 
                                    onClick={() => setVisibleCount(prev => prev + 8)}
                                    className="px-12 py-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:bg-blue-600 hover:text-white transition-all border border-transparent dark:border-slate-800"
                                >
                                    Explore More Conditions
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-fade-up">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">No Matches Found</h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Try searching for common terms like "Heart", "Pain", or "Fever".</p>
                    </div>
                )}
            </div>

            {/* Symptom Checker Modal */}
            <AnimatePresence>
                {isCheckerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] overflow-hidden flex flex-col h-[600px]">
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0 shadow-lg">
                                <div className="flex items-center gap-4"><Bot size={28}/><h3 className="font-black text-xl uppercase tracking-tighter">AI Pulse Checker</h3></div>
                                <button onClick={() => setIsCheckerOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={28} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950">
                                {!aiResponse ? (
                                    <div className="space-y-8 text-center">
                                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"><Activity className="text-blue-600" size={48} /></div>
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">How are you feeling?</h4>
                                        <textarea value={userSymptoms} onChange={(e) => setUserSymptoms(e.target.value)} placeholder="Describe symptoms in detail..." className="w-full h-48 p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-2xl transition-all" />
                                        <button onClick={handleGeneralAICheck} disabled={isChecking || !userSymptoms.trim()} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 disabled:opacity-50 transition-all shadow-2xl shadow-blue-500/20">{isChecking ? "Analyzing..." : "Start Assessment"}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl whitespace-pre-line font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-l-8 border-l-blue-600">{aiResponse}</div>
                                        <button onClick={() => setAiResponse(null)} className="w-full py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black uppercase text-xs">Retry Analysis</button>
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
