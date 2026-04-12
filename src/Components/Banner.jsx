import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const Banner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="pb-4 px-4 sm:px-0 animate-fade-up">
            <div className="w-full sm:w-11/12 mx-auto border-2 border-white dark:border-slate-800 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 md:p-16 bg-white dark:bg-slate-900 shadow-xl shadow-blue-100/20 dark:shadow-black/50 transition-colors">
                <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-12">
                    {/* Mobile-only badge */}
                    <span className="md:hidden inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        24/7 Virtual Care
                    </span>
                    
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 text-slate-900 dark:text-white leading-tight">
                        Dependable Care, <br className="md:hidden" /> 
                        <span className="text-blue-600 dark:text-blue-400">Trusted</span> Professionals.
                    </h1>
                    
                    <p className="text-gray-500 dark:text-slate-400 text-sm sm:text-lg mb-6 sm:mb-8 font-medium leading-relaxed max-w-lg mx-auto">
                        Connect with verified, experienced doctors across various specialties — all at your convenience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="Search specialty..." 
                            className="w-full sm:flex-1 px-6 py-3.5 rounded-2xl sm:rounded-full border border-gray-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white font-bold text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            onClick={handleSearch}
                            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-2xl sm:rounded-full font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Images - Hidden on very small screens, responsive on medium */}
                <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 mt-8 md:mt-10 overflow-hidden">
                    <img src="https://i.postimg.cc/xTdKtT2j/banner-img-1.png" alt="Doctor" className="w-full md:w-[400px] h-[200px] sm:h-[300px] md:h-auto rounded-2xl shadow-lg object-cover" />
                    <img src="https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400" alt="Medical Professional" className="hidden sm:block w-full md:w-[400px] h-[250px] sm:h-[300px] md:h-auto rounded-2xl shadow-lg object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Banner;
