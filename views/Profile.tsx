import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Settings, Heart, Activity, MapPin, Camera, Save, X, User, Printer, Shirt, Share2, Ticket, Smartphone, ShoppingBag } from 'lucide-react';

export const Profile = () => {
    const { user, updateUserProfile, logout, products, toggleWishlist, shareWishlist, selectProduct, addToCart, orders, events, registrations, setView } = useApp();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'eventos'>('perfil');

    // Mocks en caso de no estar auth
    if (!user) {
        return (
            <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-4xl font-black italic text-athos-black mb-4 uppercase">Inicia <span className="text-athos-orange">Sesión</span></h2>
                    <p className="text-gray-500 font-bold mb-8">Debes estar conectado para ver tu perfil de corredor.</p>
                    <button onClick={() => setView('home')} className="bg-athos-black text-white px-8 py-4 rounded-2xl font-black uppercase hover:bg-athos-orange transition-colors">Ir al Inicio</button>
                </div>
            </div>
        );
    }

    // Placeholder for NOTIFICATIONS_MOCK, assuming it's defined elsewhere or will be added.
    // For now, let's define a dummy one to avoid compilation errors.
    const NOTIFICATIONS_MOCK = [];
    const unreadNotifications = NOTIFICATIONS_MOCK.filter(n => !n.read).length;

    // Get user's event registrations
    const userRegistrations = registrations.filter(r => r.userId === user.id);
    const registeredEvents = userRegistrations.map(reg => {
        const evt = events.find(e => e.id === reg.eventId);
        return { ...evt, registration: reg };
    }).filter(e => e.id !== undefined) as (import('../types').Event & { registration: any })[];

    const upcomingEvents = registeredEvents.filter(e => e.status === 'upcoming');
    const pastEvents = registeredEvents.filter(e => e.status === 'past');

    // Local state for editing form
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        location: user?.location || '',
        address: user?.address || '',
        phone: user?.phone || '',
    });

    const wishlistProducts = products.filter(p => user.wishlist.includes(p.id));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUserProfile({ avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUserProfile({
            name: formData.name,
            age: Number(formData.age),
            location: formData.location,
            address: formData.address,
            phone: formData.phone
        });
        setIsEditing(false);
    };

    return (
        <div className="pt-6 md:pt-10 min-h-screen bg-athos-bg pb-32 animate-fade-in px-4 md:px-8 max-w-[1400px] mx-auto">

            <div className="flex flex-col md:flex-row gap-8">

                {/* Header & Personal Info CARD */}
                <div className="bg-[#F4F4F4] p-8 rounded-[40px] mb-12 relative overflow-hidden flex flex-col lg:flex-row items-center md:items-start gap-8 shadow-sm">

                    {/* Avatar Section */}
                    <div className="relative group flex-shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-white flex items-center justify-center shadow-lg">
                            {user.avatar ? (
                                <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                            ) : (
                                <span className="text-4xl font-black italic text-athos-black">{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center text-white"
                        >
                            <Camera size={24} />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <div className="text-center md:text-left flex-grow w-full z-10">
                        {isEditing ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl bg-white p-6 rounded-3xl">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Edad</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Ciudad</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Dirección</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-3 font-bold text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2 flex gap-2 mt-2">
                                    <button onClick={handleSave} className="flex-1 bg-athos-black text-white py-3 rounded-xl font-bold uppercase text-xs">Guardar</button>
                                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold uppercase text-xs">Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-4xl font-black text-athos-black uppercase italic mb-1">{user.name}</h1>
                                <p className="text-gray-500 font-bold text-sm mb-4">{user.email}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-gray-600 mb-6">
                                    {user.age && <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><User size={12} className="text-athos-orange" /> {user.age} Años</span>}
                                    <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><MapPin size={12} className="text-athos-orange" /> {user.location || 'Ciudad no def.'}</span>
                                    {user.phone && <span className="bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"><Smartphone size={12} className="text-athos-orange" /> {user.phone}</span>}
                                </div>

                                <div className="flex gap-3 justify-center md:justify-start">
                                    <button onClick={() => { setIsEditing(true); setFormData({ name: user.name, age: user.age || '', location: user.location || '', address: user.address || '', phone: user.phone || '' }); }} className="px-5 py-2.5 bg-white border border-gray-200 hover:border-athos-black rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-sm">
                                        Editar
                                    </button>
                                    <button onClick={() => setActiveTab('pedidos')} className="px-5 py-2.5 bg-white text-red-500 border border-gray-200 hover:bg-red-50 rounded-xl text-xs font-black uppercase tracking-wide transition-all shadow-sm">
                                        Pedidos
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('eventos')}
                                        className={`w - full text - left px - 6 py - 4 rounded - xl font - bold uppercase tracking - wide transition - all ${activeTab === 'eventos'
                                            ? 'bg-athos-black text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-athos-black'
                                            } `}
                                    >
                                        Mis Eventos
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>



                {/* Wishlist Section */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h2 className="text-xl font-black italic flex items-center gap-2 uppercase">
                            <Heart size={20} className="text-athos-orange" /> Lista de Deseados
                        </h2>
                        {wishlistProducts.length > 0 && (
                            <button onClick={shareWishlist} className="flex items-center gap-2 text-[10px] font-bold uppercase bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors text-athos-black">
                                <Share2 size={12} /> Compartir
                            </button>
                        )}
                    </div>

                    {wishlistProducts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {wishlistProducts.map(p => (
                                <div key={p.id} className="bg-[#F4F4F4] rounded-[24px] p-3 relative group cursor-pointer" onClick={() => selectProduct(p.id)}>
                                    <div className="aspect-[4/5] overflow-hidden mb-2 rounded-xl bg-white">
                                        <img src={p.image} className="w-full h-full object-contain mix-blend-multiply p-2 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xs uppercase truncate mb-0.5">{p.name}</h4>
                                        <p className="text-black font-black text-xs">${p.price.toLocaleString('es-CO')}</p>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                                        className="absolute bottom-16 right-3 w-8 h-8 bg-athos-black rounded-full flex items-center justify-center text-white shadow-lg hover:bg-athos-orange transition-colors"
                                    >
                                        <ShoppingBag size={14} />
                                    </button>

                                    {/* Remove Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm hover:scale-110 transition-transform"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 text-center rounded-3xl">
                            <p className="text-gray-400 font-bold text-sm">Tu lista de deseos está vacía.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};