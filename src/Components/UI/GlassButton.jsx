import React from 'react';

const GlassButton = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) => {
    const baseStyles = "relative px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105",
        secondary: "glass-surface text-slate-900 dark:text-white hover:bg-white/20 hover:scale-105",
        outline: "border-2 border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white",
        icon: "p-3 rounded-full glass-surface flex items-center justify-center hover:scale-110 active:scale-90"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-500 group-hover:left-full"></div>
        </button>
    );
};

export default GlassButton;
