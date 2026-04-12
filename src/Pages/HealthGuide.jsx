import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Lightbulb, ArrowRight, HeartPulse } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { API_BASE_URL } from '../api/config';

const HealthGuide = () => {
    const navigate = useNavigate();
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [healthTip, setHealthTip] = useState('');

    useScrollReveal();

    const tips = [
        "Drink at least 8 glasses of water daily to stay hydrated.",
        "A 30-minute walk every day can significantly improve heart health.",
        "Prioritize 7-9 hours of sleep for better mental clarity.",
        "Eat more leafy greens to boost your immune system.",
        "Take a break from screens every 20 minutes to reduce eye strain."
    ];

    useEffect(() => {
        setHealthTip(tips[Math.floor(Math.random() * tips.length)]);
        
        fetch(`${API_BASE_URL}/api/diseases`)
            .then(res => res.json())
            .then(data => {
                setDiseases(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching diseases:", err);
                setLoading(false);
            });
    }, []);

    const filteredDiseases = diseases.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             d.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = category === 'All' || d.category === category;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', ...new Set(diseases.map(d => d.category))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 py-20 text-white text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative z-10 animate-fade-up">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase">AI Health Guide</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px] md:text-xs leading-loose">
                        Your intelligent companion for medical knowledge and symptom awareness
                    </p>
                </div>
            </div>

            <div className="w-11/12 max-w-7xl mx-auto -mt-10 relative z-20">
                {/* Health Tip Card */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[32px] p-6 md:p-8 border border-white dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-6 mb-12 animate-fade-up">
                    <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-200 shrink-0 animate-bounce">
                        <Lightbulb size={32} className="text-white" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">Health Tip of the Day</h4>
                        <p className="text-slate-700 dark:text-slate-200 font-bold text-lg md:text-xl italic">"{healthTip}"</p>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-12 reveal">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search by disease name or symptom..." 
                            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900 border border-transparent focus:border-blue-500 rounded-2xl shadow-xl transition-all font-bold text-slate-700 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-xl border border-transparent">
                        <Filter className="ml-3 text-slate-400" size={20} />
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Disease Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDiseases.map((disease, index) => (
                        <div key={disease.id} className="reveal" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-gray-100 dark:border-slate-800 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
                                
                                <div className="relative z-10">
                                    <div className="text-5xl mb-6">{disease.icon}</div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">{disease.name}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                                        {disease.description}
                                    </p>
                                    
                                    <button 
                                        onClick={() => navigate(`/disease/${disease.id}`)}
                                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all"
                                    >
                                        View Details <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDiseases.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No Results Found</h3>
                        <p className="text-slate-500 font-medium">Try different keywords or browse all categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HealthGuide;
