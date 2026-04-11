import React from 'react';

const GlassCard = ({ children, className = "", hover = true }) => {
    return (
        <div className={`glass-surface ${className} ${hover ? 'hover:-translate-y-2 hover:shadow-2xl transition-all duration-500' : ''}`}>
            {children}
        </div>
    );
};

export default GlassCard;
