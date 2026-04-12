import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Layout, Github, Linkedin } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

const Team = () => {
    useScrollReveal();

    const teamMembers = [
        {
            name: "Avinash Kumar",
            role: "Leader & Full Stack",
            image: "/Team/Avinash.jpeg",
            bio: "Driving vision and technical excellence.",
            links: { github: "#", linkedin: "#" }
        },
        {
            name: "Aryan",
            role: "Frontend & UI/UX",
            image: "/Team/Aryan.jpeg",
            bio: "Crafting modern user interfaces.",
            links: { github: "#", linkedin: "#" }
        },
        {
            name: "Ayush Sharma",
            role: "Backend & AI",
            image: "/Team/Ayush.jpeg",
            bio: "Optimizing logic and AI performance.",
            links: { github: "#", linkedin: "#" }
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-10 transition-colors duration-300 overflow-x-hidden">
            {/* Compact Hero Header */}
            <div className="bg-gradient-to-br from-blue-900/40 to-slate-950 pt-12 pb-20 px-4 relative overflow-hidden border-b border-slate-800/50">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600 rounded-full blur-[100px]"></div>
                </div>
                <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[9px] font-black uppercase tracking-widest mb-4">
                        <Users size={12} /> The Squad
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 leading-none text-white">CompileCrew</h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto font-medium">Engineering the future of digital healthcare.</p>
                </div>
            </div>

            <div className="w-11/12 max-w-6xl mx-auto -mt-12 space-y-12 relative z-20">
                
                {/* COMPACT TEAM MEMBERS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/50 rounded-[32px] overflow-hidden group hover:border-blue-500/50 transition-all duration-500 shadow-2xl">
                            <div className="h-64 sm:h-72 overflow-hidden relative bg-slate-800">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
                            </div>
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-0.5">{member.name}</h3>
                                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-3">{member.role}</p>
                                <div className="flex justify-center gap-3">
                                    <a href={member.links.github} className="p-2 bg-slate-800/50 rounded-lg hover:bg-blue-600 transition-colors text-white">
                                        <Github size={16} />
                                    </a>
                                    <a href={member.links.linkedin} className="p-2 bg-slate-800/50 rounded-lg hover:bg-blue-600 transition-colors text-white">
                                        <Linkedin size={16} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* SLIM PROJECT RESOURCES */}
                <div className="reveal">
                    <div className="bg-blue-600/90 rounded-[32px] p-6 md:p-10 relative overflow-hidden shadow-xl border border-white/10">
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-1">Documentation</h2>
                                <p className="text-blue-100 text-sm font-medium">Explore the architecture and mission.</p>
                            </div>
                            <div className="flex gap-3">
                                <a href="/Team/DocTalk_Report.pdf" target="_blank" className="flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg">
                                    <FileText size={16} /> Report
                                </a>
                                <a href="/Team/Poster.pdf" target="_blank" className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg">
                                    <Layout size={16} /> Poster
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Team;
