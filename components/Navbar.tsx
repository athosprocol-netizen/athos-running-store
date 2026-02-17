import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User, ShoppingCart, Search, X, LogIn, Flame, Menu, ChevronRight, LogOut, Settings, Ruler } from 'lucide-react';
import { useApp } from '../context';

export const Navbar = () => {
    const { view, setView, cart, user, logout, searchQuery, setSearchQuery } = useApp();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'home', icon: Home, label: 'Inicio' },
        { id: 'shop', icon: ShoppingBag, label: 'Tienda' },
        { id: 'size-guide', icon: Ruler, label: 'Guía de Tallas' },
    ];

    const isHomeView = view === 'home';

    // FIX: Always use dark text for visibility on white/light backgrounds
    const textColorClass = 'text-athos-black';
    const logoColorClass = 'text-athos-black';
    const iconColorClass = 'text-athos-black';

    const handleNavClick = (viewId: any) => {
        setView(viewId);
        setIsMobileMenuOpen(false);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setView('shop');
            setIsSearchOpen(false);
        }
    };

    // Scroll Lock Effect
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            {/* DESKTOP HEADER - FIXED COLOR */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 hidden md:block ${isScrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-athos-border py-4 shadow-sm'
                    : 'bg-transparent py-8'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-10 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
                        <img src="/logo.png" alt="ATHOS" className="h-32 w-auto object-contain transition-transform duration-300 transform group-hover:scale-105" />
                    </div>

                    {/* Central Nav */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-12">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setView(item.id as any)}
                                className={`text-sm font-black tracking-widest uppercase transition-all hover:text-athos-orange hover-burn relative group ${view === item.id ? 'text-athos-orange' : textColorClass
                                    }`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-2 left-0 w-full h-[3px] bg-gradient-to-r from-athos-orange to-red-500 transform transition-transform duration-300 origin-left ${view === item.id ? 'scale-x-100 shadow-[0_0_15px_#FF4D00]' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </button>
                        ))}
                        {/* Admin Link */}
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => setView('admin')}
                                className={`text-sm font-black tracking-widest uppercase transition-all hover:text-athos-orange relative group ${view === 'admin' ? 'text-athos-orange' : textColorClass
                                    }`}
                            >
                                Admin
                            </button>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`${iconColorClass} hover:text-athos-orange transition-colors hover:scale-110 duration-200`}
                        >
                            <Search size={24} strokeWidth={2.5} />
                        </button>

                        <div className={`h-6 w-[2px] bg-black/10`}></div>

                        <button
                            onClick={() => setView(user ? 'profile' : 'auth')}
                            className={`flex items-center gap-2 ${iconColorClass} hover:text-athos-orange transition-colors hover:scale-110 duration-200`}
                        >
                            {user ? (
                                user.avatar ? (
                                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-athos-orange transition-all" alt="Avatar" />
                                ) : <User size={24} strokeWidth={2.5} />
                            ) : <LogIn size={24} strokeWidth={2.5} />}
                        </button>

                        <button
                            onClick={() => setView('cart')}
                            className={`relative group ${iconColorClass} hover:text-athos-orange transition-colors hover:scale-110 duration-200`}
                        >
                            <ShoppingCart size={24} strokeWidth={2.5} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-athos-orange text-white text-xs font-black flex items-center justify-center rounded-full animate-burn shadow-lg">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE TOP HEADER */}
            <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 md:hidden h-16 flex items-center justify-between px-4 ${isScrolled || isMobileMenuOpen ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-[#F7F7F7]'}`}>
                {/* Left: Hamburger Menu */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className={`p-2 text-athos-black hover:text-athos-orange transition-colors`}
                >
                    <Menu size={28} strokeWidth={2.5} />
                </button>

                {/* Center: Logo */}
                <div
                    onClick={() => setView('home')}
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                >
                    <img src="/logo.png" alt="ATHOS" className="h-12 w-auto object-contain" />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setView('cart')} className={`relative text-athos-black p-2`}>
                        <ShoppingCart size={26} />
                        {cart.length > 0 && (
                            <span className="absolute 0 top-0 right-0 w-2.5 h-2.5 bg-athos-orange rounded-full animate-pulse ring-2 ring-white"></span>
                        )}
                    </button>
                </div>
            </nav>

            {/* MOBILE MENU SIDEBAR */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[50] bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[60] shadow-2xl flex flex-col overflow-hidden animate-slide-in-right" style={{ animationDirection: 'normal', animationName: 'slideInLeft' }}>

                        {/* Visual Accent Strip */}
                        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-athos-orange via-red-500 to-athos-black z-20"></div>

                        {/* Background Flame Image (Static) */}
                        <div className="absolute bottom-[-5%] right-[-15%] z-0 pointer-events-none opacity-[0.1]">
                            <img src="/flames.png" alt="Decorative Flame" className="w-[300px] h-auto object-contain grayscale mix-blend-multiply" />
                        </div>

                        {/* 1. HEADER (Profile) */}
                        <div className="p-8 pt-12 border-b border-gray-100 relative z-10 bg-white/80 backdrop-blur-sm">
                            {user ? (
                                <div className="flex items-center gap-4" onClick={() => handleNavClick('profile')}>
                                    <div className="relative">
                                        {user.avatar ? (
                                            <img src={user.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-athos-orange p-0.5" alt="Avatar" />
                                        ) : (
                                            <div className="w-14 h-14 rounded-full bg-athos-black flex items-center justify-center text-white font-black text-xl border-2 border-athos-orange">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black italic text-athos-black uppercase leading-none">{user.name}</span>
                                        <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wide">Miembro Club</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-1">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black italic text-athos-black uppercase">Bienvenido</h3>
                                        <button onClick={() => handleNavClick('auth')} className="text-athos-orange text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                            Iniciar Sesión <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 2. NAVIGATION LIST */}
                        <div className="flex-grow p-6 overflow-y-auto relative z-10">
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => handleNavClick(item.id)}
                                            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${view === item.id ? 'bg-athos-orange/10 text-athos-orange' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <item.icon size={22} strokeWidth={2.5} />
                                            <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                                            {view === item.id && <div className="ml-auto w-2 h-2 bg-athos-orange rounded-full"></div>}
                                        </button>
                                    </li>
                                ))}

                                {/* Additional Mobile Links */}
                                <li>
                                    <button
                                        onClick={() => handleNavClick('profile')}
                                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${view === 'profile' ? 'bg-athos-orange/10 text-athos-orange' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        <Settings size={22} strokeWidth={2.5} />
                                        <span className="font-bold text-sm uppercase tracking-wide">Mi Cuenta</span>
                                    </button>
                                </li>

                                {user?.role === 'admin' && (
                                    <li>
                                        <button
                                            onClick={() => handleNavClick('admin')}
                                            className="w-full flex items-center gap-4 p-3 rounded-xl text-gray-400 hover:text-athos-orange transition-all"
                                        >
                                            <Settings size={22} strokeWidth={2.5} />
                                            <span className="font-bold text-sm uppercase tracking-wide">Admin Panel</span>
                                        </button>
                                    </li>
                                )}
                            </ul>

                            {/* Logout Button (if logged in) */}
                            {user && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <button
                                        onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        className="flex items-center gap-4 text-red-500 font-bold text-sm uppercase tracking-wide px-3 hover:opacity-70"
                                    >
                                        <LogOut size={20} /> Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Close Button Absolute */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-athos-black hover:bg-athos-orange hover:text-white transition-colors z-30"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Slide In Left Keyframe */}
                    <style>{`
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.3s ease-out forwards;
                }
            `}</style>
                </>
            )}

            {/* SEARCH MODAL (Desktop) */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[60] bg-white animate-fade-in flex flex-col">
                    <div className="p-4 md:p-8 flex items-center justify-between border-b border-athos-border">
                        <span className="text-3xl font-black italic">ATHOS <span className="text-athos-orange">BUSCAR</span></span>
                        <button onClick={() => setIsSearchOpen(false)} className="p-3 hover:bg-gray-100 rounded-full">
                            <X size={32} />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto">
                        <div className="max-w-4xl mx-auto p-4 md:p-12">
                            <div className="relative mb-8">
                                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={32} />
                                <input
                                    type="text"
                                    placeholder="Busca productos..."
                                    className="w-full pl-20 pr-6 py-8 text-4xl font-black italic bg-athos-bg border-none focus:ring-0 placeholder:text-gray-300 rounded-2xl"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                />
                            </div>
                            {searchQuery && (
                                <div className="text-center">
                                    <p className="text-gray-400 font-bold text-sm mb-4">Presiona ENTER para ver resultados</p>
                                    <button onClick={() => { setView('shop'); setIsSearchOpen(false); }} className="bg-athos-black text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-athos-orange transition-colors">
                                        Ver Resultados
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};