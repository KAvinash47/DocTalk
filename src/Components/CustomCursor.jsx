import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const delayedPos = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            const isClickable = target.closest('button, a, [role="button"], input, select, label, .hover-target');
            setIsHovering(!!isClickable);
        };

        let animationFrameId;
        const lerp = (start, end, factor) => start + (end - start) * factor;

        const updateCursor = () => {
            delayedPos.current.x = lerp(delayedPos.current.x, mousePos.current.x, 0.2);
            delayedPos.current.y = lerp(delayedPos.current.y, mousePos.current.y, 0.2);

            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${delayedPos.current.x}px, ${delayedPos.current.y}px, 0) scale(${isHovering ? 1.5 : 1})`;
            }
            animationFrameId = requestAnimationFrame(updateCursor);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        animationFrameId = requestAnimationFrame(updateCursor);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering]);

    return (
        <div 
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[999999] will-change-transform"
            style={{ width: '24px', height: '24px', marginLeft: '-4px', marginTop: '-4px' }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ filter: isHovering ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}>
                <defs>
                    <linearGradient id="cursorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>
                <path d="M3 2L21 12L12 14L8 22L3 2Z" fill="url(#cursorGradient)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        </div>
    );
};

export default CustomCursor;
