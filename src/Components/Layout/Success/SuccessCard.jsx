import React from 'react';
import CountUp from 'react-countup';

const SuccessCard = ({ item }) => {
    return (
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-[32px] p-6 md:p-10 text-center transition-all duration-500 hover:bg-white/10 hover:border-blue-500/30 hover:-translate-y-2 hover-target group">
            <div className="text-3xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 inline-block">
                {item.id === 1 ? '🏥' : item.id === 2 ? '👨‍⚕️' : item.id === 3 ? '✅' : '🌟'}
            </div>
            <div className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 tracking-tighter">
                <CountUp end={parseInt(item.count)} duration={3} enableScrollSpy />
                {item.count.toString().includes('+') ? '+' : ''}
            </div>
            <p className="text-blue-400 font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em]">
                {item.title}
            </p>
        </div>
    );
};

export default SuccessCard;
