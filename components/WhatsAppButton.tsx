import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
    const phoneNumber = "573242674234";
    const message = "Hola Athos, estoy interesado en sus productos y quisiera mas informacion.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[2147483647] group block"
            aria-label="Contactar por WhatsApp"
        >
            <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:scale-110 transition-transform duration-300 hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)]">
                {/* Ping animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping duration-[2s]"></span>

                {/* Icon */}
                <MessageCircle color="white" size={28} strokeWidth={2.5} className="relative z-10" />

                {/* Tooltip on hover (Desktop only) */}
                <div className="absolute right-full mr-4 bg-white text-athos-black text-xs font-bold py-2 px-4 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block pointer-events-none">
                    Chatea con nosotros
                    {/* Arrow */}
                    <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                </div>
            </div>
        </a>
    );
};
