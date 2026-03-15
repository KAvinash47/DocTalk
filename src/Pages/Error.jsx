import React from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../Components/Navbar';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Error = () => {
    useDocumentTitle('Page Not Found');
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
                <div className="text-center">
                    <img src="https://i.postimg.cc/cC94ybs2/error-Page.jpg" alt="404 Error" className="max-w-md w-full mb-8 mx-auto" />
                    <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
                    <h2 className="text-3xl font-semibold text-red-600 mb-6">Page Not Found</h2>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-full transition-colors"
                    >
                        Back to Homepage
                    </button>
                </div>
            </div>
        </>
    );
};

export default Error;