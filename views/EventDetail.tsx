import React, { useEffect } from 'react';
import { useApp } from '../context';
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Map as MapIcon, Image as ImageIcon } from 'lucide-react';

export const EventDetail = () => {
    const { events, selectedEventId, setView, user } = useApp();

    const event = events.find(e => e.id === selectedEventId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedEventId]);

    if (!event) {
        return (
            <div className="pt-32 min-h-screen text-center flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black italic text-athos-black mb-4">EVENTO NO <span className="text-athos-orange">ENCONTRADO</span></h1>
                <button onClick={() => setView('events')} className="bg-athos-black text-white px-8 py-4 rounded-2xl font-black mt-4 hover:bg-athos-orange transition-colors">Volver al Directorio</button>
            </div>
        );
    }

    const isPast = event.status === 'past';

    return (
        <div className="bg-white min-h-screen pb-24 animate-fade-in relative">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-athos-black via-athos-black/40 to-transparent z-10" />
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />

                <div className="absolute top-4 left-4 z-20 md:top-8 md:left-8">
                    <button
                        onClick={() => setView('events')}
                        className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        &larr; Volver
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 max-w-[1400px] mx-auto">
                    {event.isFeatured && (
                        <span className="inline-block bg-athos-orange text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4 glow-effect">
                            Evento Destacado
                        </span>
                    )}
                    <h1 className="text-white text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-white/90 font-medium text-sm md:text-base">
                        <span className="flex items-center gap-2"><Calendar size={18} className="text-athos-orange" /> {new Date(event.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-2"><MapPin size={18} className="text-athos-orange" /> {event.location}, {event.city}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-black italic text-athos-black uppercase mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                            Acerca de la Carrera
                        </h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            {event.description}
                        </p>
                    </section>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <MapPin className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Ciudad</span>
                            <span className="text-athos-black font-black text-lg">{event.city}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <Clock className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Hora</span>
                            <span className="text-athos-black font-black text-lg">
                                {new Date(event.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <Users className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Cupos</span>
                            <span className="text-athos-black font-black text-lg">{event.maxParticipants ? `${event.currentParticipants || 0}/${event.maxParticipants}` : 'Ilimitados'}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <MapIcon className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Distancias</span>
                            <span className="text-athos-black font-black text-lg">{event.distances.join(' • ')}</span>
                        </div>
                    </div>

                    {/* Route Map Mockup */}
                    <section>
                        <h2 className="text-2xl font-black italic text-athos-black uppercase mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                            Recorrido Oficial
                        </h2>
                        <div className="w-full h-80 bg-gray-100 rounded-[32px] border border-gray-200 overflow-hidden relative group cursor-pointer flex items-center justify-center">
                            {/* Map Placeholder Image */}
                            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Map Route" className="w-full h-full object-cover opacity-50 contrast-125 grayscale" />
                            <div className="absolute inset-0 bg-athos-blue/10 mix-blend-color"></div>

                            <div className="absolute z-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white flex items-center gap-4 group-hover:scale-105 transition-transform">
                                <MapIcon className="text-athos-orange" size={24} />
                                <div>
                                    <h4 className="font-black text-athos-black uppercase">Ver Mapa Interactivo</h4>
                                    <p className="text-xs text-gray-500 font-bold">Ver rutas por altura y distancias</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Photos Link (if Past) */}
                    {isPast && event.photosLink && (
                        <section className="bg-athos-black text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10 blur-sm pointer-events-none">
                                <ImageIcon size={200} />
                            </div>
                            <div className="relative z-10 w-full md:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-2">
                                    Galería Oficial
                                </h2>
                                <p className="text-gray-400 font-medium">Encuentra tus fotos de la carrera usando reconocimiento facial o buscando por tu número de dorsal.</p>
                            </div>
                            <button
                                onClick={() => window.open(event.photosLink, '_blank')}
                                className="relative z-10 w-full md:w-auto bg-athos-orange text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 glow-effect"
                            >
                                Ver Fotos <ArrowRight size={18} />
                            </button>
                        </section>
                    )}
                </div>

                {/* Right Column: Sticky Action Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-[100px] bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest block mb-1">Precio Oficial</span>
                                <h3 className="text-4xl font-black text-athos-black italic tracking-tighter">${event.price.toLocaleString('es-CO')} <span className="text-lg font-bold text-gray-400">COP</span></h3>
                            </div>
                            <button className="text-gray-400 hover:text-athos-orange transition-colors" title="Compartir Evento">
                                <Share2 size={24} />
                            </button>
                        </div>

                        {!isPast ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setView('event-registration')}
                                    className="w-full bg-athos-orange text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)] hover:-translate-y-1 transition-all glow-effect flex justify-center items-center gap-2"
                                >
                                    Inscríbete Ahora <ArrowRight size={18} />
                                </button>
                                <p className="text-center text-xs text-gray-500 font-bold">
                                    {event.currentParticipants && event.maxParticipants
                                        ? `¡Quedan ${event.maxParticipants - event.currentParticipants} cupos disponibles!`
                                        : 'Asegura tu lugar hoy mismo'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="w-full bg-gray-100 text-gray-400 font-black uppercase tracking-widest py-5 rounded-2xl text-center cursor-not-allowed">
                                    Evento Finalizado
                                </div>
                                <button
                                    onClick={() => setView('event-results')}
                                    className="w-full bg-athos-black text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                                >
                                    Ver Resultados
                                </button>
                            </div>
                        )}

                        <hr className="my-8 border-gray-100" />

                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-athos-black uppercase tracing-wide">Organizador</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                                    {event.organizerId === 'org1' ? 'MCM' : 'TRA'}
                                </div>
                                <div>
                                    <p className="font-bold text-athos-black">Athos Events Partner</p>
                                    <p className="text-xs text-gray-500">Organizador Oficial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
