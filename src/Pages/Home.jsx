import React from 'react';
import Banner from '../Components/Banner';
import MainSection from '../Components/Layout/Main/MainSection';
import Success from '../Components/Layout/Success/Success';

const Home = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100">

            {/* Animated Background Blobs */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-400 opacity-20 rounded-full blur-3xl animate-float-slow"></div>
            <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-400 opacity-20 rounded-full blur-3xl animate-float-slow"></div>

            {/* Content */}
            <div className="relative z-10">
                <Banner />
                <MainSection />
                <Success />
            </div>

        </div>
    );
};

export default Home;