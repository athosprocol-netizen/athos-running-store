import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Shield, CreditCard, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { EventRegistration as RegistrationType } from '../types';

export const EventRegistration = () => {
    const { events, selectedEventId, setView, user, registerForEvent } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const event = events.find(e => e.id === selectedEventId);

    const [formData, setFormData] = useState({
        distance: event?.distances[0] || '',
        tshirtSize: 'M',
        emergencyContactName: '',
        emergencyContactPhone: '',
        teamName: '',
        bloodType: 'O+'
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!event) {
            setView('events');
        }
    }, [event, setView]);

    if (!event) return null;

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Mock API call
        setTimeout(() => {
            const newRegistration: RegistrationType = {
                id: `reg-${Date.now()}`,
                userId: user?.id || 'guest',
                eventId: event.id,
                date: new Date().toISOString(),
                status: 'pending',
                distance: formData.distance,
                shirtSize: formData.tshirtSize,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone
            };

            registerForEvent(newRegistration);
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gray-50 animate-fade-in">
                <div className="bg-white p-10 rounded-[40px] shadow-xl text-center max-w-lg w-full border border-gray-100">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black italic text-athos-black uppercase mb-4">¡Inscripción Exitosa!</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Estás oficialmente list@ para correr en <strong className="text-athos-orange">{event.title}</strong>.
                        Te hemos enviado un correo con tu número de dorsal y los detalles de entrega de kits.
                    </p>
                    <div className="bg-gray-50 p-6 rounded-2xl text-left border border-gray-200 mb-8 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Distancia</span>
                            <span className="text-sm font-black text-athos-black">{formData.distance}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Talla de Camiseta</span>
                            <span className="text-sm font-black text-athos-black">{formData.tshirtSize}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                            <span className="text-sm font-bold text-gray-500">Contacto</span>
                            <span className="text-sm font-black text-athos-orange">Enviado al Organizador</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setView('profile')}
                        className="w-full bg-athos-black text-white font-black uppercase py-4 rounded-xl hover:bg-athos-orange transition-colors"
                    >
                        Ver Mis Eventos
                    </button>
                    <button
                        onClick={() => setView('events')}
                        className="w-full text-gray-500 font-bold uppercase py-4 mt-2 hover:text-athos-black transition-colors"
                    >
                        Volver al Directorio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto min-h-screen animate-fade-in">
            {/* Context Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-black italic text-athos-black uppercase tracking-tighter mb-2">
                    INSCRIPCIÓN <span className="text-athos-orange">OFICIAL</span>
                </h1>
                <p className="text-gray-500 font-bold">Completa tus datos para asegurar tu cupo en {event.title}.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-8">
                    <form id="registration-form" onSubmit={handleRegister} className="space-y-8">
                        {/* Runner Info Section */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black italic uppercase text-athos-black mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-athos-orange rounded-full"></div>
                                1. Datos del Corredor
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Distancia a Correr *</label>
                                    <select
                                        required
                                        value={formData.distance}
                                        onChange={e => setFormData({ ...formData, distance: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    >
                                        <option value="">Selecciona tu distancia</option>
                                        {event.distances.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Talla Camiseta Oficial *</label>
                                    <select
                                        required
                                        value={formData.tshirtSize}
                                        onChange={e => setFormData({ ...formData, tshirtSize: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    >
                                        {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                                            <option key={size} value={size}>Talla {size}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Grupo Sanguíneo *</label>
                                    <select
                                        required
                                        value={formData.bloodType}
                                        onChange={e => setFormData({ ...formData, bloodType: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    >
                                        {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Equipo / Team (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre de tu Club de Runners"
                                        value={formData.teamName}
                                        onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Info */}
                        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                            <h3 className="text-xl font-black italic uppercase text-athos-black mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-5 bg-athos-orange rounded-full"></div>
                                2. Contacto de Emergencia
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="E.g. María Pérez"
                                        value={formData.emergencyContactName}
                                        onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Teléfono de Emergencia *</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="(+57) 300 000 0000"
                                        value={formData.emergencyContactPhone}
                                        onChange={e => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Waivers & Policies */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input type="checkbox" required className="mt-1 w-5 h-5 text-athos-orange rounded border-gray-300 focus:ring-athos-orange" />
                                <span className="text-sm font-medium text-gray-600">
                                    Acepto la <a href="#" className="font-bold underline text-athos-black hover:text-athos-orange">Exoneración de Responsabilidades</a> y declaro estar en condiciones físicas óptimas para participar en este evento bajo mi propio riesgo.
                                </span>
                            </label>
                        </div>
                    </form>
                </div>

                {/* Right Column: Summary & Payment */}
                <div className="lg:col-span-1">
                    <div className="sticky top-[100px] bg-athos-black rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-athos-orange/20 rounded-bl-[100px] pointer-events-none"></div>

                        <h3 className="text-xl font-black italic uppercase mb-6 flex items-center justify-between">
                            Resumen
                            <span className="text-xs text-athos-orange font-bold font-sans not-italic bg-white/10 px-2 py-1 rounded">Seguro</span>
                        </h3>

                        <div className="flex gap-4 items-center mb-6 border-b border-gray-800 pb-6">
                            <img src={event.image || '/imagen_bordes_difuminados.png'} alt={event.title} className="w-16 h-16 rounded-xl object-cover" />
                            <div>
                                <h4 className="font-black leading-tight line-clamp-2">{event.title}</h4>
                                <p className="text-xs font-bold text-gray-400">{event.city}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 font-medium">
                            <div className="flex justify-between text-gray-400">
                                <span>Inscripción en Plataforma</span>
                                <span className="text-green-400">Gratuita</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Kit Oficial</span>
                                <span className="text-green-400">Sujeto a Organizador</span>
                            </div>
                        </div>

                        <button
                            form="registration-form"
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-athos-orange text-white font-black uppercase tracking-widest py-5 rounded-2xl flex justify-center items-center gap-2 transition-all glow-effect ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-white hover:text-athos-black hover:scale-[1.02]'}`}
                        >
                            {isSubmitting ? 'Procesando...' : (
                                <>Registrar Participación <ChevronRight size={20} /></>
                            )}
                        </button>

                        <div className="mt-6 flex flex-col items-center gap-2 text-gray-500">
                            <div className="flex gap-2">
                                <Shield size={16} />
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-center">
                                Tus datos están asegurados con ATHOS
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
