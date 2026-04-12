import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Layout, Github, Linkedin, ExternalLink } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

const Team = () => {
    useScrollReveal();

    const teamMembers = [
        {
            name: "Avinash Kumar",
            role: "Team Leader & Full Stack Developer",
            image: "/Team/Avinash.jpeg",
            bio: "Driving the vision of DocTalk with precision and technical excellence.",
            links: { github: "#", linkedin: "#" }
        },
        {
            name: "Aryan",
            role: "Frontend Developer & UI/UX Designer",
            image: "/Team/Aryan.jpeg",
            bio: "Crafting seamless user experiences and modern interfaces for DocTalk.",
            links: { github: "#", linkedin: "#" }
        },
        {
            name: "Ayush Sharma",
            role: "Backend Specialist & AI Integration",
            image: "/Team/Ayush.jpeg", bio: "Ensuring robust server logic and smooth AI assistant performance.",
            links: { github: "#", linkedin: "#" }
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20 transition-colors duration-300">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-950 pt-24 pb-32 px-4 relative overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
                </div>
                <div className="max-w-6xl mx-auto relative z-10 text-center animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 uppercase">
                        <Users size={14} /> Meet the Squad
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4 leading-none text-white">CompileCrew</h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">The collective force behind DocTalk — engineering the future of digital healthcare.</p>
                </div>
            </div>

            <div className="w-11/12 max-w-7xl mx-auto -mt-16 space-y-24 relative z-20">
                
                {/* 1. TEAM MEMBERS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[40px] overflow-hidden group hover:border-blue-500/50 transition-all duration-500">
                            <div className="h-[450px] overflow-hidden relative bg-slate-800">
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-40"></div>
                            </div>
                            <div className="p-8 text-center">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{member.name}</h3>
                                <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-4">{member.role}</p>
                                <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-4">
                                    <a href={member.links.github} className="p-3 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors text-white">
                                        <Github size={18} />
                                    </a>
                                    <a href={member.links.linkedin} className="p-3 bg-slate-800 rounded-xl hover:bg-blue-600 transition-colors text-white">
                                        <Linkedin size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. PROJECT RESOURCES */}
                <div className="reveal">
                    <div className="bg-blue-600 rounded-[48px] p-8 md:p-16 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="max-w-xl text-center md:text-left">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">Project Documentation</h2>
                                <p className="text-blue-100 text-lg font-medium leading-relaxed">
                                    Explore the full technical report and visual poster representing the DocTalk architecture and mission.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <a 
                                    href="/Team/DocTalk_Report.pdf" 
                                    target="_blank"
                                    className="flex items-center justify-center gap-3 px-8 py-5 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                    <FileText size={20} /> View Report
                                </a>
                                <a 
                                    href="/Team/Poster.pdf" 
                                    target="_blank"
                                    className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                                >
                                    <Layout size={20} /> Project Poster
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. COMPILECREW MISSION */}
                <div className="text-center max-w-3xl mx-auto reveal py-12">
                    <div className="w-20 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">CompileCrew Manifesto</h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed italic">
                        "We believe in the power of collaborative code. Our team focuses on building efficient, human-centric solutions like DocTalk."
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Team;
