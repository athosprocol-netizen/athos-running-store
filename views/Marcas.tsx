import React, { useEffect } from 'react';
import { useApp } from '../context';
import { ChevronRight, ArrowRight } from 'lucide-react';

const BRANDS = [
  {
    id: 'tanuki-den',
    name: 'Tanuki Den',
    logo: '/Tanuki Den LOGO.png',
    url: 'https://tanukiden.com',
    color: 'from-amber-100 to-orange-50'
  },
  {
    id: 'kimezu',
    name: 'Kimezu',
    logo: '/KIMEZU LOGO.png',
    url: 'https://kimezu.com',
    color: 'from-blue-50 to-indigo-50'
  },
  {
    id: 'emedical',
    name: 'E-Medical',
    logo: '/EMEDICAL LOGO.png',
    url: 'https://emedical.com.co',
    color: 'from-emerald-50 to-teal-50'
  },
  {
    id: 'zonarunning',
    name: 'Zona Running',
    logo: '/Zonarunning logo.png',
    url: 'https://zonarunning.com',
    color: 'from-gray-100 to-gray-50'
  },
  {
    id: 'athosrun',
    name: 'Athos Run',
    logo: '/ATHOSLOGO1.png',
    url: 'https://athosrun.co',
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
            <a 
              key={brand.id}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white border border-athos-border rounded-[32px] p-8 aspect-square flex flex-col items-center justify-center transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 w-full flex flex-col items-center">
                {/* Brand Logo Container */}
                <div className="w-full flex items-center justify-center transition-all group-hover:scale-110">
                  <img 
                    src={brand.logo} 
                    alt={`${brand.name} Logo - Aliado de ATHOS`} 
                    className="max-w-full max-h-[120px] object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
              
              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-athos-orange/20 transition-all duration-500"></div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="w-full py-20 px-6 mt-auto overflow-hidden relative bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-athos-orange/5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black italic text-athos-black uppercase mb-6 leading-none">
            ¿quieres ser parte de <span className="text-athos-orange">nosotros?</span>
          </h2>
          <p className="text-athos-muted font-bold mb-10 max-w-2xl mx-auto text-sm md:text-base">
            Ayúdanos a crecer y haz parte de nuestro grupo de proyectos en Colombia.
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
