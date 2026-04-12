import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Activity, Salad, Dumbbell, AlertTriangle, ShieldCheck, Stethoscope, Bot, X, Send } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import useDocumentTitle from '../hooks/useDocumentTitle';

const DiseaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disease, setDisease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckerOpen, setIsCheckerOpen] = useState(false);
    
    // Symptom Checker State
    const [userSymptoms, setUserSymptoms] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useDocumentTitle(disease ? `${disease.name} Guide` : 'Disease Details');

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/diseases/${id}`)
            .then(res => res.json())
            .then(data => {
                setDisease(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleAICheck = async () => {
        if (!userSymptoms.trim()) return;
        setIsChecking(true);
        setAiResponse(null);

        try {
            const res = await fetch(`${API_BASE_URL}/api/ai-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: userSymptoms, diseaseName: disease.name })
            });
            const data = await res.json();
            setAiResponse(data.reply);
        } catch (error) {
            setAiResponse("Symptom checker is currently unavailable.");
        } finally {
            setIsChecking(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    if (!disease) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white"><h2 className="text-2xl font-bold mb-4">Disease Not Found</h2><button onClick={() => navigate('/health-guide')} className="btn btn-primary px-8 rounded-full">Back to Guide</button></div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <button onClick={() => navigate('/health-guide')} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex-1 text-center md:text-left">
                        <div className="text-6xl mb-4">{disease.icon}</div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">{disease.name}</h1>
                        <span className="px-4 py-1.5 bg-blue-600 rounded-full text-xs font-black uppercase tracking-widest">{disease.category} Specialist Recommended: {disease.specialist}</span>
                    </div>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Symptoms */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-transparent dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-8">
                            <Activity className="text-blue-600" size={32} />
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Key Symptoms</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {disease.symptoms.map((s, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    {s}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Causes & Treatment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800">
                            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">Root Causes</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{disease.causes}</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800">
                            <h4 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-4">Typical Treatment</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{disease.treatment}</p>
                        </div>
                    </div>

                    {/* Diet & Exercise */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800 flex gap-6">
                            <Salad className="text-orange-500 shrink-0" size={32} />
                            <div>
                                <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-2">Recommended Diet</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{disease.diet}</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800 flex gap-6">
                            <Dumbbell className="text-purple-500 shrink-0" size={32} />
                            <div>
                                <h4 className="text-xs font-black text-purple-500 uppercase tracking-widest mb-2">Health Exercises</h4>
                                <p className="text-slate-600 dark:text-slate-400 font-medium">{disease.exercises}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <Bot className="absolute -bottom-4 -right-4 text-white/10" size={120} />
                        <h3 className="text-2xl font-black mb-4 tracking-tight uppercase">Analyze with AI</h3>
                        <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">Not sure if your symptoms match? Use CompileXBot to get an intelligent assessment.</p>
                        <button 
                            onClick={() => setIsCheckerOpen(true)}
                            className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Start AI Check
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-transparent dark:border-slate-800 text-center">
                        <Stethoscope className="mx-auto mb-6 text-slate-400" size={48} />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Professional Consultation</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Consult a verified {disease.specialist} for expert medical advice.</p>
                        <button 
                            onClick={() => navigate(`/?search=${disease.specialist}`)}
                            className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                        >
                            Book {disease.specialist}
                        </button>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-[32px] p-8 flex gap-4">
                        <AlertTriangle className="text-red-500 shrink-0" size={24} />
                        <div>
                            <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Crucial Precautions</h4>
                            <p className="text-red-700 dark:text-red-400 text-sm font-bold">{disease.precautions}</p>
                        </div>
                    </div>
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
                                        <h3 className="font-black text-xl leading-none uppercase tracking-tight">AI Symptom Checker</h3>
                                        <p className="text-[10px] opacity-80 font-bold uppercase mt-1 tracking-widest">Analyzing for {disease.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsCheckerOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                                {!aiResponse ? (
                                    <div className="space-y-6 text-center py-10">
                                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Activity className="text-blue-600" size={40} />
                                        </div>
                                        <h4 className="text-xl font-black text-slate-900 dark:text-white">What are you feeling?</h4>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Describe your symptoms in detail (e.g., how long have you felt this way, severity, etc.)</p>
                                        <textarea 
                                            value={userSymptoms}
                                            onChange={(e) => setUserSymptoms(e.target.value)}
                                            placeholder="Example: I have a mild headache and feel dizzy for the last 2 days..."
                                            className="w-full h-32 p-6 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-inner transition-all"
                                        />
                                        <button 
                                            onClick={handleAICheck}
                                            disabled={isChecking || !userSymptoms.trim()}
                                            className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 disabled:opacity-50 disabled:scale-100 transition-all shadow-xl shadow-blue-500/20"
                                        >
                                            {isChecking ? "Analyzing Symptoms..." : "Analyze Now"}
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
                                            <button onClick={() => navigate(`/?search=${disease.specialist}`)} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all">Book {disease.specialist}</button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            
                            <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 text-center shrink-0">
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">⚠️ This is not a diagnosis. For emergencies, call local services immediately.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiseaseDetails;
