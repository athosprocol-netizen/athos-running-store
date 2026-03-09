import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { PlusCircle, ListTodo, Settings, Image as ImageIcon, CheckCircle2, CalendarDays, MapPin, Users, Coins } from 'lucide-react';
import { Event } from '../types';

export const OrganizerDashboard = () => {
    const { events, addEvent, user, setView } = useApp();
    const [activeTab, setActiveTab] = useState<'mis-eventos' | 'crear'>('mis-eventos');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        city: 'Bogotá',
        location: '',
        distances: '5K, 10K',
        price: '',
        maxParticipants: '',
        description: '',
        image: '',
        externalUrl: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    if (!user) {
        return (
            <div className="pt-32 min-h-screen text-center">
                <h1 className="text-3xl font-black italic">Acceso Denegado</h1>
                <p>Debes iniciar sesión para acceder al panel de organizador.</p>
                <button onClick={() => setView('home')} className="mt-4 px-6 py-2 bg-athos-black text-white rounded-xl font-bold">Volver al Inicio</button>
            </div>
        );
    }

    const myEvents = events.filter(e => e.organizerId === user.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const newEvent: Event = {
                id: `evt - ${Date.now()} `,
                title: formData.title,
                date: new Date(formData.date).toISOString(),
                location: formData.location,
                city: formData.city,
                description: formData.description,
                distances: formData.distances.split(',').map(d => d.trim()),
                price: Number(formData.price),
                maxParticipants: formData.maxParticipants ? Number(formData.maxParticipants) : undefined,
                currentParticipants: 0,
                organizerId: user.id,
                image: formData.image || 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                externalUrl: formData.externalUrl,
                status: 'upcoming'
            };

            addEvent(newEvent);
            setIsSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                setActiveTab('mis-eventos');
                setFormData({
                    title: '', date: '', city: 'Bogotá', location: '', distances: '5K, 10K', price: '', maxParticipants: '', description: '', image: '', externalUrl: ''
                });
            }, 3000);
        }, 1200);
    };

    return (
        <div className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto min-h-screen animate-fade-in flex flex-col md:flex-row gap-10">

            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <div className="bg-athos-black text-white p-6 rounded-[24px] mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Organizador</p>
                    <h2 className="font-black text-xl truncate">{user.name}</h2>
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveTab('mis-eventos')}
                        className={`w - full flex items - center gap - 3 px - 6 py - 4 rounded - [20px] font - bold transition - all ${activeTab === 'mis-eventos' ? 'bg-gray-100 text-athos-black' : 'text-gray-500 hover:bg-gray-50'} `}
                    >
                        <ListTodo size={20} className={activeTab === 'mis-eventos' ? 'text-athos-orange' : ''} />
                        Mis Carreras
                    </button>
                    <button
                        onClick={() => setActiveTab('crear')}
                        className={`w - full flex items - center gap - 3 px - 6 py - 4 rounded - [20px] font - black tracking - wide uppercase transition - all ${activeTab === 'crear' ? 'bg-athos-orange text-white shadow-lg glow-effect' : 'bg-athos-black text-white hover:bg-gray-800'} `}
                    >
                        <PlusCircle size={20} />
                        Crear Evento
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-6 py-4 rounded-[20px] font-bold text-gray-400 hover:bg-gray-50 transition-all cursor-not-allowed"
                    >
                        <Settings size={20} />
                        Configuración
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                {activeTab === 'mis-eventos' ? (
                    <div className="space-y-6">
                        <header className="mb-8 flex justify-between items-end border-b border-gray-100 pb-4">
                            <div>
                                <h1 className="text-3xl font-black italic text-athos-black uppercase tracking-tight">Panel de <span className="text-athos-orange">Control</span></h1>
                                <p className="text-gray-500 font-bold">Gestiona tus eventos publicados y monitorea inscripciones.</p>
                            </div>
                        </header>

                        {myEvents.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-[32px] p-16 text-center flex flex-col items-center">
                                <CalendarDays className="text-gray-300 mb-4" size={48} />
                                <h3 className="text-xl font-black text-athos-black mb-2">Aún no tienes eventos</h3>
                                <p className="text-gray-500 font-medium mb-6">Empieza publicando tu primera carrera para atraer a miles de corredores.</p>
                                <button onClick={() => setActiveTab('crear')} className="bg-athos-black text-white px-8 py-3 rounded-xl font-black uppercase text-sm hover:bg-athos-orange transition-colors">Publicar Carrera</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {myEvents.map(evt => {
                                    const percentFilled = evt.maxParticipants ? Math.round(((evt.currentParticipants || 0) / evt.maxParticipants) * 100) : 0;
                                    return (
                                        <div key={evt.id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                            <div className="h-32 bg-gray-100 relative overflow-hidden">
                                                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px - 3 py - 1 bg - white / 90 backdrop - blur text - [10px] font - black uppercase tracking - widest rounded - lg ${evt.status === 'upcoming' ? 'text-green-600' : 'text-gray-500'} `}>
                                                        {evt.status === 'upcoming' ? 'Activo' : 'Finalizado'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-black text-lg text-athos-black truncate mb-1">{evt.title}</h3>
                                                <p className="text-xs text-gray-500 font-bold mb-4 flex items-center gap-1"><CalendarDays size={14} /> {new Date(evt.date).toLocaleDateString()} • {evt.city}</p>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm font-bold">
                                                        <span className="text-gray-600">Inscritos</span>
                                                        <span className="text-athos-black">{evt.currentParticipants} / {evt.maxParticipants || '∞'}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-athos-orange h-full rounded-full transition-all" style={{ width: `${percentFilled}% ` }}></div>
                                                    </div>
                                                </div>

                                                <div className="mt-6 flex justify-between items-center border-t border-gray-50 pt-4">
                                                    <span className="text-sm font-black text-gray-400 capitalize">${evt.price.toLocaleString('es-CO')} COP</span>
                                                    <button onClick={() => { setView('event-detail'); /* Idealmente pasar el ID, pero en este mock setView no recibe args paramétricos directamente sin alterar App.tsx asumiendo simplificación */ }} className="text-athos-orange font-bold text-sm uppercase hover:text-orange-600">Ver Página &rarr;</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <header className="mb-8 border-b border-gray-100 pb-4">
                            <h1 className="text-3xl font-black italic text-athos-black uppercase tracking-tight">Publicar <span className="text-athos-orange">Carrera</span></h1>
                            <p className="text-gray-500 font-bold">Llena los detalles para anunciar tu evento a la comunidad Athos.</p>
                        </header>

                        {showSuccess ? (
                            <div className="bg-green-50 text-green-700 p-8 rounded-[32px] text-center border border-green-200 animate-slide-up">
                                <CheckCircle2 size={48} className="mx-auto mb-4" />
                                <h3 className="text-2xl font-black italic uppercase mb-2">¡Evento Creado!</h3>
                                <p className="font-medium">Tu carrera ha sido publicada y ahora está visible en el directorio oficial.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nombre del Evento *</label>
                                    <input
                                        type="text" required placeholder="E.g. Media Maratón de Los Andes"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><CalendarDays size={14} /> Fecha y Hora *</label>
                                        <input
                                            type="datetime-local" required
                                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><MapPin size={14} /> Ciudad del Evento *</label>
                                        <select
                                            value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        >
                                            <option>Bogotá</option>
                                            <option>Medellín</option>
                                            <option>Cali</option>
                                            <option>Cartagena</option>
                                            <option>Barranquilla</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lugar de Salida (Dirección/Referencia) *</label>
                                        <input
                                            type="text" required placeholder="E.g. Plaza de Bolívar"
                                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Coins size={14} /> Precio (COP) *</label>
                                        <input
                                            type="number" required placeholder="120000" min="0" step="1000"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Distancias (Comas) *</label>
                                        <input
                                            type="text" required placeholder="5K, 10K, 21K"
                                            value={formData.distances} onChange={e => setFormData({ ...formData, distances: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><Users size={14} /> Cupos Máximos</label>
                                        <input
                                            type="number" placeholder="Dejar vacío si no hay límite" min="1"
                                            value={formData.maxParticipants} onChange={e => setFormData({ ...formData, maxParticipants: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Descripción del Evento *</label>
                                    <textarea
                                        required rows={4} placeholder="Describe qué incluye el kit, altimetría, horarios, reglas..."
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none resize-none"
                                    ></textarea>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Externa del Evento (Opcional)</label>
                                    <input
                                        type="url"
                                        placeholder="E.g. https://www.maratonmedellin.com"
                                        value={formData.externalUrl} onChange={e => setFormData({ ...formData, externalUrl: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-athos-black font-bold p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1"><ImageIcon size={14} /> URL Imagen de Portada</label>
                                    <input
                                        type="url" placeholder="https://..."
                                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 text-gray-500 text-sm p-4 rounded-2xl focus:ring-2 focus:ring-athos-orange/20 outline-none"
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('mis-eventos')}
                                        className="px-8 py-4 rounded-2xl text-gray-500 font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`bg - athos - black text - white px - 10 py - 4 rounded - 2xl font - black uppercase tracking - widest flex items - center gap - 2 transition - all ${isSubmitting ? 'opacity-70' : 'hover:bg-athos-orange glow-effect'} `}
                                    >
                                        {isSubmitting ? 'Publicando...' : 'Lanzar Evento'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
