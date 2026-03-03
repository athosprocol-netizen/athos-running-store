import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User, ShoppingCart, Search, X, LogIn, Flame, Menu, ChevronRight, LogOut, Settings, Ruler, HelpCircle, Calendar } from 'lucide-react';
import { useApp } from '../context';

export const Navbar = () => {
    const { view, setView, cart, user, logout, searchQuery, setSearchQuery, products, selectProduct, events, selectEvent } = useApp();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        let firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
        firstDay = firstDay === 0 ? 6 : firstDay - 1; // Convert to Mon(0) - Sun(6)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const getEventsForDay = (date: Date) => {
        return events.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getDate() === date.getDate() &&
                eDate.getMonth() === date.getMonth() &&
                eDate.getFullYear() === date.getFullYear();
        });
    };

    const today = new Date();
    const isToday = (date: Date) => {
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const hasEventToday = getEventsForDay(today).length > 0;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { id: 'home', icon: Home, label: 'Inicio' },
        { id: 'events', icon: Calendar, label: 'Eventos' },
        { id: 'shop', icon: ShoppingBag, label: 'Tienda' },
        { id: 'size-guide', icon: Ruler, label: 'Guía de Tallas' },
        { id: 'support', icon: HelpCircle, label: 'FAQ' },
    ];

    const isHomeView = view === 'home';

    // The navbar text should ALWAYS be dark so it is visible against the white background.
    const textColorClass = 'text-athos-black';
    const logoColorClass = '';
    const iconColorClass = 'text-athos-black';

    const handleNavClick = (viewId: any) => {
        setView(viewId);
        setIsMobileMenuOpen(false);
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setView('shop');
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false); // Make sure mobile menu closes too if it was open
        }
    };

    // Also add a direct function for the button click
    const executeSearch = () => {
        if (searchQuery.trim()) {
            setView('shop');
            setIsSearchOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    // Scroll Lock Effect
    const safeQuery = searchQuery || '';
    const searchResults = safeQuery.trim().length > 0
        ? (products || []).filter(p =>
            (p?.name || '').toLowerCase().includes(safeQuery.toLowerCase()) ||
            (p?.category || '').toLowerCase().includes(safeQuery.toLowerCase())
        ).slice(0, 4)
        : [];

    useEffect(() => {
        if (isMobileMenuOpen || isCalendarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen, isCalendarOpen]);

    if (view === 'checkout') return null;


    return (
        <>
            {/* DESKTOP HEADER - FIXED COLOR */}
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 hidden md:block ${isScrolled
                    ? 'bg-white/90 backdrop-blur-xl border-b border-athos-border py-4 shadow-sm'
                    : 'bg-white/80 backdrop-blur-md py-4'
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-10 flex items-center justify-between">
                    {/* Logo (ENLARGED VIA CSS SCALE) */}
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
                        <img src="/logo.png" alt="ATHOS" className="h-[60px] w-auto object-contain transition-transform duration-300 transform scale-125 md:scale-[1.4] origin-left group-hover:scale-[1.45]" />
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

                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className={`flex flex-col items-center justify-center ${iconColorClass} hover:text-athos-orange transition-colors hover:scale-110 duration-200 relative group`}
                        >
                            <Calendar size={24} strokeWidth={2.5} className={hasEventToday ? 'text-athos-orange' : ''} />
                            <span className={`text-[9px] font-black uppercase tracking-widest mt-1 ${hasEventToday ? 'text-athos-orange' : 'text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'}`}>
                                {hasEventToday ? 'Hoy' : 'Cal'}
                            </span>
                            {hasEventToday && (
                                <span className="absolute top-0 right-1 w-2 h-2 bg-athos-orange rounded-full animate-pulse border-2 border-white"></span>
                            )}
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

                {/* Center: Logo (Restaurado a su tamaño original en Móvil) */}
                <div
                    onClick={() => setView('home')}
                    className="absolute left-1/2 top-2 transform -translate-x-1/2 flex items-center justify-center filter drop-shadow-md"
                >
                    <img src="/logo.png" alt="ATHOS" className="h-[60px] w-auto object-contain transform scale-[1.35] origin-center" />
                </div>

                {/* Right: Actions (Calendario y Carrito) */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsCalendarOpen(true)}
                        className="relative text-athos-black flex flex-col items-center"
                    >
                        <Calendar size={24} className={hasEventToday ? 'text-athos-orange' : 'text-gray-600'} />
                        <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 leading-none ${hasEventToday ? 'text-athos-orange' : 'text-gray-400'}`}>
                            {hasEventToday ? 'Evento' : 'Libre'}
                        </span>
                        {hasEventToday && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-athos-orange rounded-full animate-pulse border border-white"></span>
                        )}
                    </button>

                    <button onClick={() => setView('cart')} className={`relative text-athos-black p-1`}>
                        <ShoppingCart size={26} />
                        {cart.length > 0 && (
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-athos-orange rounded-full animate-pulse ring-2 ring-white"></span>
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

            {/* MOBILE CALENDAR MODAL */}
            {isCalendarOpen && (
                <>
                    <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm animate-fade-in md:hidden" onClick={() => setIsCalendarOpen(false)} />
                    <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl p-6 pb-10 shadow-2xl animate-slide-up md:hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black italic uppercase text-athos-black flex items-center gap-2">
                                <Calendar size={24} className="text-athos-orange" />
                                Mensual
                            </h3>
                            <button onClick={() => setIsCalendarOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-athos-black">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Month Selector */}
                        <div className="flex justify-between items-center mb-4 px-2">
                            <button onClick={prevMonth} className="p-1 hover:text-athos-orange"><ChevronRight size={20} className="rotate-180" /></button>
                            <span className="font-bold text-sm uppercase tracking-widest text-athos-black">
                                {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={nextMonth} className="p-1 hover:text-athos-orange"><ChevronRight size={20} /></button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1 mb-2 text-center border-b border-gray-100 pb-2">
                            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                                <div key={i} className="text-[10px] font-black text-gray-400 uppercase">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-6">
                            {generateCalendarDays().map((day, idx) => {
                                if (!day) return <div key={idx} className="p-2" />;
                                const dayEvents = getEventsForDay(day);
                                const isCurr = isToday(day);
                                const hasEvents = dayEvents.length > 0;

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            if (hasEvents) {
                                                selectEvent(dayEvents[0].id);
                                                setIsCalendarOpen(false);
                                                setIsMobileMenuOpen(false);
                                            }
                                        }}
                                        className={`p-2 w-full aspect-square flex flex-col items-center justify-center rounded-xl relative transition-all ${isCurr ? 'bg-athos-black text-white shadow-md' :
                                            hasEvents ? 'bg-athos-orange/10 text-athos-black font-bold border border-athos-orange/30 hover:bg-athos-orange/20' :
                                                'text-gray-500 hover:bg-gray-50 border border-transparent'
                                            }`}
                                    >
                                        <span className={`text-sm tracking-tighter ${isCurr ? 'font-black' : ''}`}>{day.getDate()}</span>
                                        {hasEvents && (
                                            <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-athos-orange" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected Month Events List */}
                        <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 sticky top-0 bg-white z-10 py-1">Eventos del Mes</h4>
                            {events.filter(e => {
                                const d = new Date(e.date);
                                return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
                            }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(e => (
                                <div
                                    key={e.id}
                                    onClick={() => {
                                        selectEvent(e.id);
                                        setIsCalendarOpen(false);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl cursor-pointer hover:bg-athos-orange/10 transition-colors border border-transparent hover:border-athos-orange/20"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-0.5">
                                            {new Date(e.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}
                                        </span>
                                        <span className="text-base font-black text-athos-orange leading-none">{new Date(e.date).getDate()}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="font-bold text-sm text-athos-black line-clamp-1">{e.title}</h5>
                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1">📍 {e.city}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300" />
                                </div>
                            ))}
                            {events.filter(e => {
                                const d = new Date(e.date);
                                return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
                            }).length === 0 && (
                                    <div className="text-center text-xs text-gray-400 py-6 font-medium italic border-2 border-dashed border-gray-100 rounded-2xl">
                                        No hay eventos programados en este mes.
                                    </div>
                                )}
                        </div>
                    </div>
                    <style>{`
                        @keyframes slideUp {
                            from { transform: translateY(100%); }
                            to { transform: translateY(0); }
                        }
                        .animate-slide-up {
                            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
                                    {searchResults.length > 0 ? (
                                        <div className="mb-8 bg-white border border-gray-100 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden animate-fade-in text-left">
                                            <div className="p-4 bg-gray-50 border-b border-gray-100 uppercase text-xs font-black tracking-widest text-gray-500">
                                                Mejores Coincidencias ({searchResults.length})
                                            </div>
                                            <ul className="divide-y divide-gray-100">
                                                {searchResults.map(p => (
                                                    <li
                                                        key={p.id}
                                                        onClick={() => {
                                                            selectProduct(p.id);
                                                            setIsSearchOpen(false);
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                        className="flex items-center gap-6 p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                                                    >
                                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 group-hover:scale-110 transition-transform overflow-hidden">
                                                            <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <p className="text-xs uppercase font-bold text-gray-400 mb-1">{p.category}</p>
                                                            <h4 className="text-base font-black italic uppercase text-athos-black">{p.name}</h4>
                                                        </div>
                                                        <div className="text-right flex-shrink-0 hidden md:block">
                                                            <span className="text-lg font-black text-athos-orange">${p.price.toLocaleString('es-CO')}</span>
                                                        </div>
                                                        <div className="text-gray-300 group-hover:text-athos-orange transition-colors">
                                                            <ChevronRight size={24} />
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-3xl mb-8">
                                            No se encontraron elementos
                                        </div>
                                    )}

                                    <p className="text-gray-400 font-bold text-sm mb-4">Presiona ENTER para ver todos los resultados</p>
                                    <button onClick={executeSearch} className="bg-athos-black text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-athos-orange transition-colors shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                                        Ver Todo ({searchQuery})
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