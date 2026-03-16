import React, { useState } from 'react';
import { useApp } from '../context';
import { ArrowRight, Building, User, Mail, Phone, Calendar, HeartHandshake } from 'lucide-react';

export const SponsorEvent = () => {
    const { events, setView } = useApp();
    const [formData, setFormData] = useState({
        organization: '',
        contactName: '',
        email: '',
        phone: '',
        eventId: '',
        newEventName: '',
        newEventDate: '',
        message: ''
    });

    const upcomingEvents = events.filter(e => e.status !== 'past');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const selectedEvent = events.find(ev => ev.id === formData.eventId);
        let eventName = 'un evento';
        if (formData.eventId === 'new') {
            eventName = formData.newEventName;
            if (formData.newEventDate) {
                eventName += ` (Fecha: ${formData.newEventDate})`;
            }
        } else if (selectedEvent) {
            eventName = selectedEvent.title;
        } else if (formData.eventId === 'any') {
            eventName = 'cualquier evento futuro';
        }
        
        const whatsappNumber = "573242674234";
        const messageText = `Hola, me gustaría patrocinar el evento ${eventName}. Soy ${formData.organization}. Mi nombre es ${formData.contactName}. Mensaje adicional: ${formData.message}`;
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="pt-12 md:pt-24 pb-20 px-6 max-w-[800px] mx-auto min-h-[80vh] animate-fade-in relative z-10">
            {/* Header */}
            <div className="mb-6 md:mb-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-athos-orange/10 mb-2">
                    <HeartHandshake className="text-athos-orange w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black italic text-athos-black mb-4 uppercase">
                    PATROCINA TU <span className="text-athos-orange">EVENTO</span>
                </h1>
                <p className="text-gray-500 font-bold max-w-lg mx-auto text-sm md:text-lg">
                    Conecta tu marca con miles de corredores apasionados. Sé parte de la experiencia ATHOS.
                </p>
            </div>

            {/* Form */}
            <div className="bg-white p-8 md:p-12 rounded-[32px] md:rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
                {/* Visual Accent Loop */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-athos-orange via-red-500 to-athos-black"></div>

                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Organization */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Building size={14} /> Organización / Empresa
                            </label>
                            <input
                                type="text"
                                name="organization"
                                required
                                value={formData.organization}
                                onChange={handleChange}
                                placeholder="Nombre de tu marca"
                                className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                            />
                        </div>

                        {/* Contact Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Persona de Contacto
                            </label>
                            <input
                                type="text"
                                name="contactName"
                                required
                                value={formData.contactName}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Mail size={14} /> Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Phone size={14} /> Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+57 300 000 0000"
                                className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Event Interest */}
                        <div className="space-y-4 col-span-1 md:col-span-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar size={14} /> Evento a Patrocinar
                            </label>

                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer rounded-xl border-2 p-3 md:p-4 text-center transition-all ${formData.eventId !== 'new' ? 'border-athos-orange bg-athos-orange/5' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="eventType"
                                        value="existing"
                                        checked={formData.eventId !== 'new'}
                                        onChange={() => setFormData({ ...formData, eventId: '' })}
                                        className="hidden"
                                    />
                                    <span className={`block font-black uppercase tracking-widest text-xs md:text-sm ${formData.eventId !== 'new' ? 'text-athos-orange' : 'text-gray-500'}`}>
                                        Evento de Calendario
                                    </span>
                                </label>
                                <label className={`cursor-pointer rounded-xl border-2 p-3 md:p-4 text-center transition-all ${formData.eventId === 'new' ? 'border-athos-orange bg-athos-orange/5' : 'border-gray-100 bg-gray-50 hover:border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        name="eventType"
                                        value="new"
                                        checked={formData.eventId === 'new'}
                                        onChange={() => setFormData({ ...formData, eventId: 'new' })}
                                        className="hidden"
                                    />
                                    <span className={`block font-black uppercase tracking-widest text-xs md:text-sm ${formData.eventId === 'new' ? 'text-athos-orange' : 'text-gray-500'}`}>
                                        Evento Nuevo
                                    </span>
                                </label>
                            </div>

                            {formData.eventId !== 'new' ? (
                                <div className="relative animate-fade-in mt-2">
                                    <select
                                        name="eventId"
                                        required
                                        value={formData.eventId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 pr-12 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black appearance-none"
                                    >
                                        <option value="" disabled>Selecciona un evento...</option>
                                        {upcomingEvents.map(event => (
                                            <option key={event.id} value={event.id}>
                                                {event.title} - {event.city} ({new Date(event.date).toLocaleDateString('es-CO')})
                                            </option>
                                        ))}
                                        <option value="any">Cualquier evento futuro</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="newEventName"
                                        required
                                        value={formData.newEventName}
                                        onChange={handleChange}
                                        placeholder="Nombre del Evento (Ej. Nocturna 5K)"
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                                    />
                                    <input
                                        type="date"
                                        name="newEventDate"
                                        required
                                        value={formData.newEventDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            Mensaje / Observaciones Extras
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Cuéntanos un poco más sobre lo que buscas..."
                            rows={4}
                            className="w-full px-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-athos-orange focus:ring-0 transition-colors font-bold text-athos-black resize-none"
                        ></textarea>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setView('home')}
                            className="text-gray-400 font-bold hover:text-athos-black transition-colors"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="w-full md:w-auto bg-athos-orange text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-[0_4px_20px_rgba(255,77,0,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 glow-effect"
                        >
                            Patrocina <ArrowRight size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
