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
            <div className="w-full sm:w-11/12 mx-auto border-2 border-white dark:border-slate-800 rounded-2xl sm:rounded-[40px] p-6 sm:p-8 md:p-16 bg-white dark:bg-slate-900 shadow-xl shadow-blue-100/20 dark:shadow-black/50 transition-colors">
                <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-slate-900 dark:text-white">Dependable Care, Backed by Trusted Professionals.</h1>
                    <p className="text-gray-600 dark:text-slate-400 text-base sm:text-lg mb-6 sm:mb-8 font-medium">Our platform connects you with verified, experienced doctors across various specialties — all at your convenience. Whether it's a routine checkup or urgent consultation, book appointments in minutes and receive quality care you can trust.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="Search any doctor..." 
                            className="w-full sm:flex-1 px-4 sm:px-6 py-3 rounded-full border border-gray-300 dark:border-slate-700 bg-transparent focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white mb-3 sm:mb-0 font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button 
                            onClick={handleSearch}
                            className="w-full sm:w-auto px-6 sm:px-10 py-3 bg-blue-600 text-white rounded-full cursor-pointer font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
                        >
                            Search Now
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 mt-10">
                    <img src="https://i.postimg.cc/xTdKtT2j/banner-img-1.png" alt="Doctor" className="w-full md:w-[400px] h-[250px] sm:h-[300px] md:h-auto rounded-2xl shadow-lg object-cover" />
                    <img src="https://i.postimg.cc/vHrsShYz/istockphoto-1342134434-1024x1024.jpg" alt="Medical Professional" className="hidden md:block w-full md:w-[400px] h-[250px] sm:h-[300px] md:h-auto rounded-2xl shadow-lg object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Banner;
