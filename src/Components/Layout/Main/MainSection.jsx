import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import { useSearchParams } from 'react-router';
import useScrollReveal from '../../../hooks/useScrollReveal';

const MainSection = () => {
    const [doctors, setDoctors] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

    useScrollReveal();

    useEffect(() => {
        fetch('/Data/doctors.json')
            .then(res => res.json())
            .then(data => setDoctors(data))
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        if (!searchQuery) return true;
        return (
            doctor.name.toLowerCase().includes(searchQuery) ||
            doctor.specialization.toLowerCase().includes(searchQuery) ||
            doctor.qualification.toLowerCase().includes(searchQuery)
        );
    });

    const visibleDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 6);

    return (
        <div id="doctors-section" className="w-11/12 mx-auto py-24 transition-colors duration-300">
            <div className="text-center mb-16 reveal">
                <span className="text-blue-600 dark:text-blue-400 font-black tracking-widest uppercase text-sm mb-4 block">Meet Our Specialists</span>
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 dark:text-white">Our Best Doctors</h2>
                <p className="text-gray-500 dark:text-slate-400 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                    Connecting you with verified, experienced doctors across various specialties — all at your convenience.
                </p>
            </div>
            
            {searchQuery && (
                <div className="text-center mb-12 reveal">
                    <p className="inline-block px-6 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full font-bold border border-blue-100 dark:border-blue-900/30">
                        {filteredDoctors.length > 0 
                            ? `Found ${filteredDoctors.length} specialists for your search`
                            : `No specialists found matching your search`
                        }
                    </p>
                </div>
            )}

            {filteredDoctors.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                        {visibleDoctors.map((doctor, index) => (
                            <div key={doctor.id} className="reveal" style={{ transitionDelay: `${(index % 3) * 0.1}s` }}>
                                <DoctorCard doctor={doctor} />
                            </div>
                        ))}
                    </div>
                    {filteredDoctors.length > 6 && (
                        <div className="text-center reveal">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="btn btn-lg bg-white dark:bg-slate-900 hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white border-2 border-blue-100 dark:border-slate-800 hover:border-blue-600 font-black px-12 rounded-full transition-all shadow-xl shadow-blue-100/50 dark:shadow-black/50"
                            >
                                {showAll ? 'Show Less' : 'Explore All Doctors'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-gray-200 dark:border-slate-800 reveal">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">No Specialists Found</h3>
                    <p className="text-gray-500 dark:text-slate-400 font-medium">Try adjusting your search terms or browse all available categories.</p>
                </div>
            )}
        </div>
    );
};

export default MainSection;
