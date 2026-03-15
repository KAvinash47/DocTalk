import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 z-50 flex items-center justify-center">
            <span className="loading loading-bars loading-xl text-blue-600"></span>
        </div>
    );
};

export default Loader;