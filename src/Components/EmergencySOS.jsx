import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, Navigation, MapPin, X, LifeBuoy } from 'lucide-react';

const EmergencySOS = () => {
    const [location, setLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getEmergencyHelp = () => {
        setIsOpen(true);
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                
                // For a real app, we'd use Google Places API. 
                // For the project fest, we'll simulate finding 3 nearest hospitals based on location.
                setTimeout(() => {
                    setHospitals([
                        { name: "City General Hospital", distance: "0.8 km", phone: "102", address: "Central District, Jaipur" },
                        { name: "Apex Trauma Center", distance: "1.2 km", phone: "0141-223344", address: "Sitapura, Jaipur" },
                        { name: "Poornima Health Clinic", distance: "2.5 km", phone: "7976739844", address: "Ramchandrapura, Jaipur" }
                    ]);
                    setLoading(false);
                }, 1500);
            }, () => {
                setLoading(false);
                alert("Please enable location services for emergency assistance.");
            });
        }
    };

    return (
        <>
            {/* Floating SOS Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={getEmergencyHelp}
                className="fixed bottom-28 right-6 z-[9999] w-16 h-16 bg-red-600 text-white rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center justify-center border-4 border-white animate-bounce"
            >
                <AlertTriangle size={30} fill="currentColor" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                            className="bg-slate-900 border border-red-500/30 w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl shadow-red-500/20"
                        >
                            <div className="p-8 bg-red-600 text-white flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <LifeBuoy className="animate-spin" />
                                    <h2 className="text-2xl font-black uppercase tracking-tighter">Emergency SOS</h2>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                            </div>

                            <div className="p-8">
                                {loading ? (
                                    <div className="text-center py-10">
                                        <div className="loading loading-ring loading-lg text-red-500"></div>
                                        <p className="text-red-400 font-bold mt-4 animate-pulse">LOCATING NEAREST HELP...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4">
                                            <MapPin className="text-red-500" />
                                            <div>
                                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Current Status</p>
                                                <p className="text-white font-bold text-sm">Location Tracked. Notifying nearest units.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Nearby Emergency Centers</h3>
                                            {hospitals.map((h, i) => (
                                                <div key={i} className="bg-slate-800 p-5 rounded-3xl flex justify-between items-center group hover:bg-slate-750 transition-all border border-transparent hover:border-red-500/30">
                                                    <div>
                                                        <h4 className="text-white font-black text-lg">{h.name}</h4>
                                                        <p className="text-slate-400 text-xs font-medium">{h.address} • <span className="text-red-400">{h.distance}</span></p>
                                                    </div>
                                                    <a href={`tel:${h.phone}`} className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                        <Phone size={20} fill="currentColor" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>

                                        <button className="w-full py-5 bg-white text-red-600 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-3">
                                            <Navigation size={18} /> Direct Ambulance (102)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EmergencySOS;
