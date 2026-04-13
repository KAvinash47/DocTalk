import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Activity, Salad, Dumbbell, AlertTriangle, 
    ShieldCheck, Stethoscope, Bot, X, Send, 
    Microscope, TrendingUp, Users, Info, BookOpen, HeartPulse,
    Pill, Leaf, ShieldAlert
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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

    useDocumentTitle(disease ? `${disease.name} Intelligence` : 'Clinical Guide');

    useEffect(() => {
        const fetchDiseaseData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/diseases/${id}`);
                if (!res.ok) throw new Error("API failed");
                const data = await res.json();
                setDisease(data);
            } catch (err) {
                try {
                    const localRes = await fetch('/Data/diseases.json');
                    const localData = await localRes.json();
                    const matched = localData.find(d => String(d.id) === String(id));
                    if (matched) setDisease(matched);
                } catch (localErr) {
                    console.error("Critical: Could not load data.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDiseaseData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><span className="loading loading-spinner loading-lg text-blue-600"></span></div>;
    if (!disease) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6"><h2 className="text-2xl font-black uppercase mb-4 tracking-widest">Entry Not Found</h2><button onClick={() => navigate('/health-guide')} className="btn btn-primary px-10 rounded-full">Explore Encyclopedia</button></div>;

    const statsData = [
        { name: 'Recovery', value: parseInt(disease.stats?.recoveryRate || 85), color: '#10b981' },
        { name: 'Risk', value: 100 - parseInt(disease.stats?.recoveryRate || 85), color: '#ef4444' }
    ];

    const prevalenceValue = parseFloat(disease.stats?.prevalence || 5);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Hero Section */}
            <div className="bg-slate-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
                </div>
                
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <button onClick={() => navigate('/health-guide')} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group shrink-0 border border-white/10 shadow-2xl">
                        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                            <span className="text-7xl drop-shadow-2xl">{disease.icon || '🩺'}</span>
                            <div className="text-left">
                                <span className="px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] block w-fit mb-2">
                                    {disease.category} Specialty
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">{disease.name}</h1>
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed italic">
                            "{disease.description}"
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto -mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
                
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Clinical Pharmacology (Medications) */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-transparent dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl text-emerald-600">
                                <Pill size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Clinical Pharmacology</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(disease.medications || ["Consult Physician for Prescription"]).map((med, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl font-bold text-slate-700 dark:text-slate-300">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    {med}
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed italic">
                            * Note: Medications listed are for informational purposes. Never self-medicate.
                        </p>
                    </div>

                    {/* Holistic Remedies */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-transparent dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-teal-500"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-2xl text-teal-600">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Holistic Recovery & Home Remedies</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(disease.homeRemedies || ["Adequate rest and hydration"]).map((rem, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 bg-teal-50/30 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl font-bold text-slate-700 dark:text-slate-300">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    {rem}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pathophysiology */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-transparent dark:border-slate-800 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                                <Microscope size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Clinical Pathophysiology</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                            {disease.science}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-transparent dark:border-slate-800 text-center relative group">
                            <div className="absolute top-0 right-0 p-6 text-slate-100 dark:text-slate-800 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={80} /></div>
                            <div className="flex items-center justify-center gap-2 mb-8 text-slate-400 font-black uppercase text-[10px] tracking-widest">Recovery Probability</div>
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={statsData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value">
                                            {statsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-6 text-4xl font-black text-slate-900 dark:text-white">{disease.stats.recoveryRate}%</div>
                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Average Prognosis</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-transparent dark:border-slate-800 text-center relative group">
                            <div className="absolute top-0 right-0 p-6 text-slate-100 dark:text-slate-800 opacity-10 group-hover:opacity-20 transition-opacity"><Users size={80} /></div>
                            <div className="flex items-center justify-center gap-2 mb-8 text-slate-400 font-black uppercase text-[10px] tracking-widest">Global Impact Index</div>
                            <div className="h-40 flex items-end justify-center gap-6 px-10 pt-4">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-3xl relative h-full overflow-hidden">
                                    <motion.div initial={{ height: 0 }} animate={{ height: `${Math.min(prevalenceValue * 8, 100)}%` }} transition={{ duration: 2, ease: "circOut" }} className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-2xl shadow-[0_-10px_20px_rgba(59,130,246,0.3)]"></motion.div>
                                </div>
                            </div>
                            <div className="mt-8 text-4xl font-black text-slate-900 dark:text-white">{prevalenceValue}%</div>
                            <p className="text-xs text-slate-500 font-bold uppercase mt-1">Population Prevalence</p>
                        </div>
                    </div>

                    {/* Lifestyle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-[40px] p-10 border border-orange-100 dark:border-orange-900/30 group">
                            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-500 mb-8 group-hover:scale-110 transition-transform"><Salad size={32} /></div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Dietary Protocol</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">{disease.diet}</p>
                        </div>
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 rounded-[40px] p-10 border border-purple-100 dark:border-purple-900/30 group">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform"><Dumbbell size={32} /></div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Kinetic Management</h4>
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">{disease.exercises}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Severity */}
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-xl border-t-8 border-t-red-500">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Assessment</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${disease.stats?.severity === 'High' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{disease.stats?.severity || 'Moderate'}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: disease.stats?.severity === 'High' ? '85%' : '45%' }} transition={{ duration: 1, delay: 0.5 }} className={`h-full ${disease.stats?.severity === 'High' ? 'bg-red-500' : 'bg-green-500'}`}></motion.div>
                        </div>
                        <p className="mt-4 text-xs text-slate-500 font-medium italic">Estimated based on common clinical data.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <Bot className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={150} />
                        <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter leading-none">Diagnostic <br/> Simulation</h3>
                        <p className="text-blue-100 text-sm font-medium mb-10 leading-relaxed">Consult PulseTalk for an intelligent comparison of your symptoms.</p>
                        <button onClick={() => setIsCheckerOpen(true)} className="w-full py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">Initiate AI Check</button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-xl border border-transparent dark:border-slate-800 text-center">
                        <Stethoscope className="text-blue-600 mb-6 mx-auto" size={56} />
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Expert Referral</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-10 leading-relaxed">Our database recommends a prioritized consultation with a verified <b>{disease.specialist}</b>.</p>
                        <button onClick={() => navigate(`/?search=${disease.specialist}`)} className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all shadow-xl">Secure Priority Slot</button>
                    </div>

                    {/* Expanded Precautions */}
                    <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[40px] p-10">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldAlert className="text-red-500" size={28} />
                            <h4 className="text-xl font-black text-red-600 dark:text-red-500 uppercase tracking-tighter">Vital Precautions</h4>
                        </div>
                        <div className="space-y-4">
                            {(disease.precautions || "Consult a doctor.").split('. ').map((item, i) => item && (
                                <div key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm font-bold leading-relaxed">
                                    <span className="text-red-500">•</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Modal Integration */}
            <AnimatePresence>
                {isCheckerOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] overflow-hidden flex flex-col h-[700px] shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                            <div className="p-8 bg-blue-600 text-white flex justify-between items-center shrink-0 shadow-lg">
                                <div className="flex items-center gap-4"><Bot size={32}/><div className="leading-none"><h3 className="font-black text-xl uppercase tracking-tighter">AI Diagnostic Engine</h3><p className="text-[10px] font-bold uppercase opacity-70 tracking-[0.2em] mt-1">Cross-referencing: {disease.name}</p></div></div>
                                <button onClick={() => setIsCheckerOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={32} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
                                {!aiResponse ? (
                                    <div className="space-y-8 text-center py-10 animate-fade-up">
                                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner animate-pulse"><Activity className="text-blue-600" size={48} /></div>
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Symptom Detail Entry</h4>
                                        <textarea value={userSymptoms} onChange={(e) => setUserSymptoms(e.target.value)} placeholder="Please provide specific symptoms, duration, and intensity..." className="w-full h-56 p-8 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] focus:outline-none focus:border-blue-500 font-bold text-slate-700 dark:text-white shadow-2xl transition-all text-lg" />
                                        <button onClick={() => { setIsChecking(true); fetch(`${API_BASE_URL}/api/ai-check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ symptoms: userSymptoms, diseaseName: disease.name }) }).then(r => r.json()).then(d => { setAiResponse(d.reply); setIsChecking(false); }).catch(() => { setAiResponse("Service offline."); setIsChecking(false); }); }} disabled={isChecking || !userSymptoms.trim()} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:scale-105 disabled:opacity-50 transition-all shadow-2xl shadow-blue-500/20">{isChecking ? "Analyzing Clinical Data..." : "Run AI Assessment"}</button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 animate-fade-up">
                                        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-10 border border-slate-100 dark:border-slate-800 shadow-2xl whitespace-pre-line font-medium text-slate-700 dark:text-slate-300 leading-relaxed border-l-[12px] border-l-blue-600 text-lg">
                                            <div className="flex items-center gap-3 mb-8"><ShieldCheck className="text-green-500" size={32} /><h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tighter text-2xl">AI Assessment Result</h4></div>
                                            {aiResponse}
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button onClick={() => setAiResponse(null)} className="flex-1 py-6 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">New Analysis</button>
                                            <button onClick={() => navigate(`/?search=${disease.specialist}`)} className="flex-1 py-6 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-[1.02] transition-all">Book Specialist</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 text-center shrink-0"><p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] leading-loose italic">Precision Medical Intelligence Engine • Not a replacement for a Physician</p></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DiseaseDetails;
