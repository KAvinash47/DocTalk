import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BMICalculator = () => {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [status, setStatus] = useState('');

    const calculateBMI = () => {
        if (!weight || !height) return;
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setBmi(bmiValue);

        if (bmiValue < 18.5) setStatus('Underweight');
        else if (bmiValue < 25) setStatus('Normal weight');
        else if (bmiValue < 30) setStatus('Overweight');
        else setStatus('Obese');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Weight (kg)</label>
                    <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white"
                        placeholder="e.g. 70"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Height (cm)</label>
                    <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white"
                        placeholder="e.g. 175"
                    />
                </div>
            </div>
            <button 
                onClick={calculateBMI}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
                Calculate BMI
            </button>

            {bmi && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-[32px] text-center border-2 border-blue-50 dark:border-slate-800 shadow-inner"
                >
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Your BMI Score</p>
                    <h3 className="text-5xl font-black text-blue-600 dark:text-blue-400 my-2">{bmi}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        status === 'Normal weight' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                        {status}
                    </span>
                </motion.div>
            )}
        </div>
    );
};

export default BMICalculator;
