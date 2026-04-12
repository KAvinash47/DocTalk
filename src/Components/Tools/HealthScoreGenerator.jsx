import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Info } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const HealthScoreGenerator = () => {
    const [form, setForm] = useState({
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        activity: 'medium',
        sleep: '',
        water: '',
        smoking: 'no',
        alcohol: 'no'
    });

    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const calculateScore = async () => {
        setIsLoading(true);
        
        // Rule-based calculation (Score out of 100)
        let score = 70; // Base starting point
        
        // BMI Factor
        const bmi = form.weight / ((form.height / 100) ** 2);
        if (bmi >= 18.5 && bmi <= 25) score += 10;
        else score -= 10;

        // Sleep Factor
        if (form.sleep >= 7 && form.sleep <= 9) score += 10;
        else score -= 5;

        // Water Factor
        if (form.water >= 2.5) score += 5;

        // Life Choice Factors
        if (form.smoking === 'yes') score -= 20;
        if (form.alcohol === 'yes') score -= 5;

        // Activity Factor
        if (form.activity === 'high') score += 10;
        if (form.activity === 'low') score -= 5;

        const finalScore = Math.max(0, Math.min(100, score));

        // Generate Tips
        const tips = [];
        if (bmi > 25) tips.push("Focus on weight management and calorie deficit.");
        if (form.sleep < 7) tips.push("Increase sleep duration to 7-9 hours for recovery.");
        if (form.water < 2.5) tips.push("Drink more water (aim for 2.5L+ per day).");
        if (form.smoking === 'yes') tips.push("Consider quitting smoking to improve lung capacity.");
        if (form.activity === 'low') tips.push("Start with 20 min daily walking to boost metabolism.");

        // Optional AI advice
        let aiAdvice = "";
        try {
            const res = await fetch(`${API_BASE_URL}/api/ai-chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: `Generate a short health advice for a ${form.age} year old ${form.gender} with weight ${form.weight}kg, height ${form.height}cm, ${form.sleep}h sleep, activity level ${form.activity}, smoking: ${form.smoking}, alcohol: ${form.alcohol}. Health Score: ${finalScore}/100.` 
                })
            });
            const data = await res.json();
            aiAdvice = data.reply;
        } catch (e) {
            aiAdvice = "Maintain a balanced lifestyle and regular checkups.";
        }

        setResult({ score: finalScore, tips, aiAdvice });
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            {!result ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Age</label>
                        <input type="number" onChange={(e) => setForm({...form, age: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold" placeholder="e.g. 25" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</label>
                        <select onChange={(e) => setForm({...form, gender: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Weight (kg)</label>
                        <input type="number" onChange={(e) => setForm({...form, weight: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold" placeholder="kg" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Height (cm)</label>
                        <input type="number" onChange={(e) => setForm({...form, height: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold" placeholder="cm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Sleep (hours)</label>
                        <input type="number" onChange={(e) => setForm({...form, sleep: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold" placeholder="e.g. 8" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Water (liters)</label>
                        <input type="number" onChange={(e) => setForm({...form, water: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold" placeholder="e.g. 2.5" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Smoking</label>
                        <select onChange={(e) => setForm({...form, smoking: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold">
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Activity</label>
                        <select onChange={(e) => setForm({...form, activity: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none dark:text-white font-bold">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button 
                            onClick={calculateScore} 
                            disabled={isLoading}
                            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {isLoading ? <span className="loading loading-spinner"></span> : <><ShieldCheck size={20} /> Generate Health Score</>}
                        </button>
                    </div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                    <div className="text-center p-10 bg-white dark:bg-slate-900 rounded-[48px] shadow-2xl border border-blue-50 dark:border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Your Intelligence Health Score</p>
                        <div className="relative inline-block mb-6">
                            <svg className="w-48 h-48 transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.92} strokeDashoffset={552.92 - (552.92 * result.score) / 100} className="text-blue-600 transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <h2 className="text-6xl font-black text-slate-900 dark:text-white">{result.score}</h2>
                                <p className="text-[10px] font-black uppercase text-blue-500">Stability</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 italic font-medium text-slate-600 dark:text-slate-300">
                            "{result.aiAdvice}"
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-transparent dark:border-slate-800">
                            <h4 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white uppercase mb-6"><Activity className="text-blue-500" /> Improvement Plan</h4>
                            <ul className="space-y-4">
                                {result.tips.map((tip, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-400 font-bold text-sm">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <ShieldCheck className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-110 transition-transform duration-700" size={150} />
                            <h4 className="text-2xl font-black uppercase mb-4 tracking-tighter">Verified Analysis</h4>
                            <p className="text-blue-100 font-medium text-sm leading-relaxed mb-8">This score is calculated based on clinical parameters. Use our Health Guide to explore specific conditions.</p>
                            <button onClick={() => setResult(null)} className="px-8 py-3 bg-white text-blue-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Re-Analyze</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default HealthScoreGenerator;
