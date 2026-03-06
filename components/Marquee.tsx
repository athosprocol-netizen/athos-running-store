import React from 'react';
import { Flame } from 'lucide-react';

export const Marquee = () => {
    const phrases = ["ENVÍO GRATIS EN PEDIDOS MAYORES A $300k", "COMPRA SEGURO", "SUPERA TUS LÍMITES", "ATHOS RUNNING STORE"];
    const repeated = Array(6).fill(phrases).flat();

    return (
        <div className="w-full bg-athos-black text-white overflow-hidden py-2.5 border-b border-white/5 flex items-center shadow-lg z-40 relative">
            {/* The animate-marquee utility is defined in index.html's tailwind config */}
            <div className="whitespace-nowrap flex items-center animate-marquee w-[200%]">
                {repeated.map((phrase, i) => (
                    <div key={i} className="flex items-center mx-8">
                        <span className="text-xs md:text-sm font-semibold tracking-widest uppercase text-gray-300 hover:text-white transition-colors">
                            {phrase}
                        </span>
                        <div className="mx-8 text-athos-orange opacity-80 animate-pulse-slow">
                            <Flame size={16} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
