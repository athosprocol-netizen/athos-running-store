import React from 'react';
import { BLOG_POSTS } from '../constants';
import { Clock, ChevronRight, BookOpen } from 'lucide-react';

export const Academy = () => {
  return (
    <div className="pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen bg-athos-bg">
        <div className="mb-12 border-b border-athos-border pb-8">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-athos-black mb-4">ACADEMIA <span className="text-athos-orange">ATHOS</span></h1>
            <p className="text-xl text-gray-500 max-w-2xl">Consejos de expertos, planes de entrenamiento y guías de equipo para ayudarte a romper tu próxima marca.</p>
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-12 overflow-x-auto hide-scrollbar">
            {['Todo', 'Planes de Entrenamiento', 'Guías de Equipo', 'Nutrición', 'Recuperación'].map(cat => (
                <button key={cat} className="px-6 py-3 bg-white border border-athos-border text-sm font-bold uppercase tracking-wider hover:border-black transition-colors whitespace-nowrap">
                    {cat}
                </button>
            ))}
        </div>

        {/* Featured Article - Magazine Style */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="aspect-[4/3] overflow-hidden relative group cursor-pointer shadow-xl">
                <img src="https://images.unsplash.com/photo-1552674605-469536d07f40?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-athos-orange font-bold uppercase tracking-widest text-xs mb-4">Entrenamiento Destacado</span>
                <h2 className="text-4xl font-black italic text-athos-black mb-6 leading-tight hover:text-athos-orange cursor-pointer transition-colors">
                    DOMINANDO EL <br/>TAPER DEL MARATÓN.
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Las últimas 3 semanas son críticas. Aprende cómo eliminar la fatiga sin perder condición física. 
                    Incluye un cronograma descargable para los últimos 21 días.
                </p>
                <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1 w-max hover:text-athos-orange hover:border-athos-orange transition-colors">
                    Leer Artículo <ChevronRight size={14}/>
                </button>
            </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post, idx) => (
                <div key={idx} className="group cursor-pointer flex flex-col h-full">
                    <div className="aspect-video bg-gray-200 overflow-hidden mb-6 relative">
                         <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0" />
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold uppercase text-gray-400 mb-3">
                        <span className="text-athos-orange">{post.category}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-athos-black group-hover:text-athos-orange transition-colors mb-3 leading-tight">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                    <div className="mt-auto pt-4 border-t border-athos-border">
                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-black">Leer <ChevronRight size={10}/></span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};