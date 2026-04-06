import React, { useEffect } from 'react';
import { useApp } from '../context';
import { Search, Apple, Play } from 'lucide-react';

export const ZonaRunning = () => {
  const { setView } = useApp();

  // Ocultar Navbar y Footer si es posible, o dejarlos convivir (aquí rediseñamos un navbar local).
  // Si queremos ocultar Navbar principal, tendríamos que manejar estado en el context o usar CSS, 
  // pero como el usuario pidió el diseño de Naxos, esta sección estará por debajo del navbar 
  // global o se sobrepondrá si la Navbar global es sticky de Athos.
  // Como no podemos cambiar App.tsx tan dinámicamente sin más info, lo armaremos 
  // asegurando que se vea bien integrado.

  useEffect(() => {
    // Si queremos el scroll arriba al montar
    window.scrollTo(0, 0);
  }, []);

  // Categorías remividas por ahora

  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden bg-athos-orange">
      {/* Background Image completely independent and transparent */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('/pexels-runffwpu-10417360.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 75%',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
      
      {/* Content wrapper relative to stay above the overlay */}
      <div className="relative z-10">
      {/* Naxos-style local Navigation (opcional si la global interfiere, pero lo ponemos para replicar) */}
      <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-6 md:px-12 xl:px-24">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = '/?view=home'}>
          <img src="/Zonarunning logo.png" alt="Logo Zona Running" className="h-10 md:h-14 w-auto object-contain brightness-0 invert" />
        </div>
        
        {/* Links Naxos style integrating Athos store views */}
        <div className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <a href="/?view=home" className="hover:text-black transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-white pb-1">Inicio</a>
          <a href="/?view=events" className="hover:text-black/70 transition-colors pb-1">Eventos</a>
          <a href="/?view=shop" className="hover:text-black/70 transition-colors pb-1">Tienda</a>
          <a href="/?view=size-guide" className="hover:text-black/70 transition-colors pb-1">Guía de Tallas</a>
          <a href="/?view=support" className="hover:text-black/70 transition-colors pb-1">FAQ</a>
          <a href="/?view=profile" className="hover:text-black/70 transition-colors pb-1">Mi Cuenta</a>
          <a href="/?view=cart" className="hover:text-black/70 transition-colors pb-1">Carrito</a>
          <button onClick={() => window.location.href = '/?view=shop'} className="hover:text-black/70"><Search size={20} /></button>
        </div>
      </nav>

      {/* Main Hero Layout */}
      <div className="relative pt-32 pb-64 lg:pt-48 lg:pb-80 px-6 md:px-12 xl:px-24 flex flex-col lg:flex-row items-center justify-between z-10 w-full max-w-7xl mx-auto">
        
        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 z-20 text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-md">
            Desata tu <br/>Potencial
          </h1>
          <p className="text-lg lg:text-xl max-w-lg opacity-95 leading-relaxed mx-auto lg:mx-0">
            Descubre <strong className="font-bold">Zona Running</strong>, la app gamificada que transforma tu forma de correr. Motívate compitiendo con otros corredores de tu ciudad, consigue logros increíbles y conquista áreas a nivel nacional mientras mejoras tu estado físico en la vida real.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
            <button className="group flex items-center gap-3 bg-transparent border border-white/40 hover:bg-white hover:text-athos-orange transition-all px-6 py-3 rounded-lg w-full sm:w-auto">
              <Play size={24} className="group-hover:fill-current" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold opacity-80 tracking-wide">Disponible en</div>
                <div className="font-semibold text-sm leading-none mt-0.5">Google Play</div>
              </div>
            </button>
            <button className="group flex items-center gap-3 bg-transparent border border-white/40 hover:bg-white hover:text-athos-orange transition-all px-6 py-3 rounded-lg w-full sm:w-auto">
              <Apple size={24} className="group-hover:fill-current" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold opacity-80 tracking-wide">Descargar en</div>
                <div className="font-semibold text-sm leading-none mt-0.5">App Store</div>
              </div>
            </button>
          </div>
        </div>

        {/* Phones Section */}
        <div className="w-full lg:w-1/2 relative mt-20 lg:mt-0 h-[400px] lg:h-[600px] flex items-center justify-center">
          
          {/* Phone 1 (Back/Left) */}
          <div className="absolute right-[40%] lg:right-[45%] top-[10%] lg:top-[5%] w-[220px] lg:w-[280px] h-[450px] lg:h-[580px] bg-black rounded-[40px] border-[10px] sm:border-[12px] border-black shadow-2xl transform -rotate-12 scale-90 lg:scale-100 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 transition-transform hover:-translate-y-2 hover:-rotate-6 duration-500">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-20"></div>
            {/* Screen Content - User provided Screenshot 2 */}
            <img 
              src="/screen1.png?v=2" 
              alt="Zona Running Screen" 
              className="w-full h-full object-cover rounded-[30px]"
              onError={(e) => {
                // Fallback placeholder si la imagen no está presente (instrucción para el usuario)
                e.currentTarget.src = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>

          {/* Phone 2 (Front/Right) */}
          <div className="absolute right-[5%] lg:-right-[5%] top-[15%] lg:top-[10%] w-[240px] lg:w-[300px] h-[480px] lg:h-[620px] bg-black rounded-[40px] border-[12px] sm:border-[14px] border-black shadow-[0_30px_60px_rgba(0,0,0,0.6)] transform rotate-6 overflow-hidden z-20 transition-transform hover:-translate-y-4 hover:rotate-12 duration-500">
             {/* Notch */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-xl z-20"></div>
            {/* Screen Content - User provided Screenshot 1 */}
            <img 
              src="/screen.png?v=2" 
              alt="Zona Running Screen" 
              className="w-full h-full flex-grow object-cover rounded-[30px]"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1526506484393-51829e5aedd5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>

        </div>

      </div>

      {/* SVG Wave Bottom Divider */}
      <div className="absolute bottom-[-1px] left-0 w-full z-20">
        <svg viewBox="0 0 1440 320" className="w-full block" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L60,202.7C120,181,240,139,360,138.7C480,139,600,181,720,186.7C840,192,960,160,1080,138.7C1200,117,1320,107,1380,101.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Required white floor below wave to ensure it looks cutoff without scrolling past it */}
      <div className="relative bg-white h-6 w-full z-10"></div>
      
      </div>

    </div>
  );
};
