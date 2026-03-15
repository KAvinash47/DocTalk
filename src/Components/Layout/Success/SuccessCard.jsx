import React from 'react';
import CountUp from 'react-countup';

const SuccessCard = ({ item }) => {
    const { title, count, image } = item;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
            <div className="mb-4 w-16 h-16">
                <img src={image} alt={title} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-5xl font-bold mb-2">
                <CountUp end={count} duration={2.5} suffix="+" />
            </h3>
            <p className="text-gray-600">{title}</p>
        </div>
    );
};

export default SuccessCard;