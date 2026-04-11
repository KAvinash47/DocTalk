import React, { useState } from 'react';
import { RiRegisteredLine } from "react-icons/ri";
import { useNavigate } from 'react-router';
import { Bot } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import DoctorChat from '../../DoctorChat';

const DoctorCard = ({ doctor }) => {
    const { id, name, specialization, qualification, experience, registration, workingDays, image } = doctor;
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = workingDays.includes(today);

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 md:p-8 relative overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl shadow-blue-100/20 dark:shadow-black/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group hover-target">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-[2.5] opacity-50"></div>
                
                {/* Doctor Image - Compact on Mobile */}
                <div className="flex justify-center mb-6 md:mb-8 h-[220px] md:h-[280px] w-full overflow-hidden rounded-2xl md:rounded-[32px] relative z-10">
                    <img src={image} alt={name} className="h-full w-full object-cover object-top group-hover:scale-110 transition duration-700" />
                    {isAvailableToday && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse shadow-lg">
                            Available
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="space-y-3 relative z-10">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                            {specialization}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-gray-800 dark:text-white transition group-hover:text-blue-600 tracking-tight leading-none">{name}</h3>
                        <p className="text-gray-500 dark:text-slate-400 font-bold text-[12px] md:text-sm leading-tight mt-1">{qualification}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4 md:mt-6">
                        <button 
                            onClick={() => navigate(`/doctor/${id}`)}
                            className="btn btn-block bg-blue-600 hover:bg-blue-700 text-white border-none rounded-xl md:rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none h-11 md:h-12 text-sm"
                        >
                            View Profile
                        </button>
                        
                        <button 
                            onClick={() => setIsChatOpen(true)}
                            className="btn btn-block bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border-none rounded-xl md:rounded-2xl font-black transition-all active:scale-95 h-11 md:h-12 flex gap-2 text-sm"
                        >
                            <Bot size={16} className="text-blue-600" />
                            AI Consult
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isChatOpen && (
                    <DoctorChat doctor={doctor} onClose={() => setIsChatOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default DoctorCard;
