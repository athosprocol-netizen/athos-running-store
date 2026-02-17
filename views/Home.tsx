import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Search, Filter, Star, Heart, ArrowRight, Flame, Shirt, Footprints, Trophy, Zap } from 'lucide-react';

export const Home = () => {
    const { setView, selectProduct, products, toggleWishlist, user, setSearchQuery } = useApp();
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
        <div className="min-h-screen bg-white pb-24 md:pb-0 animate-fade-in">

            {/* 1. SEARCH BAR SECTION (Mobile Only) */}
            <div className="pt-20 px-6 pb-4 bg-white sticky top-0 z-30 md:hidden">
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

            {/* DESKTOP SPACER */}
            <div className="hidden md:block h-48"></div>

            <div className="max-w-[1400px] mx-auto md:px-10">

                {/* 2. HERO CAROUSEL (DRAGGABLE) */}
                <div className="mt-2 px-6 md:px-0">
                    <div
                        ref={sliderRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={`w-full overflow-x-auto hide-scrollbar flex gap-4 md:gap-6 snap-x snap-mandatory ${isDown ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x'}`}
                    >
                        {/* Card 1 - Main Promo */}
                        <div
                            className="snap-center shrink-0 w-full md:w-[900px] relative select-none"
                            onClick={() => handleItemClick(() => setView('shop'))}
                        >
                            <div className="bg-athos-black rounded-[24px] md:rounded-[40px] p-5 md:p-14 h-[150px] md:h-[450px] relative overflow-hidden flex items-center shadow-xl shadow-athos-black/20 group transition-transform active:scale-[0.99]">
                                <div className="relative z-10 w-[68%] md:w-[60%] pointer-events-none flex flex-col justify-center h-full">
                                    <span className="text-athos-orange font-bold uppercase tracking-widest text-[7px] md:text-sm mb-1 md:mb-3 block">Oferta Limitada</span>
                                    {/* Typography adjusted: Title 2xl, Details 8px */}
                                    <h2 className="text-white text-2xl md:text-6xl font-black italic tracking-tighter leading-[0.85] mb-1.5 md:mb-6">
                                        ATHOS <br /> CARBON
                                    </h2>
                                    <p className="text-gray-400 text-[8px] md:text-lg font-medium mb-2.5 md:mb-8 max-w-[140px] md:max-w-sm leading-tight line-clamp-2 md:line-clamp-none">
                                        Rompe tus marcas con nuestra placa.
                                    </p>
                                    <span
                                        className="inline-block bg-white text-athos-black px-2.5 py-1 md:px-10 md:py-4 rounded-lg md:rounded-2xl text-[7px] md:text-sm font-black uppercase tracking-widest group-hover:bg-athos-orange group-hover:text-white transition-all shadow-lg w-fit hover:shadow-[0_0_20px_rgba(255,77,0,0.4)]"
                                    >
                                        Comprar Ahora
                                    </span>
                                </div>
                                {/* Image positioning adjusted */}
                                <img
                                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
                                    className="absolute -right-2 md:-right-24 bottom-0 md:bottom-[-40px] w-[42%] md:w-[60%] object-contain rotate-[-15deg] drop-shadow-2xl z-0 group-hover:scale-110 group-hover:rotate-[-20deg] transition-transform duration-700 pointer-events-none"
                                    alt="Hero Shoe"
                                />
                                {/* Decorative Circle */}
                                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-32 h-32 md:w-96 md:h-96 bg-gray-800 rounded-full blur-[60px] md:blur-[100px] opacity-50 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Card 2 - Collection */}
                        <div
                            className="snap-center shrink-0 w-full md:w-[600px] relative select-none"
                            onClick={() => handleItemClick(() => setView('shop'))}
                        >
                            <div className="bg-gray-100 rounded-[24px] md:rounded-[40px] p-5 md:p-14 h-[150px] md:h-[450px] relative overflow-hidden flex items-center border border-gray-200 group transition-transform active:scale-[0.99] hover:shadow-[0_0_20px_rgba(255,77,0,0.1)] hover:border-athos-orange/30">
                                <div className="relative z-10 w-[65%] md:w-[60%] pointer-events-none flex flex-col justify-center h-full">
                                    <h2 className="text-athos-black text-2xl md:text-5xl font-black italic tracking-tighter leading-[0.85] mb-1.5 md:mb-4">
                                        TRAIL <br /> SERIES
                                    </h2>
                                    <p className="text-gray-500 text-[8px] md:text-lg font-bold mb-2.5 md:mb-6 max-w-[120px] md:max-w-[200px] leading-tight">Dominando la montaña.</p>
                                    <span
                                        className="inline-block bg-athos-black text-white px-2.5 py-1 md:px-8 md:py-4 rounded-lg md:rounded-2xl text-[7px] md:text-sm font-black uppercase tracking-widest group-hover:scale-105 transition-transform w-fit shadow-lg shadow-athos-orange/20"
                                    >
                                        Ver Todo
                                    </span>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop"
                                    className="absolute -right-5 md:-right-12 bottom-2 md:-bottom-10 w-[52%] md:w-[65%] object-contain drop-shadow-xl z-0 mix-blend-multiply group-hover:translate-y-[-20px] transition-transform duration-500 pointer-events-none"
                                    alt="Trail Shoe"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center gap-2 mt-4 md:mt-8">
                        <div className={`w-6 h-1.5 rounded-full transition-all ${scrollLeft < 200 ? 'bg-athos-orange w-8' : 'bg-gray-300'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full transition-all ${scrollLeft >= 200 ? 'bg-athos-orange w-8' : 'bg-gray-300'}`}></div>
                    </div>
                </div>



                {/* 4. NEW ARRIVALS (Grid Style) */}
                <div className="mt-8 md:mt-16 px-6 md:px-0 mb-20">

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
                        {displayProducts.map((product) => {
                            const isWishlisted = user?.wishlist.includes(product.id);
                            return (
                                <div key={product.id} className="group cursor-pointer" onClick={() => selectProduct(product.id)}>
                                    {/* Image Container - Gray Background */}
                                    <div className="bg-[#F4F4F4] rounded-[24px] md:rounded-[30px] aspect-[4/5] relative mb-3 md:mb-5 overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(255,77,0,0.15)]">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                            className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
                                        >
                                            <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-300 hover:text-gray-500"} />
                                        </button>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {product.id === 'p1' && (
                                            <span className="absolute bottom-3 left-3 bg-athos-orange text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg shadow-athos-orange/30">
                                                Top
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="px-1">
                                        <h4 className="font-bold text-athos-black text-base md:text-lg truncate uppercase tracking-tight mb-0.5">{product.name}</h4>
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-xl md:text-2xl text-athos-black">${(product.price / 1000).toFixed(0)}k</span>
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