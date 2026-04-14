import React, { useEffect } from 'react';
import { useApp } from '../context';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BRANDS = [
  {
    id: 'tanuki-den',
    name: 'Tanuki Den',
    logo: '/Tanuki Den LOGO.png',
    description: 'La comunidad exclusiva donde la gamificación y el espíritu de equipo llevan tu carrera al siguiente nivel.',
    tag: 'Social & Clanes',
    color: 'from-amber-100 to-orange-50'
  },
  {
    id: 'kimezu',
    name: 'Kimezu',
    logo: '/KIMEZU LOGO.png',
    description: 'Innovación en recuperación y bienestar para mantenerte siempre en movimiento con la mejor tecnología.',
    tag: 'Salud & Bienestar',
    color: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'emedical',
    name: 'E-Medical',
    logo: '/EMEDICAL LOGO.png',
    description: 'Expertos en equipamiento médico deportivo, garantizando que cada paso que des sea seguro.',
    tag: 'Equipamiento Médico',
    color: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'zonarunning',
    name: 'Zona Running',
    logo: '/Zonarunning logo.png',
    description: 'Conquista tu ciudad barrio a barrio. La plataforma líder en desafíos territoriales y estrategia.',
    tag: 'Estrategia & Mapas',
    color: 'from-gray-100 to-gray-50'
  },
  {
    id: 'athosrun',
    name: 'Athos Run',
    logo: '/ATHOSLOGO1.png',
    description: 'Personalización 3D y productos de élite diseñados por y para corredores apasionados.',
    tag: 'Tienda Oficial',
    color: 'from-orange-100 to-red-50'
  }
];

export const Marcas = () => {
  const { setView } = useApp();

  useEffect(() => {
    // SEO: Update Title and Meta
    document.title = "Nuestras Marcas | ATHOS Running Store";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content');
    
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Conoce nuestra red de marcas aliadas y proyectos asociados: Tanuki Den, Kimezu, E-Medical, Zona Running y Athos Run. La élite del running en Colombia.');
    }

    window.scrollTo(0, 0);

    return () => {
      // Restore original description if needed, or leave as is for dynamic routing
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  return (
    <article className="min-h-screen bg-athos-bg animate-fade-in flex flex-col items-center">
      {/* Hero Section / Header */}
      <section className="w-full max-w-[1400px] px-6 py-12 md:py-24 text-center">
        <div className="mb-6 flex justify-center">
          <span className="bg-[#FAF7F2] text-athos-black font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs px-6 py-2 rounded-full border border-[#EDE8E0] shadow-sm">
            Aliados Tanuki Den
          </span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter mb-4 uppercase text-athos-black">
          Nuestras <span className="text-athos-orange">Marcas</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 md:gap-8 max-w-2xl mx-auto">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-athos-orange/30"></div>
          <p className="text-[10px] md:text-sm font-bold text-athos-muted uppercase tracking-widest whitespace-nowrap">
            Conoce nuestra red de proyectos y tiendas asociadas
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-athos-orange/30"></div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="w-full max-w-[1400px] px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {BRANDS.map((brand) => (
            <div 
              key={brand.id}
              className="group relative bg-white border border-athos-border rounded-[32px] p-8 flex flex-col items-center justify-between transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                {/* Brand Logo Container */}
                <div className="w-full aspect-[16/9] flex items-center justify-center mb-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white transition-all group-hover:scale-105">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} Logo - Aliado de ATHOS`} 
                    className="max-w-[80%] max-h-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>

                {/* Info */}
                <span className="text-[10px] font-black uppercase tracking-widest text-athos-orange mb-2 block">
                  {brand.tag}
                </span>
                <h3 className="text-xl font-black italic uppercase text-athos-black mb-3">
                  {brand.name}
                </h3>
                <p className="text-xs text-athos-muted font-medium text-center leading-relaxed">
                  {brand.description}
                </p>
              </div>

              {/* Action */}
              <button className="relative z-10 mt-8 w-12 h-12 bg-athos-black rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:bg-athos-orange group-hover:scale-110 shadow-lg">
                <ArrowRight size={20} />
              </button>
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-athos-orange/20 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="w-full bg-athos-black py-20 px-6 mt-auto overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-athos-orange/10 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black italic text-white uppercase mb-6 leading-none">
            ¿Quieres ser parte de nuestra <span className="text-athos-orange">red?</span>
          </h2>
          <p className="text-gray-400 font-bold mb-10 max-w-2xl mx-auto text-sm md:text-base">
            Buscamos proyectos apasionados por el running que quieran crecer junto al ecosistema más completo de Colombia.
          </p>
          <button 
            onClick={() => setView('support')}
            className="bg-athos-orange text-white font-black uppercase tracking-[0.2em] px-10 py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,77,0,0.3)] hover:bg-white hover:text-athos-orange transition-all duration-300 transform hover:-translate-y-1 active:scale-95"
          >
            Contáctanos Ahora
          </button>
        </div>
      </section>
    </article>
  );
};
