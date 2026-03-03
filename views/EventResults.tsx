import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Search, Trophy, Medal, Flag, ArrowLeft } from 'lucide-react';

export const EventResults = () => {
    const { events, results, selectedEventId, setView } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDistance, setActiveDistance] = useState<string>('all');

    const event = events.find(e => e.id === selectedEventId);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (!event || event.status !== 'past') {
            // Si no hay evento seleccionado o no es un evento pasado, volver al directorio
            setView('events');
        }
    }, [event, setView]);

    if (!event) return null;

    // Filter results for this specific event
    const eventResults = results.filter(r => r.eventId === event.id);

    // Available distances for this event's results
    const distancesWithResults = Array.from(new Set(eventResults.map(r => r.distance)));

    // Apply search and distance filters
    const filteredResults = eventResults
        .filter(r => activeDistance === 'all' || r.distance === activeDistance)
        .filter(r =>
            r.runnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.bibNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Sort by absolute rank, or overall position, then by chip time string comparison
            if (a.overallPosition && b.overallPosition) return a.overallPosition - b.overallPosition;
            return a.chipTime.localeCompare(b.chipTime);
        });

    const getRankTrophy = (position: number) => {
        if (position === 1) return <Trophy className="text-yellow-500" size={20} />;
        if (position === 2) return <Medal className="text-gray-400" size={20} />;
        if (position === 3) return <Medal className="text-amber-600" size={20} />;
        return <span className="text-gray-500 font-bold ml-1">{position}</span>;
    };

    return (
        <div className="pt-24 pb-20 px-6 max-w-[1200px] mx-auto min-h-screen animate-fade-in">
            {/* Header Area */}
            <div className="mb-10 flex flex-col items-center text-center relative">
                <button
                    onClick={() => setView('event-detail')}
                    className="absolute left-0 top-0 text-gray-400 hover:text-athos-orange transition-colors hidden md:flex items-center gap-2"
                >
                    <ArrowLeft size={20} /> <span className="font-bold text-sm uppercase">Detalle</span>
                </button>

                <div className="w-20 h-20 bg-athos-black rounded-[24px] flex items-center justify-center mb-6 shadow-xl rotate-3">
                    <Flag className="text-athos-orange" size={36} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black italic text-athos-black uppercase tracking-tighter mb-2">
                    Clasificación <span className="text-athos-orange">Oficial</span>
                </h1>
                <p className="text-gray-500 font-bold font-sans text-lg">{event.title}</p>
            </div>

            {/* Controls Bar */}
            <div className="bg-white p-4 md:p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center mb-10">

                {/* Distance Filter */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto hide-scrollbar">
                    <button
                        onClick={() => setActiveDistance('all')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeDistance === 'all' ? 'bg-athos-black text-white shadow-md' : 'text-gray-500 hover:text-athos-black'}`}
                    >
                        General
                    </button>
                    {distancesWithResults.map(dist => (
                        <button
                            key={dist}
                            onClick={() => setActiveDistance(dist)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all ${activeDistance === dist ? 'bg-athos-black text-white shadow-md' : 'text-gray-500 hover:text-athos-black'}`}
                        >
                            {dist}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Dorsal o Apellido..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-athos-orange/30 text-sm font-bold text-athos-black outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-widest">
                                <th className="p-6 w-20 text-center">Pos</th>
                                <th className="p-6">Corredor</th>
                                <th className="p-6 hidden md:table-cell">Distancia</th>
                                <th className="p-6 hidden sm:table-cell">Categoría</th>
                                <th className="p-6 text-right">Tiempo Oficial</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((result, idx) => (
                                    <tr key={result.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-6 text-center align-middle">
                                            <div className="flex justify-center items-center h-full">
                                                {getRankTrophy(result.overallPosition || idx + 1)}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-orange-100 group-hover:text-athos-orange transition-colors">
                                                    #{result.bibNumber}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-athos-black leading-tight uppercase">{result.runnerName}</h4>
                                                    {result.teamName && <p className="text-xs text-gray-500 font-bold">{result.teamName}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 hidden md:table-cell">
                                            <span className="font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-lg text-sm">{result.distance}</span>
                                        </td>
                                        <td className="p-6 hidden sm:table-cell">
                                            <span className="font-bold text-gray-500 text-sm">{result.categoryName || 'General'}</span>
                                            {result.categoryPosition && <span className="ml-2 text-xs text-athos-orange font-black">({result.categoryPosition})</span>}
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="font-black italic text-xl text-athos-black tracking-tight">{result.chipTime}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-gray-400 font-medium italic">
                                        No se encontraron resultados para la búsqueda actual.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Photos Link Footer */}
            {event.photosLink && (
                <div className="mt-12 text-center flex flex-col items-center">
                    <p className="text-sm font-bold text-gray-500 mb-4">¿Buscas tus fotos en alta resolución?</p>
                    <a
                        href={event.photosLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-athos-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-athos-orange transition-colors glow-effect shadow-lg"
                    >
                        Ver Galería Completa
                    </a>
                </div>
            )}
        </div>
    );
};
