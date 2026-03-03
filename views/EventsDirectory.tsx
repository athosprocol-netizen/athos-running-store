import React, { useState } from 'react';
import { useApp } from '../context';
import { Calendar, MapPin, Search } from 'lucide-react';

export const EventsDirectory = () => {
    const { events, selectEvent } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const upcomingEvents = events.filter(e => e.status === 'upcoming' && e.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const pastEvents = events.filter(e => e.status === 'past' && e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="pt-24 pb-20 px-6 max-w-[1400px] mx-auto min-h-[80vh] animate-fade-in">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black italic text-athos-black mb-2 uppercase">DIRECTORIO DE <span className="text-athos-orange">EVENTOS</span></h1>
                    <p className="text-gray-500 font-bold max-w-lg">Encuentra tu próximo desafío. Explora el calendario oficial y prepárate para cruzar la meta.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar carrera o ciudad..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-athos-black focus:ring-2 focus:ring-athos-orange/20 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Upcoming Events */}
            <section className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-athos-orange rounded-full"></div>
                    <h2 className="text-3xl font-black italic text-athos-black uppercase">Próximos Retos</h2>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                className="group bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(255,77,0,0.1)] hover:-translate-y-2 hover:border-athos-orange/30 transition-all cursor-pointer flex flex-col"
                                onClick={() => selectEvent(event.id)}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-athos-black/80 via-transparent to-transparent z-10" />
                                    {event.isFeatured && (
                                        <span className="absolute top-4 left-4 z-20 bg-athos-orange text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">
                                            Destacado
                                        </span>
                                    )}
                                    <img src={event.image || '/imagen_bordes_difuminados.png'} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <h3 className="text-white text-2xl font-black italic tracking-tight">{event.title}</h3>
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col justify-between">
                                    <div className="mb-6 space-y-3">
                                        <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                                            <Calendar size={18} className="text-athos-orange" />
                                            <span>{new Date(event.date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                                            <MapPin size={18} className="text-athos-orange" />
                                            <span>{event.location}, {event.city}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex gap-1.5">
                                            {event.distances.map(d => (
                                                <span key={d} className="bg-gray-100 text-athos-black text-[10px] font-black uppercase px-2 py-1 rounded">
                                                    {d}
                                                </span>
                                            ))}
                                        </div>
                                        <button className="bg-athos-black text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl group-hover:bg-athos-orange transition-colors glow-effect">
                                            Detalles
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-bold">No se encontraron carreras próximas con esos criterios.</p>
                    </div>
                )}
            </section>

            {/* Past Events */}
            <section>
                <div className="flex items-center gap-3 mb-8 opacity-60">
                    <div className="w-2 h-8 bg-gray-400 rounded-full"></div>
                    <h2 className="text-3xl font-black italic text-gray-500 uppercase">Carreras Anteriores</h2>
                </div>

                {pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {pastEvents.map(event => (
                            <div
                                key={event.id}
                                className="group bg-gray-50 rounded-[24px] p-4 flex gap-4 items-center cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                                onClick={() => selectEvent(event.id)}
                            >
                                <img src={event.image || '/medalleroverde.png'} alt={event.title} className="w-20 h-20 rounded-2xl object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                <div>
                                    <h4 className="font-black italic text-athos-black leading-tight mb-1 group-hover:text-athos-orange transition-colors">{event.title}</h4>
                                    <p className="text-xs font-bold text-gray-400">{new Date(event.date).getFullYear()} • {event.city}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 font-medium italic">No hay historial de carreras previas aún.</p>
                )}
            </section>
        </div>
    );
};
