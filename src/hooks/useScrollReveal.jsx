import { useEffect } from 'react';

const useScrollReveal = () => {
    useEffect(() => {
        const reveal = () => {
            const reveals = document.querySelectorAll('.reveal');
            for (let i = 0; i < reveals.length; i++) {
                const windowHeight = window.innerHeight;
                const elementTop = reveals[i].getBoundingClientRect().top;
                const elementVisible = 100;
                if (elementTop < windowHeight - elementVisible) {
                    reveals[i].classList.add('active');
                }
            }
        };

        window.addEventListener('scroll', reveal);
        reveal();
        return () => window.removeEventListener('scroll', reveal);
    }, []);
};

export default useScrollReveal;
