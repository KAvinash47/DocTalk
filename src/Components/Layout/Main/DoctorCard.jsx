import React from 'react';
import { RiRegisteredLine } from "react-icons/ri";
import { useNavigate } from 'react-router';

const DoctorCard = ({ doctor }) => {
    const { id, name, specialization, qualification, experience, registration, workingDays, image } = doctor;
    const navigate = useNavigate();

    // Check if doctor is available today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const isAvailableToday = workingDays.includes(today);

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 relative overflow-hidden">
            {/* Doctor Image */}
            <div className="flex justify-center mb-6 h-[280px] w-full overflow-hidden rounded-2xl">
                <img src={image} alt={name} className="h-full w-full object-cover object-top" />
            </div>

            {/* Badges */}
            <div className="flex gap-4 mb-4">
                <div className={`${isAvailableToday ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} px-4 py-2 rounded-full text-sm font-medium`}>
                    {isAvailableToday ? 'Available' : 'Unavailable'}
                </div>
                <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                    {experience}
                </div>
            </div>

            {/* Doctor Info */}
            <div className="">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{name}</h3>
                <p className="text-gray-600 font-medium mb-2">{qualification}</p>
                <p className="text-blue-600 mb-4">{specialization}</p>
                <div className="border border-dashed border-gray-300 mb-2"></div>
                <p className="text-gray-500 text-sm mb-6 flex items-center gap-2"><RiRegisteredLine className="text-lg" />{registration}</p>
                <button 
                    onClick={() => navigate(`/doctor/${id}`)}
                    className="btn btn-outline btn-success hover:text-white w-full py-3 rounded-full text-base font-medium transition-colors"
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;