import React from 'react';

export const BackgroundGlows = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
            {/* Top Left Deep Orange Glow */}
            <div
                className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-athos-orange/10 blur-[120px] mix-blend-multiply opacity-70 animate-pulse-slow"
                style={{ animationDuration: '8s' }}
            />

            {/* Bottom Right Dark/Black Glow for contrast */}
            <div
                className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[1000px] max-h-[1000px] rounded-full bg-gray-400/10 blur-[150px] mix-blend-multiply opacity-50 animate-pulse-slow"
                style={{ animationDuration: '12s', animationDelay: '2s' }}
            />

            {/* Center Subtle Highlight */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-athos-orange/5 blur-[100px] mix-blend-overlay opacity-60"
            />
        </div>
    );
};
