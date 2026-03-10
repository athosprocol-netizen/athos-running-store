import React, { useEffect, useState } from 'react';
import { useApp } from '../context';
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Map as MapIcon, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const EventDetail = () => {
    const { events, selectedEventId, setView, user } = useApp();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

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

    const actionCardContent = (
        <>
            <div className="flex flex-col gap-4 mb-6">
                <button onClick={() => {
                    const shareUrl = `${window.location.origin}/?event=${event.id}`;
                    if (navigator.share) {
                        navigator.share({
                            title: event.title,
                            url: shareUrl
                        }).catch(console.error);
                    } else {
                        navigator.clipboard.writeText(shareUrl);
                        alert('Enlace copiado al portapapeles');
                    }
                }} className="w-full bg-athos-orange text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 glow-effect">
                    <Share2 size={20} /> Compartir Evento
                </button>

                {event.externalUrl && (
                    <button onClick={() => window.open(event.externalUrl, '_blank')} className="w-full bg-athos-black text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                        VISITAR SITIO <ArrowRight size={20} />
                    </button>
                )}
            </div>
            {isPast && <div className="mb-6 border-t border-gray-100 pt-6"></div>}

            {isPast && (
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
        </>
    );

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && event.gallery) {
            setSelectedImageIndex(selectedImageIndex === 0 ? event.gallery.length - 1 : selectedImageIndex - 1);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && event.gallery) {
            setSelectedImageIndex(selectedImageIndex === event.gallery.length - 1 ? 0 : selectedImageIndex + 1);
        }
    };

    return (
        <div className="bg-white min-h-screen pb-24 animate-fade-in relative">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-athos-black via-athos-black/40 to-transparent z-10" />
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    style={{
                        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)'
                    }}
                />

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
                <div className="lg:col-span-2 flex flex-col gap-12 order-2 lg:order-1">
                    {/* About */}
                    <section className="order-2 lg:order-1">
                        <h2 className="text-2xl font-black italic text-athos-black uppercase mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                            Acerca de la Carrera
                        </h2>
                        <div className="text-gray-600 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-line">
                            {event.description}
                        </div>
                    </section>

                    {/* Mobile Action Card */}
                    <div className="lg:hidden bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-6 order-3">
                        {actionCardContent}
                    </div>

                    {/* Event Photo Gallery */}
                    {event.gallery && event.gallery.length > 0 && (
                        <section className="order-4 lg:order-2">
                            <h2 className="text-2xl font-black italic text-athos-black uppercase mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                                Galería del Evento
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {event.gallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                                    >
                                        <img
                                            src={img}
                                            alt={`Galería ${idx + 1}`}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" size={32} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Shopping Promo Banner */}
                    <section className="order-5 lg:order-3 bg-gradient-to-r from-athos-orange to-red-500 rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer" onClick={() => setView('shop')}>
                        <div className="absolute -right-20 -bottom-20 opacity-20 pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
                            <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20.2 7.8l-7.7 7.7-4-4-5.7 5.7" /><path d="M15 7h6v6" /></svg>
                        </div>
                        <div className="relative z-10 md:w-2/3">
                            <span className="text-white/80 font-black tracking-widest uppercase text-xs mb-2 block">Prepárate con Athos</span>
                            <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-3 leading-none">
                                Adquiere tus zapatillas o medallero oficial
                            </h3>
                            <p className="text-white/90 font-medium text-lg leading-snug max-w-lg">
                                Equípate con la mejor tecnología para romper tus propios récords en esta carrera y guarda tus logros en nuestros medalleros.
                            </p>
                        </div>
                        <div className="relative z-10 md:w-1/3 flex justify-end w-full">
                            <button className="bg-white text-athos-orange font-black uppercase tracking-widest px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform w-full md:w-auto text-center">
                                Ir a la tienda
                            </button>
                        </div>
                    </section>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 order-6 lg:order-4">
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
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center max-md:col-span-2">
                            <MapIcon className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Distancias</span>
                            <span className="text-athos-black font-black text-lg">{event.distances.join(' • ')}</span>
                        </div>
                    </div>

                    {/* Photos Link (if Past) */}
                    {isPast && event.photosLink && (
                        <section className="order-7 lg:order-5 bg-athos-black text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
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
                <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2">
                    <div className="sticky top-[100px] bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
                        {actionCardContent}
                    </div>
                </div>

            </div>

            {/* Fullscreen Image Modal */}
            {selectedImageIndex !== null && event.gallery && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                    >
                        <X size={28} />
                    </button>

                    {event.gallery.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-colors z-50 backdrop-blur-md"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-colors z-50 backdrop-blur-md"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    <div className="relative w-full max-w-6xl max-h-screen flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={event.gallery[selectedImageIndex]}
                            alt={`Imagen ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                            {selectedImageIndex + 1} / {event.gallery.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
