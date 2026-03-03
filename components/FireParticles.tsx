import React from 'react';

export const FireParticles = () => {
    // We use the flames.png image to ensure realistic high-quality fire 
    // instead of using CSS shapes that look like lines or dots.
    return (
        <div className="fixed inset-x-0 bottom-0 z-0 pointer-events-none overflow-hidden h-[25vh] md:h-[35vh] flex items-end justify-center opacity-90 mix-blend-screen transition-all duration-1000">
            <img
                src="/flames.png"
                alt="Flames Overlay"
                className="w-full h-full object-cover object-bottom animate-burn"
                style={{
                    filter: 'drop-shadow(0 -10px 30px rgba(255, 77, 0, 0.4)) saturate(1.5)',
                    transformOrigin: 'bottom center'
                }}
            />
            {/* Subtle blend line at the very bottom to merge cleanly with the screen edge */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-athos-orange/30 to-transparent pointer-events-none" />
        </div>
    );
};

FireParticles.displayName = 'FireParticles';
