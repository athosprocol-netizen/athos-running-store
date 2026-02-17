
import React, { useState } from 'react';
import { useApp } from '../context';
import { Filter, Search, Plus, Star, Heart, SlidersHorizontal, X, ArrowDownUp, ArrowUp, ArrowDown, Share2, Facebook, Twitter, Link as LinkIcon, Smartphone, Instagram, Send, MessageCircle, Music2, Gamepad2 } from 'lucide-react';
import { Breadcrumbs, Pagination, ProductSkeleton } from '../components/Shared';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export const Shop = () => {
    const { selectProduct, products, addToCart, toggleWishlist, user, searchQuery, setSearchQuery, showNotification, isLoading, setView } = useApp();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [shareProduct, setShareProduct] = useState<any | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    const categories = [
        { id: 'all', label: 'Todo' },
        { id: 'shoes', label: 'Calzado' },
        { id: 'apparel', label: 'Ropa' },
        { id: 'achievements', label: '3D Lab' },
        { id: 'accessories', label: 'Accesorios' },
    ];

    // Filter Logic
    let filteredProducts = activeCategory === 'all'
        ? [...products]
        : products.filter(p => p.category === activeCategory);

    // Search Logic
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }

    // Sort Logic
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleQuickAdd = (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        addToCart(product);
    };

    const handleShareClick = async (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        const shareData = {
            title: `ATHOS - ${product.name}`,
            text: `Mira este equipo técnico: ${product.name}`,
            url: window.location.href // In real app, append product ID
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                setShareProduct(product);
            }
        } else {
            setShareProduct(product);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        showNotification('Enlace copiado al portapapeles');
        setShareProduct(null);
    };

    return (
        <div className="pt-24 md:pt-48 min-h-screen bg-athos-bg pb-32 animate-fade-in px-4 md:px-8 max-w-[1400px] mx-auto">

            <Breadcrumbs items={[{ label: 'Inicio', action: () => setView('home') }, { label: 'Tienda' }]} />

            {/* 1. HEADER & SEARCH */}
            <div className="mb-6 md:mb-12">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl md:text-5xl font-black text-athos-black leading-tight">
                        {searchQuery ? 'Resultados para:' : 'Descubre el mejor'} <br />
                        <span className="italic text-athos-orange">{searchQuery ? `"${searchQuery}"` : 'Equipo Técnico'}</span>
                    </h1>
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hidden md:block">
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"} className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-grow shadow-sm">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar calzado, ropa..."
                            className="w-full pl-14 pr-6 h-[56px] bg-white border-none rounded-[20px] text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-athos-orange/20 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                                <X size={16} className="text-gray-400" />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className={`flex-shrink-0 w-[56px] h-[56px] rounded-[20px] flex items-center justify-center transition-all shadow-sm ${isFiltersOpen ? 'bg-athos-black text-white' : 'bg-white text-athos-black hover:bg-athos-orange hover:text-white'
                            }`}
                    >
                        {isFiltersOpen ? <X size={24} /> : <SlidersHorizontal size={24} strokeWidth={2} />}
                    </button>
                </div>

                {isFiltersOpen && (
                    <div className="mt-4 p-4 bg-white rounded-[24px] shadow-sm animate-fade-in">
                        <span className="text-xs font-bold text-gray-400 uppercase mb-3 block">Ordenar Por</span>
                        <div className="flex flex-wrap gap-2">
                            <button onClick={() => setSortBy('default')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all ${sortBy === 'default' ? 'bg-gray-100 border-gray-300 text-athos-black' : 'bg-white border-gray-100 text-gray-400'}`}>Relevancia</button>
                            <button onClick={() => setSortBy('price-asc')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all flex items-center gap-1 ${sortBy === 'price-asc' ? 'bg-athos-black text-white border-athos-black' : 'bg-white border-gray-100 text-gray-500'}`}>Precio <ArrowUp size={12} /></button>
                            <button onClick={() => setSortBy('price-desc')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all flex items-center gap-1 ${sortBy === 'price-desc' ? 'bg-athos-black text-white border-athos-black' : 'bg-white border-gray-100 text-gray-500'}`}>Precio <ArrowDown size={12} /></button>
                            <button onClick={() => setSortBy('rating')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border transition-all flex items-center gap-1 ${sortBy === 'rating' ? 'bg-athos-black text-white border-athos-black' : 'bg-white border-gray-100 text-gray-500'}`}>Mejor Valorados <Star size={12} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. CATEGORIES */}
            <div className="mb-8">
                <h3 className="font-black text-lg text-athos-black mb-4 px-1">Categorías</h3>
                <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
                            className={`whitespace-nowrap px-6 py-3 text-xs font-bold uppercase tracking-wide rounded-[16px] transition-all border ${activeCategory === cat.id
                                ? 'bg-athos-black text-white border-athos-black shadow-lg shadow-athos-black/20'
                                : 'bg-white text-gray-400 border-transparent hover:bg-gray-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. PRODUCT GRID */}
            <div>
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 font-bold">No se encontraron productos.</p>
                        <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); setSortBy('default'); }} className="text-athos-orange font-black uppercase text-sm mt-2 border-b-2 border-athos-orange">Limpiar filtros</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {paginatedProducts.map((product, idx) => {
                                const isWishlisted = user?.wishlist.includes(product.id);
                                const isNew = sortBy === 'default' && (idx === 0 || idx === 2);

                                return (
                                    <div
                                        key={product.id}
                                        className="bg-white p-3 md:p-4 rounded-[24px] relative group cursor-pointer hover:shadow-[0_0_20px_rgba(255,77,0,0.15)] hover:-translate-y-1 transition-all duration-300"
                                        onClick={() => selectProduct(product.id)}
                                    >
                                        {/* Badges (Left) */}
                                        {isNew && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-athos-orange text-white text-[10px] font-black uppercase px-2 py-1.5 rounded-lg shadow-sm">
                                                    New
                                                </span>
                                            </div>
                                        )}

                                        {/* Actions (Right - Column) */}
                                        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                                className="bg-white/60 backdrop-blur p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                                            >
                                                <Heart size={16} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"} />
                                            </button>
                                            <button
                                                onClick={(e) => handleShareClick(e, product)}
                                                className="bg-white/60 backdrop-blur p-2 rounded-full hover:bg-white hover:text-athos-orange transition-colors shadow-sm"
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>

                                        <div className="aspect-square mb-4 flex items-center justify-center p-2">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        <div>
                                            <h4 className="font-black text-athos-black text-sm md:text-base leading-tight mb-1 truncate">{product.name}</h4>
                                            <p className="text-xs text-gray-400 font-bold mb-3 uppercase truncate">{product.subtitle || product.category}</p>

                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="block text-lg font-black text-athos-black">${(product.price / 1000).toFixed(0)}k</span>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                        <span className="text-[10px] font-bold text-gray-400">{product.rating}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => handleQuickAdd(e, product)}
                                                    className="w-10 h-10 bg-athos-black rounded-full flex items-center justify-center text-white shadow-lg hover:bg-athos-orange transition-colors active:scale-90"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </>
                )}
            </div>

            {/* SHARE MODAL (Existing logic preserved) */}
            {shareProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShareProduct(null)}>
                    <div className="bg-white rounded-[32px] p-6 w-full max-w-sm animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic uppercase">Compartir</h3>
                            <button onClick={() => setShareProduct(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                                <img src={shareProduct.image} className="w-12 h-12 object-contain mix-blend-multiply" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-athos-black line-clamp-1">{shareProduct.name}</h4>
                                <p className="text-xs text-athos-orange font-bold">${(shareProduct.price / 1000).toFixed(0)}k</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-2">
                            <button onClick={copyToClipboard} className="flex flex-col items-center gap-2 group col-span-3">
                                <div className="w-12 h-12 rounded-full bg-gray-100 text-athos-black flex items-center justify-center shadow-md group-hover:bg-gray-200 transition-colors">
                                    <LinkIcon size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500 uppercase">Copiar Enlace</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
