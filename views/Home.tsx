import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Search, Filter, Star, Heart, ArrowRight, Flame, Shirt, Footprints, Trophy, Zap } from 'lucide-react';

export const Home = () => {
    const { setView, selectProduct, products, events, selectEvent, toggleWishlist, user, setSearchQuery, setActiveCategory, banners } = useApp();
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

    // DRAG HANDLERS (Desktop Only)
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
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fastness
        sliderRef.current.scrollLeft = scrollLeft - walk;

        // If moved significantly, mark as dragging to prevent click events
        if (Math.abs(x - startX) > 5) {
            setIsDragging(true);
        }
    };

    // Detach drag on mobile entirely for pure native swipe
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth > 768 : true;
    const dragHandlers = isDesktop ? {
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseLeave,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove
    } : {};

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
        <div className="w-full max-w-[100vw] overflow-hidden min-h-screen bg-transparent pb-10 md:pb-0 animate-fade-in flex flex-col items-center">

            {/* 1. SEARCH BAR SECTION (Mobile Only) */}
            <div className="pt-4 px-4 sm:px-6 pb-2 w-full max-w-[1400px] bg-transparent z-30 md:hidden">
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
                {(() => {
                    // Filter active banners
                    const activeBanners = banners.filter(b => b.isActive).map(b => ({
                        id: b.id,
                        type: 'banner' as const,
                        title: b.title,
                        subtitle: b.subtitle,
                        description: b.description,
                        buttonText: b.buttonText,
                        image: b.image,
                        gradientColors: b.gradientColors,
                        link: b.link
                    }));

                    // Filter featured events
                    const featuredEvents = events.filter(e => e.status === 'upcoming' && e.isFeatured).map(e => ({
                        id: e.id,
                        type: 'event' as const,
                        title: e.title,
                        subtitle: `${new Date(e.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}\n${e.city}`,
                        description: undefined,
                        buttonText: undefined,
                        image: e.image,
                        gradientColors: e.gradientColors,
                        link: undefined
                    }));

                    // Combine them
                    const heroItems = [...activeBanners, ...featuredEvents];

                    if (heroItems.length === 0) return null;

                    return (
                        <div className="mt-2 md:px-0">
                            <div
                                ref={sliderRef}
                                {...(typeof window !== 'undefined' && window.innerWidth > 768 ? dragHandlers : {})}
                                className={`w-full max-w-[100vw] overflow-x-auto flex gap-4 md:gap-6 ${isDown ? 'cursor-grabbing' : 'cursor-grab'} px-4 md:px-0.5 snap-x snap-mandatory md:snap-none`}
                                style={{ WebkitOverflowScrolling: 'touch' }}
                            >
                                {heroItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="shrink-0 w-[88vw] md:w-[850px] relative select-none snap-center md:snap-align-none"
                                        onClick={() => handleItemClick(() => {
                                            if (item.type === 'event') selectEvent(item.id);
                                            else if (item.link) setView(item.link as any);
                                        })}
                                    >
                                        <div
                                            className={`rounded-[20px] md:rounded-[40px] p-5 md:p-14 h-[160px] sm:h-[180px] md:h-[450px] relative overflow-hidden flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] group border hover:shadow-xl transition-all ${index % 2 !== 0 && (!item.gradientColors || item.gradientColors.length === 0) ? 'border-gray-200 bg-gray-100' : 'border-transparent'}`}
                                            style={item.gradientColors && item.gradientColors.length > 0 ? { background: `linear-gradient(135deg, ${item.gradientColors.join(', ')})` } : (index % 2 === 0 ? { backgroundColor: '#111' } : {})}
                                        >
                                            <div className="relative z-10 w-[68%] md:w-[60%] pointer-events-none flex flex-col justify-center h-full">
                                                <span className={`${index % 2 === 0 || (item.gradientColors && item.gradientColors.length > 0) ? 'text-white/80' : 'text-gray-500'} font-bold uppercase tracking-widest text-[8px] md:text-sm mb-1.5 md:mb-3 block`}>
                                                    {item.type === 'event' ? 'Evento Destacado' : (item.subtitle || '')}
                                                </span>
                                                <h2 className={`${index % 2 === 0 || (item.gradientColors && item.gradientColors.length > 0) ? 'text-white' : 'text-athos-black'} text-xl sm:text-2xl md:text-4xl lg:text-4xl xl:text-5xl font-black italic tracking-tighter leading-[0.9] mb-1.5 md:mb-6 uppercase`}>
                                                    {item.title}
                                                </h2>

                                                {item.type === 'event' ? (
                                                    <p className={`${index % 2 === 0 || (item.gradientColors && item.gradientColors.length > 0) ? 'text-white/70' : 'text-gray-500'} text-[9px] sm:text-[10px] md:text-lg font-bold mb-2.5 md:mb-8 max-w-[180px] sm:max-w-[220px] md:max-w-[350px] leading-snug line-clamp-3 md:line-clamp-4 mt-0.5`}>
                                                        {item.subtitle.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>)}
                                                    </p>
                                                ) : item.description ? (
                                                    <p className={`${index % 2 === 0 || (item.gradientColors && item.gradientColors.length > 0) ? 'text-white/70' : 'text-gray-500'} text-[9px] sm:text-[10px] md:text-lg font-bold mb-2.5 md:mb-8 max-w-[180px] sm:max-w-[220px] md:max-w-[350px] leading-snug line-clamp-3 md:line-clamp-4 mt-0.5`}>
                                                        {item.description}
                                                    </p>
                                                ) : null}

                                                {(item.type === 'event' || item.link) && (
                                                    <span
                                                        className={`inline-block ${index % 2 === 0 || (item.gradientColors && item.gradientColors.length > 0) ? 'bg-white text-athos-black hover:bg-athos-orange hover:text-white glow-effect' : 'bg-athos-black text-white hover:scale-105 shadow-athos-orange/20 glow-effect'} px-3 py-1.5 md:px-10 md:py-4 rounded-lg md:rounded-2xl text-[8px] sm:text-[9px] md:text-sm font-black uppercase tracking-widest transition-all shadow-md w-fit mt-auto cursor-pointer pointer-events-auto`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (item.type === 'event') selectEvent(item.id);
                                                            else if (item.link) setView(item.link as any);
                                                        }}
                                                    >
                                                        {item.type === 'event' ? 'Ver Evento' : (item.buttonText || 'Ver Más')}
                                                    </span>
                                                )}
                                            </div>
                                            <img
                                                src={item.image || "/imagen_bordes_difuminados.png"}
                                                className="absolute -right-4 md:-right-12 -bottom-8 sm:-bottom-12 md:-bottom-28 w-[50%] md:w-[60%] h-[120%] object-cover object-left rotate-[-5deg] drop-shadow-xl z-0 pointer-events-none opacity-90"
                                                style={{ clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)', borderRadius: '40px', maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)' }}
                                                alt={item.title || ''}
                                            />
                                            {index % 2 === 0 && (
                                                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 md:w-96 md:h-96 bg-gray-800 rounded-full blur-[60px] md:blur-[100px] opacity-40 pointer-events-none"></div>
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
                    )
                })()}

                {/* 4. NEW ARRIVALS (Strict Dimensions 2 Columns Mobile, Max 8 Items) */}
                <div className="mt-6 md:mt-12 px-3 md:px-0 mb-8 max-w-[100vw] overflow-hidden md:max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap justify-between pb-4">
                        {displayProducts.slice(0, 8).map((product) => {
                            const isWishlisted = user?.wishlist.includes(product.id);
                            return (
                                <div key={product.id} className="w-[calc(50%-4px)] md:w-[calc(25%-1.5rem)] mb-2 md:mb-8 group cursor-pointer bg-white p-2.5 md:p-4 rounded-[16px] md:rounded-[24px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => selectProduct(product.id)}>
                                    {/* Image Container */}
                                    <div className="w-full bg-[#f4f4f4] md:bg-[#f0f0f0] rounded-[10px] md:rounded-[16px] aspect-[4/5] relative mb-2 flex items-center justify-center p-2.5 overflow-hidden">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                            className="absolute top-1.5 right-1.5 z-10 bg-white/90 w-6 h-6 md:w-8 md:h-8 rounded-full shadow-sm hover:scale-110 flex items-center justify-center transition-transform"
                                        >
                                            <Heart size={11} className={isWishlisted ? "fill-red-500 text-red-500 md:w-[14px]" : "text-gray-300 md:w-[14px]"} />
                                        </button>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-[90%] h-[90%] object-contain mix-blend-multiply"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="w-full px-0.5 flex flex-col justify-between flex-1 overflow-hidden mt-0.5">
                                        <h4 className="font-bold text-athos-black text-[10px] sm:text-[11px] md:text-sm uppercase tracking-tight leading-[1.15] truncate w-full mb-1">{product.name}</h4>
                                        <div className="flex justify-between items-end mt-auto w-full pt-1 border-t border-gray-50">
                                            <span className="font-black text-[11px] sm:text-[13px] md:text-lg text-athos-black whitespace-nowrap leading-none">${product.price.toLocaleString('es-CO')}</span>
                                            <div className="flex items-center gap-0.5 border border-gray-100 px-1 py-0.5 rounded-sm bg-gray-50 shrink-0 ml-1">
                                                <Star size={6} className="fill-athos-orange text-athos-orange" />
                                                <span className="text-[8px] font-bold text-gray-400 leading-none">{product.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Ver Catálogo Completo Button */}
                    <div className="mt-4 md:mt-8 flex justify-center pb-2">
                        <button
                            onClick={() => setView('shop')}
                            className="bg-athos-orange text-white font-bold uppercase tracking-widest text-[11px] md:text-sm px-8 py-3.5 md:px-12 md:py-4 rounded-xl md:rounded-2xl shadow-[0_4px_14px_rgba(255,77,0,0.3)] hover:bg-athos-orangeHover hover:-translate-y-1 transition-all glow-effect"
                        >
                            Ver Catálogo Completo
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};