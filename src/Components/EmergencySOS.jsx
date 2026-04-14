import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Navigation, MapPin, X, LifeBuoy, Ban } from 'lucide-react';

const EmergencySOS = ({ isOpen, setIsOpen }) => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getEmergencyHelp();
        } else {
            setLoading(false);
            setHospitals([]);
        }
    }, [isOpen]);

    const getEmergencyHelp = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                // Simulation of finding help
                setTimeout(() => {
                    setHospitals([
                        { name: "City General Hospital", distance: "0.8 km", phone: "102", address: "Central District, Jaipur" },
                        { name: "Apex Trauma Center", distance: "1.2 km", phone: "0141-223344", address: "Sitapura, Jaipur" },
                        { name: "Poornima Health Clinic", distance: "2.5 km", phone: "7976739844", address: "Ramchandrapura, Jaipur" }
                    ]);
                    setLoading(false);
                }, 2000);
            }, () => {
                setLoading(false);
                alert("Please enable location services for emergency assistance.");
                setIsOpen(false);
            });
        }
    };

    const handleStopSearch = () => {
        setLoading(false);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} 
                        animate={{ scale: 1, y: 0 }}
                        className="bg-slate-900 border border-red-500/30 w-full max-w-lg rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)] flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-6 sm:p-8 bg-red-600 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <LifeBuoy className={loading ? "animate-spin" : ""} />
                                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">Emergency SOS</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 bg-slate-900">
                            {loading ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="relative mb-8">
                                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="loading loading-ring loading-lg text-red-500 scale-150 relative z-10"></div>
                                    </div>
                                    <p className="text-red-400 font-black mt-4 animate-pulse uppercase tracking-[0.2em] text-xs">Tracing Nearest Medical Units...</p>
                                    <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Do not close this window</p>
                                    
                                    <button 
                                        onClick={handleStopSearch}
                                        className="mt-10 flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600/20 hover:text-red-500 transition-all border border-slate-700"
                                    >
                                        <Ban size={14} /> Stop Search
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shrink-0">
                                            <MapPin size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-1">Satellite Lock</p>
                                            <p className="text-white font-bold text-sm">Location Verified. Dispatch Ready.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-2">Available Trauma Centers</h3>
                                        {hospitals.map((h, i) => (
                                            <div key={i} className="bg-slate-800/50 p-5 rounded-3xl flex justify-between items-center group hover:bg-slate-800 transition-all border border-transparent hover:border-red-500/30 shadow-xl">
                                                <div className="flex-1 pr-4">
                                                    <h4 className="text-white font-black text-base sm:text-lg tracking-tight">{h.name}</h4>
                                                    <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                                                        {h.distance} <span className="w-1 h-1 bg-slate-600 rounded-full"></span> {h.address}
                                                    </p>
                                                </div>
                                                <a href={`tel:${h.phone}`} className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform active:scale-95">
                                                    <Phone size={20} fill="currentColor" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <button className="w-full py-5 bg-white text-red-600 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                                            <Navigation size={18} /> Request Ambulance (102)
                                        </button>
                                        <button onClick={() => setIsOpen(false)} className="w-full py-4 bg-slate-800 text-slate-400 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-700 transition-all">
                                            Dismiss Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EmergencySOS;
