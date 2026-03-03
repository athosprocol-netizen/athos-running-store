import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Search, Filter, Star, Heart, ArrowRight, Flame, Shirt, Footprints, Trophy, Zap } from 'lucide-react';

export const Home = () => {
    const { setView, selectProduct, products, events, selectEvent, toggleWishlist, user, setSearchQuery, setActiveCategory } = useApp();
    const displayProducts = products;

    // DRAGGABLE LOGIC REFS & STATE
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDown, setIsDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isDragging, setIsDragging] = useState(false); // To distinguish click from drag

    const categories = [
        { id: 'shoes', label: 'Calzado', icon: Footprints },
        { id: 'apparel', label: 'Ropa', icon: Shirt },
        { id: 'accessories', label: 'Geles', icon: Zap },
    ];

    // DRAG HANDLERS
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        setIsDown(true);
        setIsDragging(false);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDown(false);
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDown(false);
        // setTimeout to clear dragging state after the click event phase
        setTimeout(() => setIsDragging(false), 50);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown || !sliderRef.current) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 3; // Scroll-fastness
        sliderRef.current.scrollLeft = scrollLeft - walk;

        // If moved significantly, mark as dragging to prevent click events
        if (Math.abs(x - startX) > 5) {
            setIsDragging(true);
        }
    };

    // Wrapper for click events that checks if we were dragging
    const handleItemClick = (action: () => void) => {
        if (!isDragging) {
            action();
        }
    };

    const handleMobileSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setView('shop');
        }
    }

    return (
        <div className="min-h-screen bg-transparent pb-24 md:pb-0 animate-fade-in flex flex-col items-center">

            {/* 1. SEARCH BAR SECTION (Mobile Only) */}
            <div className="pt-4 px-6 pb-2 w-full max-w-[1400px] bg-transparent z-30 md:hidden">
                <h1 className="text-2xl font-black italic text-athos-black mb-4 uppercase">
                    Hola, <span className="text-athos-orange">{user?.name.split(' ')[0] || 'Runner'}</span>
                </h1>
                <div className="relative shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-athos-black" size={20} strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="¿Qué estás buscando?"
                        className="w-full pl-12 pr-12 py-4 rounded-2xl border-none bg-gray-50 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-athos-orange/20 placeholder:text-gray-400"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleMobileSearch}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-athos-black p-2 rounded-xl text-white hover:bg-athos-orange transition-colors">
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            {/* Hero Spacer */}
            <div className="hidden md:block h-6"></div>

            <div className="max-w-[1400px] mx-auto md:px-10">

                {/* 2. HERO CAROUSEL (DRAGGABLE) */}
                <div className="mt-2 px-6 md:px-0">
                    <div
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={`w-full overflow-x-auto hide-scrollbar flex gap-4 md:gap-6 ${isDown ? 'cursor-grabbing' : 'cursor-grab'} px-0.5`}
                    >
                        {events.filter(e => e.status === 'upcoming').slice(0, 3).map((event, index) => (
                            <div
                                key={event.id}
                                className="shrink-0 w-[82vw] md:w-[850px] relative select-none"
                                onClick={() => handleItemClick(() => selectEvent(event.id))}
                            >
                                <div className={`${index % 2 === 0 ? 'bg-athos-black' : 'bg-gray-100'} rounded-[24px] md:rounded-[40px] p-5 md:p-14 h-[150px] md:h-[450px] relative overflow-hidden flex items-center shadow-xl shadow-athos-black/20 group transition-transform active:scale-[0.99] border hover:shadow-[0_0_20px_rgba(255,77,0,0.1)] hover:border-athos-orange/30 ${index % 2 !== 0 ? 'border-gray-200' : 'border-transparent'}`}>
                                    <div className="relative z-10 w-[68%] md:w-[60%] pointer-events-none flex flex-col justify-center h-full">
                                        <span className={`${index % 2 === 0 ? 'text-athos-orange' : 'text-gray-500'} font-bold uppercase tracking-widest text-[7px] md:text-sm mb-1 md:mb-3 block`}>Evento Destacado</span>
                                        <h2 className={`${index % 2 === 0 ? 'text-white' : 'text-athos-black'} text-2xl md:text-5xl lg:text-5xl xl:text-6xl font-black italic tracking-tighter leading-[0.85] mb-1.5 md:mb-6 uppercase line-clamp-2`}>
                                            {event.title}
                                        </h2>
                                        <p className={`${index % 2 === 0 ? 'text-gray-400' : 'text-gray-500'} text-[8px] md:text-lg font-bold mb-2.5 md:mb-8 max-w-[140px] md:max-w-[250px] leading-tight line-clamp-2`}>
                                            {new Date(event.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })} <br /> {event.city}
                                        </p>
                                        <span
                                            className={`inline-block ${index % 2 === 0 ? 'bg-white text-athos-black hover:bg-athos-orange hover:text-white glow-effect' : 'bg-athos-black text-white hover:scale-105 shadow-athos-orange/20 glow-effect'} px-2.5 py-1 md:px-10 md:py-4 rounded-lg md:rounded-2xl text-[7px] md:text-sm font-black uppercase tracking-widest transition-all shadow-lg w-fit`}
                                        >
                                            Inscribirse
                                        </span>
                                    </div>
                                    <img
                                        src={event.image || "/imagen_bordes_difuminados.png"}
                                        className="absolute -right-4 md:-right-12 -bottom-10 md:-bottom-28 w-[45%] md:w-[60%] h-[120%] object-cover object-left rotate-[-5deg] drop-shadow-2xl z-0 group-hover:scale-105 group-hover:translate-y-[-10px] transition-transform duration-700 pointer-events-none opacity-90"
                                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)', borderRadius: '40px' }}
                                        alt={event.title}
                                    />
                                    {index % 2 === 0 && (
                                        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 md:w-96 md:h-96 bg-gray-800 rounded-full blur-[60px] md:blur-[100px] opacity-50 pointer-events-none"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-4 md:mt-8">
                        <div className={`w-6 h-1.5 rounded-full transition-all ${scrollLeft < 200 ? 'bg-athos-orange w-8' : 'bg-gray-300'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${scrollLeft >= 200 ? 'bg-athos-orange w-8' : 'bg-gray-300'}`}></div>
                    </div>
                </div>

                {/* 4. NEW ARRIVALS (Grid Style) */}
                <div className="mt-8 md:mt-12 px-6 md:px-0 mb-20">

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
                        {displayProducts.map((product) => {
                            const isWishlisted = user?.wishlist.includes(product.id);
                            return (
                                <div key={product.id} className="group cursor-pointer bg-white p-3 md:p-4 rounded-[30px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_20px_40px_rgba(255,77,0,0.1)] hover:-translate-y-2" onClick={() => selectProduct(product.id)}>
                                    {/* Image Container */}
                                    <div className="bg-[#F9F9F9] rounded-[20px] aspect-[4/5] relative mb-4 md:mb-6 overflow-hidden">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                            className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
                                        >
                                            <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-gray-500"} />
                                        </button>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500"
                                        />
                                        {product.id === 'p1' && (
                                            <span className="absolute bottom-3 left-3 bg-athos-orange text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg shadow-athos-orange/30">
                                                Destacado
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="px-1">
                                        <h4 className="font-bold text-athos-black text-base md:text-lg truncate uppercase tracking-tight mb-0.5">{product.name}</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-xl md:text-2xl text-athos-black">${product.price.toLocaleString('es-CO')}</span>
                                            <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                                                <Star size={10} className="fill-athos-orange text-athos-orange" />
                                                <span className="text-xs font-bold text-gray-600">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};