import React from 'react';

export const Marquee = () => {
    // Clean, minimal message requested
    const phrases = ["ATHOS RUNNING STORE", "ENVÍO GRATIS $300K+", "SUPERA TUS LÍMITES"];
    const repeated = Array(6).fill(phrases).flat();

    return (
        <div className="w-full bg-[#111] text-white py-1 overflow-hidden flex items-center shadow-sm z-40 relative border-b border-athos-orange/20 h-8">
            {/* Running Track Lanes Background */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,77,0,0.15) 6px, rgba(255,77,0,0.15) 7px)',
                backgroundSize: '100% 7px'
            }}></div>

            <div className="whitespace-nowrap flex items-center animate-marquee relative z-10 w-[200%] h-full">
                {repeated.map((phrase, i) => (
                    <div key={i} className="flex items-center mx-6 h-full">
                        <span className="text-[9px] md:text-[10px] font-medium tracking-[0.2em] uppercase text-gray-300">
                            {phrase}
                        </span>
                        {/* Minimal SVG Runner */}
                        <div className="mx-8 flex items-center text-athos-orange opacity-80" style={{ transform: i % 2 === 0 ? 'translateY(-2px)' : 'translateY(2px)' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-run-cycle">
                                <path d="M12 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                <path d="M14 6l-2 3-3-1"></path>
                                <path d="M12 9l2 3 2 1"></path>
                                <path d="M14 12l-2 4-1 6"></path>
                                <path d="M12 16l-3 5"></path>
                                <path d="M6 14l2-3"></path>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
