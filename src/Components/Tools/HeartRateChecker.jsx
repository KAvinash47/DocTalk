import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const HeartRateChecker = () => {
    const [bpm, setBpm] = useState('');
    const [status, setStatus] = useState(null);

    const checkHeartRate = () => {
        if (!bpm) return;
        const value = parseInt(bpm);
        
        if (value < 60) setStatus({ text: 'Bradycardia (Slow)', color: 'text-blue-500' });
        else if (value <= 100) setStatus({ text: 'Normal Resting', color: 'text-green-500' });
        else setStatus({ text: 'Tachycardia (Fast)', color: 'text-red-500' });
    };

    return (
        <div className="space-y-6 text-center">
            <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-[32px] border border-red-100 dark:border-red-900/30">
                <Heart className="mx-auto text-red-500 animate-pulse mb-4" size={40} />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                    Measure your pulse for 60 seconds and enter the beats per minute below.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Beats Per Minute (BPM)</label>
                <input 
                    type="number" 
                    value={bpm} 
                    onChange={(e) => setBpm(e.target.value)}
                    className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-red-400 font-black text-center text-2xl dark:text-white"
                    placeholder="72"
                />
            </div>

            <button 
                onClick={checkHeartRate}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
            >
                Analyze Pulse
            </button>

            {status && (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="p-6">
                    <h4 className={`text-2xl font-black ${status.color} uppercase tracking-tighter`}>{status.text}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">At Resting State</p>
                </motion.div>
            )}
        </div>
    );
};

export default HeartRateChecker;
