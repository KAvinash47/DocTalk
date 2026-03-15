import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import { useSearchParams } from 'react-router';

const MainSection = () => {
    const [doctors, setDoctors] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search')?.toLowerCase() || '';

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
        <div className="w-11/12 mx-auto py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Our Best Doctors</h2>
                <p className="text-gray-600 max-w-3xl mx-auto">Our platform connects you with verified, experienced doctors across various specialties — all at your convenience. Whether it's a routine checkup or urgent consultation, book appointments in minutes and receive quality care you can trust.</p>
            </div>
            
            {/* Show search results count when searching */}
            {searchQuery && (
                <div className="text-center mb-8">
                    <p className="text-gray-600">
                        {filteredDoctors.length > 0 
                            ? `Found ${filteredDoctors.length} doctor${filteredDoctors.length === 1 ? '' : 's'} matching "${searchQuery}"`
                            : `No doctors found matching "${searchQuery}"`
                        }
                    </p>
                </div>
            )}

            {filteredDoctors.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {visibleDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                    {filteredDoctors.length > 6 && (
                        <div className="text-center">
                            <button
                                onClick={() => setShowAll(!showAll)}
                                className="btn bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-colors"
                            >
                                {showAll ? 'Show Less' : 'View All Doctors'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-500">Try adjusting your search terms or browse all available doctors.</p>
                </div>
            )}
        </div>
    );
};

export default MainSection;