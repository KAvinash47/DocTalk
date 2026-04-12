import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Calculator, Droplets, Flame, Heart, 
    ShieldCheck, X, Activity, Zap, BrainCircuit
} from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

// Tool Components
import BMICalculator from '../Components/Tools/BMICalculator';
import WaterCalculator from '../Components/Tools/WaterCalculator';
import CalorieEstimator from '../Components/Tools/CalorieEstimator';
import HeartRateChecker from '../Components/Tools/HeartRateChecker';
import HealthScoreGenerator from '../Components/Tools/HealthScoreGenerator';

const HealthTools = () => {
    const [activeTool, setActiveTool] = useState(null);
    const scrollContainerRef = useRef(null);
    useScrollReveal();

    useEffect(() => {
        if (activeTool && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [activeTool]);

    const tools = [
        { id: 'bmi', name: 'BMI Calculator', icon: <Calculator />, color: 'bg-blue-500', desc: 'Body Mass Index assessment' },
        { id: 'water', name: 'Water Intake', icon: <Droplets />, color: 'bg-cyan-500', desc: 'Daily hydration estimator' },
        { id: 'calories', name: 'Calorie Needs', icon: <Flame />, color: 'bg-orange-500', desc: 'Daily metabolic estimator' },
        { id: 'heart', name: 'Pulse Analyzer', icon: <Heart />, color: 'bg-red-500', desc: 'Heart rate interpretation' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Hero Header */}
            <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white pt-24 pb-32 px-4 relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                </div>
                <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 dark:bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
                        <BrainCircuit size={14} /> Intelligence Tools
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none text-slate-900 dark:text-white">Health Analyzers</h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">Precision tools to calculate, track, and optimize your physical stability.</p>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto -mt-16 space-y-12 relative z-20">
                
                {/* 1. HEALTH SCORE SECTION (MAIN) */}
                <div className="reveal">
                    <div className="bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 shadow-2xl border border-transparent dark:border-slate-800">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">AI Health Score</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mt-1 uppercase tracking-widest">Global Wellness Assessment</p>
                            </div>
                            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                                Precision Algorithm v2.0
                            </div>
                        </div>
                        
                        <HealthScoreGenerator />
                    </div>
                </div>

                {/* 2. QUICK TOOLS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                    {tools.map((tool) => (
                        <div 
                            key={tool.id}
                            onClick={() => setActiveTool(tool.id)}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-xl border border-transparent dark:border-slate-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
                        >
                            <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-black/5`}>
                                {tool.icon}
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{tool.name}</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{tool.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOOL MODAL */}
            <AnimatePresence>
                {activeTool && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
                        >
                            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    {tools.find(t => t.id === activeTool).name}
                                </h3>
                                <button onClick={() => setActiveTool(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                            <div ref={scrollContainerRef} className="p-6 md:p-10 bg-slate-50 dark:bg-slate-950 overflow-y-auto custom-scrollbar">
                                {activeTool === 'bmi' && <BMICalculator />}
                                {activeTool === 'water' && <WaterCalculator />}
                                {activeTool === 'calories' && <CalorieEstimator />}
                                {activeTool === 'heart' && <HeartRateChecker />}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HealthTools;
