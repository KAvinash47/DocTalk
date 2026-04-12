import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Activity, Salad, Dumbbell, AlertTriangle, 
    ShieldCheck, Stethoscope, Bot, X, Send, 
    Microscope, TrendingUp, Users, Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { API_BASE_URL } from '../api/config';
import useDocumentTitle from '../hooks/useDocumentTitle';

const DiseaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [disease, setDisease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCheckerOpen, setIsCheckerOpen] = useState(false);
    
    const [userSymptoms, setUserSymptoms] = useState('');
    const [aiResponse, setAiResponse] = useState(null);
    const [isChecking, setIsChecking] = useState(false);

    useDocumentTitle(disease ? `${disease.name} Intelligence` : 'Loading Details...');

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    if (!disease) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white"><h2 className="text-2xl font-bold">Data Not Found</h2></div>;

    const statsData = [
        { name: 'Recovery Rate', value: parseInt(disease.stats.recoveryRate), color: '#10b981' },
        { name: 'Risk Factor', value: 100 - parseInt(disease.stats.recoveryRate), color: '#ef4444' }
    ];

    const prevalenceData = [
        { name: 'Affected', value: parseFloat(disease.stats.prevalence) },
        { name: 'Others', value: 100 - parseFloat(disease.stats.prevalence) }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
                </div>
                
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <button onClick={() => navigate('/health-guide')} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group shrink-0 border border-white/10">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <span className="text-6xl">{disease.icon}</span>
                            <span className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                {disease.category} Division
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none">{disease.name}</h1>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed italic">
                            "{disease.description}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
                
                {/* LEFT: Clinical Data */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* The Science */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-transparent dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                                <Microscope size={28} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pathological Science</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                            {disease.science}
                        </p>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800 text-center">
                            <div className="flex items-center justify-center gap-2 mb-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                <TrendingUp size={14} className="text-green-500" /> Survival & Recovery
                            </div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statsData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {statsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{disease.stats.recoveryRate}%</div>
                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Estimated Recovery Rate</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border border-transparent dark:border-slate-800 text-center">
                            <div className="flex items-center justify-center gap-2 mb-6 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                <Users size={14} className="text-blue-500" /> Global Prevalence
                            </div>
                            <div className="h-40 flex items-end justify-center gap-4 px-10">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-xl relative group h-full">
                                    <div className="absolute bottom-0 left-0 w-full bg-blue-600 rounded-t-xl transition-all duration-1000" style={{ height: `${disease.stats.prevalence * 5}%` }}></div>
                                </div>
                            </div>
                            <div className="mt-8 text-3xl font-black text-slate-900 dark:text-white">{disease.stats.prevalence}%</div>
                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Population Affected</p>
                        </div>
                    </div>

                    {/* Symptoms Grid */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-xl border border-transparent dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-10">
                            <Activity className="text-red-500" size={32} />
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Symptom Indicators</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {disease.symptoms.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-red-500/30 transition-colors">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{s}</span>
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lifestyle Support */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-[40px] p-10 border border-orange-100 dark:border-orange-900/30">
                            <Salad className="text-orange-500 mb-6" size={40} />
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Nutritional Advice</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{disease.diet}</p>
                        </div>
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-[40px] p-10 border border-purple-100 dark:border-purple-900/30">
                            <Dumbbell className="text-purple-500 mb-6" size={40} />
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Exercise Routine</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{disease.exercises}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Interactive Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                    
                    {/* Severity Indicator */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border-t-8 border-t-red-500">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clinical Severity</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${disease.stats.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {disease.stats.severity} Risk
                            </span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${disease.stats.severity === 'High' ? 'w-[85%] bg-red-500' : 'w-[30%] bg-green-500'}`}></div>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 font-medium italic">Based on standard medical frequency and complication probability.</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <Bot className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={150} />
                        <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">AI Diagnostic Check</h3>
                        <p className="text-blue-100 text-sm font-medium mb-10 leading-relaxed">Let CompileXBot analyze your specific symptoms against clinical data.</p>
                        <button onClick={() => setIsCheckerOpen(true)} className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Start Symptom Analysis</button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-transparent dark:border-slate-800">
                        <Stethoscope className="text-blue-600 mb-6" size={48} />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight leading-none">Consult Specialist</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 leading-relaxed">Book a prioritized consultation with our verified {disease.specialist}s.</p>
                        <button onClick={() => navigate(`/?search=${disease.specialist}`)} className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all">Secure Appointment</button>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-[32px] p-8">
                        <div className="flex gap-4">
                            <Info className="text-yellow-600 shrink-0" size={24} />
                            <div>
                                <h4 className="text-xs font-black text-yellow-700 dark:text-yellow-500 uppercase tracking-widest mb-2">Immediate Precaution</h4>
                                <p className="text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">{disease.precautions}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modal Re-used from previous implementations with full styling */}
            <AnimatePresence>
                {isCheckerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] overflow-hidden flex flex-col h-[650px]">
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0 shadow-lg">
                                <div className="flex items-center gap-4"><Bot size={28}/><div className="leading-none"><h3 className="font-black text-xl uppercase tracking-tighter">AI Medical Pulse</h3><p className="text-[10px] font-bold uppercase opacity-70 tracking-widest mt-1">Cross-referencing {disease.name}</p></div></div>
                                <button onClick={() => setIsCheckerOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={28} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                                {!aiResponse ? (
                                    <div className="space-y-8 text-center py-10">
                                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse"><Activity className="text-blue-600" size={48} /></div>
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Analyze Your Symptoms</h4>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">Provide specific details about your current condition for a comparative analysis with {disease.name}.</p>
                                        <textarea value={userSymptoms} onChange={(e) => setUserSymptoms(e.target.value)} placeholder="Type symptoms here (e.g. Sharp chest pain, difficulty breathing)..." className="w-full h-48 p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-2xl transition-all" />
                                        <button onClick={() => { setIsChecking(true); setTimeout(() => fetch(`${API_BASE_URL}/api/ai-check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symptoms: userSymptoms, diseaseName: disease.name }) }).then(r => r.json()).then(d => { setAiResponse(d.reply); setIsChecking(false); }), 1500); }} disabled={isChecking || !userSymptoms.trim()} className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 disabled:opacity-50 transition-all shadow-2xl shadow-blue-500/20">{isChecking ? "Engine Processing..." : "Generate Clinical Analysis"}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-fade-up">
                                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-2xl whitespace-pre-line font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-l-8 border-l-blue-600">
                                            <div className="flex items-center gap-3 mb-8"><ShieldCheck className="text-green-500" size={28} /><h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-xl">AI Clinical Assessment</h4></div>
                                            {aiResponse}
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button onClick={() => setAiResponse(null)} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">Retry Analysis</button>
                                            <button onClick={() => navigate(`/?search=${disease.specialist}`)} className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all">Book {disease.specialist}</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 text-center shrink-0"><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-loose">⚠️ This assessment is powered by DeepSeek-V3. It is not a formal medical diagnosis. <br/> Always prioritize professional consultation for medical concerns.</p></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiseaseDetails;
