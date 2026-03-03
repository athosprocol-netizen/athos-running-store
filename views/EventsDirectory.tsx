import React from 'react';
import { useApp } from '../context';

export const EventsDirectory = () => {
    return (
        <div className="pt-24 px-4 min-h-screen text-center">
            <h1 className="text-4xl font-black italic mb-4 text-athos-black">DIRECTORIO DE <span className="text-athos-orange">EVENTOS</span></h1>
            <p className="text-gray-500 font-bold mb-8">Nuevos eventos llegarán pronto.</p>
        </div>
    );
};
