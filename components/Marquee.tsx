import React from 'react';

export const Marquee = () => {
    // Restoring the small, clean announcement bar that the user preferred
    const text = "🔥 ENVÍO GRATIS EN PEDIDOS MAYORES A $300k • FIRE DEALS ACTIVAS 🔥 ";
    const repeatedText = text.repeat(10); // Repeat enough to ensure smooth continuous scroll

    return (
        <div className="w-full bg-athos-black text-white py-2 overflow-hidden flex items-center shadow-md z-40">
            <div className="whitespace-nowrap animate-marquee flex items-center">
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 hover:text-athos-orange transition-colors duration-300">
                    {repeatedText}
                </span>
                <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase px-4 hover:text-athos-orange transition-colors duration-300">
                    {repeatedText}
                </span>
            </div>
        </div>
    );
};
