import React from 'react';
import { useApp } from '../context';

export const EventDetail = () => {
    return (
        <div className="pt-24 px-4 min-h-screen text-center">
            <h1 className="text-4xl font-black italic mb-4 text-athos-black">DETALLE <span className="text-athos-orange">EVENTO</span></h1>
            <p className="text-gray-500 font-bold mb-8">Información del evento en construcción.</p>
        </div>
    );
};
