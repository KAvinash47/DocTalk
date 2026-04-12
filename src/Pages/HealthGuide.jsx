import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Lightbulb, ArrowRight, Bot, X, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollReveal from '../hooks/useScrollReveal';
import { API_BASE_URL } from '../api/config';

const HealthGuide = () => {
    const navigate = useNavigate();
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [healthTip, setHealthTip] = useState('');
    
    // AI Checker Modal State
    const [isCheckerOpen, setIsCheckerOpen] = useState(false);
    const [userSymptoms, setUserSymptoms] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useScrollReveal();

    const tips = [
        "Drink at least 8 glasses of water daily to stay hydrated.",
        "A 30-minute walk every day can significantly improve heart health.",
        "Prioritize 7-9 hours of sleep for better mental clarity.",
        "Eat more leafy greens to boost your immune system.",
        "Take a break from screens every 20 minutes to reduce eye strain."
    ];

    useEffect(() => {
        setHealthTip(tips[Math.floor(Math.random() * tips.length)]);
        
        fetch(`${API_BASE_URL}/api/diseases`)
            .then(res => res.json())
            .then(data => {
                setDiseases(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching diseases:", err);
                setLoading(false);
            });
    }, []);

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
            setAiResponse("Symptom checker is currently unavailable.");
        } finally {
            setIsChecking(false);
        }
    };

    const filteredDiseases = diseases.filter(d => {
        const name = d.name || "";
        const symptoms = Array.isArray(d.symptoms) ? d.symptoms.join(" ") : "";
        const description = d.description || "";
        
        const searchLower = searchQuery.toLowerCase();
        
        const matchesSearch = name.toLowerCase().includes(searchLower) || 
                             symptoms.toLowerCase().includes(searchLower) ||
                             description.toLowerCase().includes(searchLower);
                             
        const matchesCategory = category === 'All' || d.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(diseases.map(d => d.category))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 animate-fade-up">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">AI Health Guide</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px] md:text-xs leading-loose">
                        Your intelligent companion for medical knowledge and symptom awareness
                    </p>
                    <button 
                        onClick={() => setIsCheckerOpen(true)}
                        className="mt-8 px-8 py-3 bg-white text-blue-600 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-2 mx-auto"
                    >
                        <Bot size={18} /> Start General AI Check
                    </button>
                </div>
            </div>

            <div className="w-11/12 max-w-7xl mx-auto -mt-10 relative z-20">
                {/* Health Tip Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-6 mb-12 animate-fade-up">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200 shrink-0 animate-bounce">
                        <Lightbulb size={32} className="text-white" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">Health Tip of the Day</h4>
                        <p className="text-slate-700 dark:text-slate-200 font-bold text-lg md:text-xl italic">"{healthTip}"</p>
                    </div>
                </div>
{/* Search & Filter Bar */}
<div className="flex flex-col lg:flex-row gap-4 mb-12 reveal">
    <form 
        onSubmit={(e) => e.preventDefault()}
        className="flex-1 relative group"
    >
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input 
            type="text" 
            placeholder="Search by disease name or symptom..." 
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-transparent focus:border-blue-500 rounded-2xl shadow-xl transition-all font-bold text-slate-700 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
        />
    </form>

                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-transparent">
                        <Filter className="ml-3 text-slate-400" size={20} />
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Disease Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDiseases.map((disease, index) => (
                        <div key={disease.id} className="reveal" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-gray-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                                
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">{disease.icon}</div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{disease.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                                        {disease.description}
                                    </p>
                                    
                                    <button 
                                        onClick={() => navigate(`/disease/${disease.id}`)}
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all"
                                    >
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Checker Modal */}
            <AnimatePresence>
                {isCheckerOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col h-[600px]"
                        >
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/20 rounded-xl"><Bot size={24}/></div>
                                    <div>
                                        <h3 className="font-black text-xl leading-none uppercase tracking-tight">General Symptom Checker</h3>
                                        <p className="text-[10px] opacity-80 font-bold uppercase mt-1 tracking-widest">Powered by CompileXBot</p>
                                    </div>
                                </div>
                                <button onClick={() => {setIsCheckerOpen(false); setAiResponse(null); setUserSymptoms('');}} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                                {!aiResponse ? (
                                    <div className="space-y-6 text-center py-10">
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Activity className="text-blue-600" size={40} />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">Describe how you feel</h4>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Explain your symptoms in detail for an accurate AI assessment.</p>
                                        <textarea 
                                            value={userSymptoms}
                                            onChange={(e) => setUserSymptoms(e.target.value)}
                                            placeholder="Example: I have been feeling sharp chest pain and dizziness since morning..."
                                            className="w-full h-32 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-inner transition-all"
                                        />
                                        <button 
                                            onClick={handleGeneralAICheck}
                                            disabled={isChecking || !userSymptoms.trim()}
                                            className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            {isChecking ? "AI is Analyzing..." : "Check Symptoms Now"}
                                        </button>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl whitespace-pre-line font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                            <div className="flex items-center gap-3 mb-6">
                                                <ShieldCheck className="text-green-500" size={24} />
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Assessment Results</h4>
                                            </div>
                                            {aiResponse}
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button onClick={() => setAiResponse(null)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Retry Check</button>
                                            <button onClick={() => navigate('/')} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Find a Specialist</button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 text-center shrink-0">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">⚠️ This is an experimental AI feature. Consult a real doctor for medical decisions.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthGuide;
