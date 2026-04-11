import React from 'react';
import Banner from '../Components/Banner';
import MainSection from '../Components/Layout/Main/MainSection';
import AIAssistant from '../Components/AIAssistant';
import Success from '../Components/Layout/Success/Success';
import useScrollReveal from '../hooks/useScrollReveal';

const Home = () => {
    useScrollReveal();

    return (
        <div>
            <Banner />
            
            <div className="reveal">
                <MainSection />
            </div>

            <div className="reveal">
                <AIAssistant />
            </div>
            
            <div className="reveal">
                <Success />
            </div>
        </div>
    );
};

export default Home;
