import React, { useEffect, useState } from 'react';
import SuccessCard from './SuccessCard';

const Success = () => {
    const [successData, setSuccessData] = useState([]);

    useEffect(() => {
        fetch('/Data/success.json')
            .then(res => res.json())
            .then(data => setSuccessData(data))
            .catch(error => console.error('Error loading success data:', error));
    }, []);

    return (
        <div className="py-16">
            <div className="w-11/12 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">We Provide Best Medical Services</h2>
                    <p className="text-gray-600">Our platform connects you with verified, experienced doctors across various specialties — all at your convenience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {successData.map(item => (
                        <SuccessCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Success;