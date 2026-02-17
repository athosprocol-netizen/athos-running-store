import React, { useState } from 'react';
import { CHALLENGES } from '../constants';
import { useApp } from '../context';
import { Trophy, Users, Clock, ArrowRight, CheckCircle, MapPin, Activity, Mountain, TrendingUp, Filter } from 'lucide-react';

export const Challenges = () => {
  const { joinChallenge, user, setView } = useApp();
  const [filter, setFilter] = useState<'All' | 'Road' | 'Trail'>('All');
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);

  const activeChallenge = user?.activeChallengeId 
    ? CHALLENGES.find(c => c.id === user.activeChallengeId) 
    : null;

  const visibleChallenges = CHALLENGES.filter(c => 
    filter === 'All' ? true : c.type === filter
  );

  const handleSync = () => {
      setIsSimulatingSync(true);
      setTimeout(() => {
          setIsSimulatingSync(false);
          alert("¡Actividad sincronizada!");
      }, 2000);
  };

  return (
    <div className="pt-24 pb-24 px-4 md:px-8 max-w-6xl mx-auto min-h-screen bg-white animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-athos-black mb-2 uppercase">
                    RETOS <span className="text-athos-orange">COLOMBIA</span>
                </h1>
                <p className="text-lg text-gray-400 font-medium">
                    Supera tus límites geográficos.
                </p>
            </div>
        </div>

        {/* ACTIVE CHALLENGE DASHBOARD (Rounded) */}
        {user && activeChallenge && (
            <div className="mb-12">
                <div className="bg-athos-black text-white rounded-[40px] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 w-2/3 h-full opacity-30 mix-blend-overlay">
                         <img src={activeChallenge.image} className="w-full h-full object-cover grayscale" />
                    </div>
                    
                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row gap-12">
                        <div className="flex-grow">
                             <div className="flex items-center gap-2 mb-4">
                                <span className="bg-athos-orange text-white text-[10px] font-bold px-3 py-1 uppercase rounded-full animate-pulse">
                                    En Curso
                                </span>
                             </div>
                             <h2 className="text-3xl md:text-5xl font-black italic mb-6 uppercase tracking-tight leading-none">
                                {activeChallenge.title}
                             </h2>
                             
                             {/* Stats Pills */}
                             <div className="flex flex-wrap gap-4 mb-8">
                                 <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-2xl">
                                     <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Objetivo</p>
                                     <p className="text-lg font-bold">{activeChallenge.goal}</p>
                                 </div>
                                 <div className="bg-white/10 backdrop-blur px-4 py-3 rounded-2xl">
                                     <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Progreso</p>
                                     <p className="text-lg font-bold text-athos-orange">65%</p>
                                 </div>
                             </div>

                             {/* Round Progress Bar */}
                             <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-8">
                                 <div className="h-full bg-athos-orange w-[65%] rounded-full relative"></div>
                             </div>

                             <button 
                                onClick={handleSync}
                                className="bg-white text-athos-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                             >
                                {isSimulatingSync ? '...' : 'Sincronizar'} <Activity size={14} />
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* FILTERS (Capsules) */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
            {['All', 'Road', 'Trail'].map(f => (
                <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${
                        filter === f 
                        ? 'bg-athos-black text-white border-athos-black' 
                        : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                    }`}
                >
                    {f === 'All' ? 'Todos' : f === 'Road' ? 'Asfalto' : 'Montaña'}
                </button>
            ))}
        </div>

        {/* CHALLENGE GRID (Rounded Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleChallenges.map((challenge) => {
                const isJoined = user?.activeChallengeId === challenge.id;
                
                return (
                    <div key={challenge.id} className="bg-[#F4F4F4] rounded-[30px] p-3 flex flex-col group hover:bg-gray-200 transition-colors">
                        <div className="aspect-video relative overflow-hidden rounded-[24px] mb-4 bg-white">
                            <img src={challenge.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur text-athos-black px-3 py-1 text-[10px] font-bold uppercase rounded-full flex items-center gap-1">
                                    {challenge.type === 'Trail' ? <Mountain size={10}/> : <TrendingUp size={10}/>} {challenge.type}
                                </span>
                            </div>
                        </div>
                        
                        <div className="px-2 pb-2 flex flex-col flex-grow">
                            <h3 className="text-xl font-black italic text-athos-black uppercase leading-none mb-2">{challenge.title}</h3>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                                <MapPin size={12} className="text-athos-orange"/> {challenge.location}
                            </p>
                            
                            <div className="mt-auto pt-3 border-t border-gray-300/50 flex justify-between items-center">
                                <div className="text-xs font-bold text-gray-500">
                                    <span className="block text-[10px] text-gray-400 uppercase">Meta</span>
                                    {challenge.goal}
                                </div>
                                <button 
                                    onClick={() => !isJoined && joinChallenge(challenge.id)}
                                    disabled={isJoined}
                                    className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-wide transition-all ${
                                        isJoined 
                                        ? 'bg-green-500 text-white'
                                        : 'bg-athos-black text-white group-hover:bg-athos-orange'
                                    }`}
                                >
                                    {isJoined ? 'Inscrito' : 'Unirme'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};