import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Calendar, MapPin, Search, ChevronRight } from 'lucide-react';

export const EventsDirectory = () => {
    const { events, selectEvent } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const upcomingEvents = events
        .filter(e => e.status === 'upcoming' && e.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const pastEvents = events
        .filter(e => e.status === 'past' && e.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- CALENDAR LOGIC ---
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDayEvents, setSelectedDayEvents] = useState<any[] | null>(null);

    // Reset day events list if month changes
    useEffect(() => {
        setSelectedDayEvents(null);
    }, [currentMonth]);

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        const days = [];
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(e => {
            const d = new Date(e.date);
            return d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
        });
    };

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

            {/* Interactive Calendar Section */}
            <section className="mb-16 bg-white p-8 md:p-12 rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row gap-12">

                {/* Calendar Grid */}
                <div className="w-full lg:w-1/2">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar size={28} className="text-athos-orange" />
                        <h2 className="text-3xl font-black italic text-athos-black uppercase">Calendario</h2>
                    </div>

                    {/* Month Selector */}
                    <div className="flex justify-between items-center mb-6 px-4 py-3 bg-gray-50 rounded-2xl">
                        <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all text-athos-black hover:text-athos-orange"><ChevronRight size={24} className="rotate-180" /></button>
                        <span className="font-black text-lg uppercase tracking-widest text-athos-black">
                            {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-gray-200 transition-all text-athos-black hover:text-athos-orange"><ChevronRight size={24} /></button>
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2 mb-2 text-center pb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                            <div key={i} className="text-xs font-black text-gray-400 uppercase">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {generateCalendarDays().map((day, idx) => {
                            if (!day) return <div key={idx} className="p-3" />;
                            const dayEvents = getEventsForDay(day);
                            const isCurr = isToday(day);
                            const hasEvents = dayEvents.length > 0;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        if (hasEvents) {
                                            if (dayEvents.length === 1) {
                                                selectEvent(dayEvents[0].id);
                                            } else {
                                                setSelectedDayEvents(dayEvents);
                                            }
                                        }
                                    }}
                                    className={`p-3 w-full aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all ${isCurr ? 'bg-athos-black text-white shadow-lg' :
                                        hasEvents ? 'bg-athos-orange/10 text-athos-black font-bold border border-athos-orange/30 hover:bg-athos-orange/20 hover:-translate-y-1' :
                                            'text-gray-500 hover:bg-gray-50 border border-gray-100 hover:border-gray-300'
                                        }`}
                                >
                                    <span className={`text-base tracking-tighter ${isCurr || hasEvents ? 'font-black' : 'font-medium'}`}>{day.getDate()}</span>
                                    {hasEvents && (
                                        <div className="absolute bottom-2 w-2 h-2 rounded-full bg-athos-orange animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Event List aside */}
                <div className="w-full lg:w-1/2 bg-gray-50 rounded-[32px] p-8 border border-gray-100">
                    <div className="h-full max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedDayEvents ? (
                            <>
                                <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-10 py-2">
                                    <h4 className="text-lg font-black text-athos-orange uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                                        Eventos del {new Date(selectedDayEvents[0].date).getDate()}
                                    </h4>
                                    <button onClick={() => setSelectedDayEvents(null)} className="text-xs font-bold text-gray-500 hover:text-athos-black underline">Volver al mes</button>
                                </div>
                                <div className="space-y-4">
                                    {selectedDayEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
                                        <div
                                            key={e.id}
                                            onClick={() => selectEvent(e.id)}
                                            className="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer hover:bg-athos-orange/10 transition-colors border border-gray-100 hover:border-athos-orange/30 shadow-sm hover:shadow-md hover:-translate-y-1"
                                        >
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-gray-200">
                                                <span className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">
                                                    {new Date(e.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}
                                                </span>
                                                <span className="text-2xl font-black text-athos-orange leading-none">{new Date(e.date).getDate()}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="font-bold text-base text-athos-black line-clamp-1">{e.title}</h5>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1"><MapPin size={14} className="text-athos-orange" /> {e.city}</p>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-300 group-hover:text-athos-orange" />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-6 sticky top-0 bg-gray-50 z-10 py-2">
                                    <div className="w-1.5 h-6 bg-gray-400 rounded-full"></div>
                                    <h4 className="text-lg font-black text-gray-500 uppercase tracking-widest">Eventos del Mes</h4>
                                </div>
                                <div className="space-y-4">
                                    {events.filter(e => {
                                        const d = new Date(e.date);
                                        return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
                                    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
                                        <div
                                            key={e.id}
                                            onClick={() => selectEvent(e.id)}
                                            className="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer hover:bg-athos-orange/10 transition-colors border border-gray-100 hover:border-athos-orange/30 shadow-sm hover:shadow-md hover:-translate-y-1 group"
                                        >
                                            <div className="w-16 h-16 bg-gray-50 rounded-xl flex flex-col items-center justify-center flex-shrink-0 border border-gray-200 group-hover:border-athos-orange/30 transition-colors">
                                                <span className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">
                                                    {new Date(e.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}
                                                </span>
                                                <span className="text-2xl font-black text-athos-orange leading-none">{new Date(e.date).getDate()}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="font-bold text-base text-athos-black line-clamp-1">{e.title}</h5>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mt-1"><MapPin size={14} className="text-athos-orange" /> {e.city}</p>
                                            </div>
                                            <ChevronRight size={20} className="text-gray-300 group-hover:text-athos-orange transition-colors" />
                                        </div>
                                    ))}
                                    {events.filter(e => {
                                        const d = new Date(e.date);
                                        return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
                                    }).length === 0 && (
                                            <div className="text-center text-sm text-gray-400 py-12 px-6 font-medium italic border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                                                No hay competiciones agendadas para este mes. Explora otros meses en el calendario.
                                            </div>
                                        )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
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
