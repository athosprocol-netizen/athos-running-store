import React from 'react';

export const Marquee = () => {
    return (
        <div className="w-full bg-[#D4432C] overflow-hidden relative flex flex-col justify-center h-16 shadow-inner z-40 border-y-4 border-white">
            {/* Lane Dividers */}
            <div className="absolute top-1/3 left-0 w-full border-t-[2px] border-dashed border-white/60"></div>
            <div className="absolute top-2/3 left-0 w-full border-t-[2px] border-dashed border-white/60"></div>

            {/* Central Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 w-full">
                <div className="px-6 py-1.5 rounded-full text-white font-black italic tracking-widest text-[10px] md:text-sm uppercase shadow-sm border border-white/20 whitespace-nowrap" style={{ background: 'rgba(185, 56, 34, 0.95)', backdropFilter: 'blur(4px)' }}>
                    🔥 ENVÍO GRATIS EN PEDIDOS MAYORES A $300k 🔥
                </div>
            </div>

            {/* Runners */}
            <div className="absolute top-[2px] left-[-50px] animate-run-fast text-xl drop-shadow-md z-0" style={{ transform: 'scaleX(-1)' }}>🏃🏽‍♂️</div>
            <div className="absolute top-[21px] left-[-50px] animate-run-med text-xl drop-shadow-md z-0" style={{ transform: 'scaleX(-1)' }}>🏃🏻‍♀️</div>
            <div className="absolute top-[42px] left-[-50px] animate-run-slow text-xl drop-shadow-md z-0" style={{ transform: 'scaleX(-1)' }}>🏃🏿‍♂️</div>

            <style>{`
                @keyframes runRight {
                    0% { transform: translateX(0) scaleX(-1); }
                    100% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
                }
                .animate-run-fast {
                    animation: runRight 4.5s linear infinite;
                }
                .animate-run-med {
                    animation: runRight 6s linear infinite;
                }
                .animate-run-slow {
                    animation: runRight 8s linear infinite;
                }
            `}</style>
        </div>
    );
};
