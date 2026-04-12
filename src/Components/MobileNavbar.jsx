import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, UserRound, Calendar, BookOpen, Bot } from 'lucide-react';

const MobileNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('/');

    useEffect(() => {
        setActiveTab(location.pathname);
    }, [location]);

    const navItems = [
        { id: 1, label: 'Home', icon: <Home size={20} />, path: '/' },
        { id: 2, label: 'Doctors', icon: <UserRound size={20} />, path: '/#doctors' },
        { id: 3, label: 'AI Bot', icon: <Bot size={20} />, path: '/ai-chat' },
        { id: 4, label: 'Bookings', icon: <Calendar size={20} />, path: '/my-bookings' },
        { id: 5, label: 'Blogs', icon: <BookOpen size={20} />, path: '/blogs' },
    ];

    const handleNavigation = (path) => {
        if (path === '/#doctors') {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById('doctors-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            navigate(path);
        }
    };

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[9999]">
            <div className="relative overflow-hidden rounded-3xl bg-black/20 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-2 py-3 flex justify-around items-center">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20"></div>
                {navItems.map((item) => {
                    const isActive = activeTab === item.path;
                    return (
                        <button key={item.id} onClick={() => handleNavigation(item.path)}
                            className={`relative flex flex-col items-center gap-1 transition-all duration-300 active:scale-90 ${isActive ? 'text-white' : 'text-white/50'}`}>
                            {isActive && <><div className="absolute -top-3 w-8 h-8 bg-blue-500/40 rounded-full blur-xl animate-pulse"></div><div className="absolute -bottom-3 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_#fff]"></div></>}
                            <div className={`transition-transform duration-300 ${isActive ? '-translate-y-1 scale-110' : ''}`}>{item.icon}</div>
                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileNavbar;
