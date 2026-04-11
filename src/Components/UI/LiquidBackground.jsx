import React from 'react';

const LiquidBackground = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">
            <div className="bg-blob w-[500px] h-[500px] bg-blue-500/20 top-[-10%] left-[-10%]"></div>
            <div className="bg-blob w-[600px] h-[600px] bg-purple-500/20 bottom-[-10%] right-[-10%]" style={{ animationDelay: '-5s' }}></div>
            <div className="bg-blob w-[400px] h-[400px] bg-cyan-500/20 top-[30%] left-[40%]" style={{ animationDelay: '-10s' }}></div>
        </div>
    );
};

export default LiquidBackground;
