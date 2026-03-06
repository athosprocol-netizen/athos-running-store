import React from 'react';

export const Marquee = () => {
    const phrases = ["DESATA TU VELOCIDAD", "SUPERA TUS LÍMITES", "CORRE MÁS LEJOS", "EQUIPAMIENTO RETADOR"];
    // Repeat enough arrays to ensure smooth infinite scrolling
    const repeated = Array(12).fill(phrases).flat();

    return (
        <div className="w-full bg-athos-black text-white py-1.5 md:py-2 overflow-hidden flex items-center shadow-[0_4px_20px_rgba(255,77,0,0.15)] z-40 relative border-y-2 border-athos-orange/30">
            {/* Track background pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 5px)', backgroundSize: '100% 12px' }}></div>

            <div className="whitespace-nowrap flex items-center animate-marquee relative z-10 w-[200%]">
                {repeated.map((phrase, i) => (
                    <div key={i} className="flex items-center mx-4 md:mx-6">
                        <span className="text-[10px] md:text-sm font-black italic tracking-widest uppercase hover:text-athos-orange transition-colors duration-300 drop-shadow-md">
                            {phrase}
                        </span>
                        {/* Runner animation figures */}
                        <div className="mx-4 md:mx-8 flex items-center gap-1.5 text-athos-orange drop-shadow-md">
                            <span className="text-sm md:text-lg animate-bounce" style={{ animationDuration: i % 2 === 0 ? '0.4s' : '0.5s', animationDelay: `${i * 0.1}s` }}>
                                {i % 2 === 0 ? '🏃‍♂️' : '🏃‍♀️'}
                            </span>
                            <span className="text-xs md:text-sm opacity-80 animate-pulse">💨</span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
                .animate-bounce {
                    animation: bounce 0.4s infinite alternate cubic-bezier(0.3, 0.1, 0.4, 1);
                }
                @keyframes bounce {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(-3px) rotate(5deg); }
                }
            `}</style>
        </div>
    );
};
