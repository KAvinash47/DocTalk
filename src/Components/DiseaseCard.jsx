import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router';

const DiseaseCard = ({ disease }) => {
    const { id, name, description, icon, category, specialist, stats } = disease;
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 relative overflow-hidden border border-gray-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-[2.5] opacity-50"></div>
            
            {/* Icon Section */}
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-[24px] flex items-center justify-center text-4xl mb-8 relative z-10 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                {icon}
            </div>

            {/* Info */}
            <div className="relative z-10 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                        {category}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                        stats.severity === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                        {stats.severity} Severity
                    </span>
                </div>

                <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">{name}</h3>
                    <p className="text-gray-500 dark:text-slate-400 font-medium text-sm leading-relaxed line-clamp-2">{description}</p>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                        <Activity size={14} className="text-blue-500" />
                        Prev: {stats.prevalence}%
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-tight">
                        {specialist}
                    </p>
                </div>

                <button 
                    onClick={() => navigate(`/disease/${id}`)}
                    className="btn btn-block bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white border-none rounded-2xl h-14 font-black transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3 group/btn"
                >
                    View Guide
                    <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default DiseaseCard;
