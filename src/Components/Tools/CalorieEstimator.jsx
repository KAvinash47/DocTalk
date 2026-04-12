import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CalorieEstimator = () => {
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState('1.2'); // BMR multipliers
    const [result, setResult] = useState(null);

    const calculateCalories = () => {
        if (!age || !weight || !height) return;
        
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        const total = Math.round(bmr * parseFloat(activity));
        setResult(total);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Age</label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" placeholder="Age" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none font-bold dark:text-white">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" placeholder="kg" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Height (cm)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold dark:text-white" placeholder="cm" />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Activity Level</label>
                <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl focus:outline-none font-bold dark:text-white text-sm">
                    <option value="1.2">Sedentary (Little/No Exercise)</option>
                    <option value="1.375">Lightly Active (1-3 days/week)</option>
                    <option value="1.55">Moderately Active (3-5 days/week)</option>
                    <option value="1.725">Very Active (6-7 days/week)</option>
                </select>
            </div>
            <button onClick={calculateCalories} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all">Estimate Calories</button>

            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white dark:bg-slate-900 rounded-[32px] text-center border-2 border-orange-50 dark:border-slate-800 shadow-inner">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Maintain Weight Calories</p>
                    <h3 className="text-5xl font-black text-orange-500 my-2">{result} <span className="text-xl">kcal/day</span></h3>
                </motion.div>
            )}
        </div>
    );
};

export default CalorieEstimator;
