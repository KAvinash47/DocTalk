import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

const WaterCalculator = () => {
    const [weight, setWeight] = useState('');
    const [result, setResult] = useState(null);

    const calculateWater = () => {
        if (!weight) return;
        // Basic formula: weight (kg) * 0.033 = liters per day
        const waterLitres = (weight * 0.033).toFixed(1);
        setResult(waterLitres);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Your Weight (kg)</label>
                <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white"
                    placeholder="e.g. 70"
                />
            </div>
            <button 
                onClick={calculateWater}
                className="w-full py-4 bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
                <Droplets size={18} /> Calculate Intake
            </button>

            {result && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-[32px] text-white text-center shadow-xl shadow-blue-500/30"
                >
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Recommended Daily Intake</p>
                    <h3 className="text-5xl font-black mb-1">{result} L</h3>
                    <p className="text-sm font-bold opacity-90">≈ {Math.round(result * 4)} Large Glasses</p>
                </motion.div>
            )}
        </div>
    );
};

export default WaterCalculator;
