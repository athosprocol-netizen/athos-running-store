import React from 'react';
import { useApp } from '../context';
import { Minus, Plus, Trash2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

export const Cart = () => {
    const { cart, checkout, setView, selectProduct } = useApp();

    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Mock recently viewed
    const recentlyViewed = MOCK_PRODUCTS.slice(0, 3);

    return (
        <div className="pt-24 min-h-screen bg-athos-bg pb-32 animate-fade-in">

            {/* HEADER */}
            <div className="px-6 max-w-2xl mx-auto flex items-center justify-between mb-8">
                <button onClick={() => setView('shop')} className="p-2 -ml-2 hover:bg-white rounded-full transition-colors"><ArrowLeft size={24} /></button>
                <h1 className="text-xl font-black italic text-athos-black uppercase">Tu Bolsa</h1>
                <button className="p-2 bg-white rounded-full shadow-sm"><Trash2 size={18} className="text-red-500" /></button>
            </div>

            <div className="px-6 max-w-2xl mx-auto">

                {/* CART ITEMS LIST */}
                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 font-bold mb-4">Tu bolsa está vacía.</p>
                        <button onClick={() => setView('shop')} className="text-athos-orange font-black uppercase text-sm border-b-2 border-athos-orange">Ir a la tienda</button>
                    </div>
                ) : (
                    <div className="space-y-4 mb-12">
                        {cart.map((item) => (
                            <div key={item.cartId} className="bg-white p-3 rounded-[24px] flex items-center gap-4 shadow-sm relative group">
                                {/* Checkbox (Mock) */}
                                <div className="w-6 h-6 rounded-lg bg-athos-black text-white flex items-center justify-center flex-shrink-0 cursor-pointer">
                                    <Check size={14} strokeWidth={3} />
                                </div>

                                {/* Image */}
                                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply p-1" />
                                </div>

                                {/* Info */}
                                <div className="flex-grow">
                                    <h3 className="font-bold text-sm text-athos-black uppercase line-clamp-1">{item.product.name}</h3>
                                    <p className="text-xs text-gray-400 font-medium mb-2">{item.product.category} {item.size ? `• ${item.size}` : ''}</p>
                                    <span className="font-black text-athos-black">${item.product.price.toLocaleString('es-CO')}</span>
                                </div>

                                {/* Quantity */}
                                <div className="flex flex-col items-center gap-1 bg-gray-50 p-1 rounded-lg">
                                    <button className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-black"><Minus size={12} /></button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm text-gray-600 hover:text-black"><Plus size={12} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RECENTLY VIEWED */}
                <div className="mb-24">
                    <h3 className="font-bold text-athos-black text-base mb-4">Vistos Recientemente</h3>
                    <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
                        {recentlyViewed.map(p => (
                            <div
                                key={p.id}
                                onClick={() => selectProduct(p.id)}
                                className="min-w-[140px] bg-white p-3 rounded-[20px] shadow-sm cursor-pointer"
                            >
                                <div className="aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                                    <img src={p.image} className="w-full h-full object-contain mix-blend-multiply p-2" />
                                </div>
                                <h4 className="font-bold text-xs text-athos-black uppercase truncate mb-1">{p.name}</h4>
                                <span className="text-xs font-black text-athos-orange">${(p.price / 1000).toFixed(0)}k</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* BOTTOM CHECKOUT BAR */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6 z-30 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6 text-sm">
                        <span className="text-gray-500 font-bold">Total ({cart.length} items):</span>
                        <span className="text-2xl font-black text-athos-black">${total.toLocaleString('es-CO')}</span>
                    </div>
                    <button
                        onClick={checkout}
                        disabled={cart.length === 0}
                        className="w-full bg-athos-black text-white h-14 rounded-[20px] font-black uppercase tracking-widest hover:bg-athos-orange transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Proceder al Pago
                    </button>
                </div>
            </div>

        </div>
    );
};