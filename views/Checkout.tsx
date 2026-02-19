
import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { COLOMBIA_LOCATIONS } from '../constants/colombia';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Box, CreditCard, CheckCircle, MapPin, Truck, ChevronDown, Trophy, ShoppingBag, ShieldCheck, Loader, Upload, Image as ImageIcon } from 'lucide-react';

export const Checkout = () => {
    const { setView, cart, confirmOrder, user, showNotification } = useApp();
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // Form States with Validation
    const [shipping, setShipping] = useState({
        fullName: '',
        phone: '',
        province: '',
        city: '',
        address: '',
        postalCode: ''
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    // Derived State for Cities based on selected Province
    const availableCities = shipping.province ? COLOMBIA_LOCATIONS[shipping.province] || [] : [];

    const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'bancolombia'>('nequi');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shippingFee = subtotal > 200000 ? 0 : 15000;
    const total = subtotal + shippingFee;

    // Validation Logic
    const validateStep1 = () => {
        const newErrors: Record<string, boolean> = {};
        if (!shipping.fullName.trim()) newErrors.fullName = true;
        if (!shipping.phone.trim()) newErrors.phone = true;
        if (!shipping.address.trim()) newErrors.address = true;
        if (!shipping.postalCode.trim()) newErrors.postalCode = true;

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            showNotification("Por favor completa los campos obligatorios");
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        return true;
    };

    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 2 && !validateStep2()) return;

        setErrors({});
        window.scrollTo(0, 0);
        setStep(prev => (prev < 4 ? prev + 1 : prev) as any);
    };

    const prevStep = () => {
        window.scrollTo(0, 0);
        setStep(prev => (prev > 1 ? prev - 1 : prev) as any);
    };

    const handleConfirmOrder = async () => {
        setIsProcessing(true);

        // Upload Proof if exists
        let proofUrl = null;
        if (proofFile) {
            try {
                const fileName = `${Date.now()}-${user?.id || 'guest'}-proof.jpg`;
                const { data, error } = await supabase.storage
                    .from('payment-proofs')
                    .upload(fileName, proofFile);

                if (data) {
                    const { data: publicUrlData } = supabase.storage
                        .from('payment-proofs')
                        .getPublicUrl(fileName);
                    proofUrl = publicUrlData.publicUrl;
                }
            } catch (e) {
                console.error("Upload failed", e);
                // Continue anyway for now or show error
            }
        }

        // Simulate Payment Processing API Call
        await new Promise(resolve => setTimeout(resolve, 2000));

        confirmOrder(); // Pass proofUrl if context supports it
        setIsProcessing(false);
        setStep(4);
        window.scrollTo(0, 0);
    };

    // ---- STEP 4: SUCCESS SCREEN ----
    if (step === 4) {
        return (
            <div className="min-h-screen bg-athos-bg flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                <div className="w-32 h-32 bg-athos-orange/10 rounded-full flex items-center justify-center mb-8 animate-pulse-slow">
                    <Trophy size={64} className="text-athos-orange drop-shadow-lg" />
                </div>

                <h1 className="text-4xl font-black italic text-athos-black uppercase mb-4 tracking-tight">
                    ¡Orden Recibida!
                </h1>

                <p className="text-gray-500 mb-12 max-w-xs mx-auto leading-relaxed">
                    Gracias por elegir ATHOS. Prepárate para romper tus marcas. Hemos enviado la confirmación a <strong>{user?.email}</strong>.
                </p>

                <button
                    onClick={() => setView('shop')}
                    className="w-full max-w-xs bg-athos-black text-white h-14 rounded-full font-black uppercase tracking-widest hover:bg-athos-orange transition-all shadow-xl"
                >
                    Seguir Comprando
                </button>
            </div>
        );
    }

    // ---- MAIN CHECKOUT LAYOUT ----
    return (
        <div className="min-h-screen bg-white pb-32">
            {/* HEADER */}
            <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 h-16 flex items-center justify-between transition-all duration-300`}>
                <button
                    onClick={() => step === 1 ? setView('cart') : prevStep()}
                    className="p-2 -ml-2 text-athos-black hover:bg-gray-100 rounded-full z-50 relative"
                >
                    <ArrowLeft size={24} />
                </button>
                <span className="font-black italic text-lg uppercase tracking-wide">Finalizar Compra</span>
                <div className="relative">
                    <ShoppingBag size={24} className="text-athos-black" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-athos-orange text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cart.length}
                    </span>
                </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="px-8 py-8">
                <div className="flex justify-between items-center relative max-w-md mx-auto">
                    {/* Connecting Line */}
                    <div className="absolute left-0 top-5 w-full h-[2px] bg-gray-200 z-0"></div>
                    <div className={`absolute left-0 top-5 h-[2px] bg-athos-orange z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>

                    {/* Steps */}
                    {[
                        { id: 1, label: 'Envío', icon: Box },
                        { id: 2, label: 'Pago', icon: CreditCard },
                        { id: 3, label: 'Revisar', icon: CheckCircle }
                    ].map((s) => {
                        const isActive = s.id <= step;
                        const isCurrent = s.id === step;
                        return (
                            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-athos-orange border-athos-orange text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                                    <s.icon size={18} strokeWidth={2.5} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-athos-black' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* STEP CONTENT */}
            <div className="px-6 max-w-lg mx-auto animate-fade-in">

                {/* STEP 1: SHIPPING DETAILS */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black italic text-athos-black uppercase">Detalles de Envío</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Nombre Completo <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={shipping.fullName}
                                    onChange={e => setShipping({ ...shipping, fullName: e.target.value })}
                                    className={`w-full bg-gray-50 border-2 rounded-lg p-4 font-bold text-sm focus:bg-white ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Ej: Alejandro Corredor"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Teléfono <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">+57</span>
                                    <input
                                        type="tel"
                                        value={shipping.phone}
                                        onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                                        className={`w-full bg-gray-50 border-2 rounded-lg p-4 pl-12 font-bold text-sm focus:bg-white ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="324 267 4234"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Departamento</label>
                                    <div className="relative">
                                        <select
                                            value={shipping.province}
                                            onChange={e => setShipping({ ...shipping, province: e.target.value, city: '' })} // Reset city on province change
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-4 font-bold text-sm appearance-none focus:bg-white truncate pr-8"
                                        >
                                            <option value="">Seleccionar</option>
                                            {Object.keys(COLOMBIA_LOCATIONS).sort().map(dept => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Ciudad</label>
                                    <div className="relative">
                                        <select
                                            value={shipping.city}
                                            onChange={e => setShipping({ ...shipping, city: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-4 font-bold text-sm appearance-none focus:bg-white truncate pr-8"
                                            disabled={!shipping.province}
                                        >
                                            <option value="">{shipping.province ? 'Seleccionar' : '-'}</option>
                                            {availableCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Dirección <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={shipping.address}
                                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                                    className={`w-full bg-gray-50 border-2 rounded-lg p-4 font-bold text-sm focus:bg-white ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Calle 123 # 45 - 67, Apto 201"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-athos-black uppercase mb-1 block">Código Postal <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={shipping.postalCode}
                                    onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                                    className={`w-full bg-gray-50 border-2 rounded-lg p-4 font-bold text-sm focus:bg-white ${errors.postalCode ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="110111"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: PAYMENT METHOD */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-black italic text-athos-black uppercase">Método de Pago</h2>
                        </div>

                        <div className="space-y-3">
                            {['nequi', 'bancolombia'].map((method) => (
                                <div
                                    key={method}
                                    onClick={() => setPaymentMethod(method as any)}
                                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-athos-black bg-gray-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1">
                                            {method === 'nequi' && <img src="/nequi.jpg" className="w-full h-full object-contain mix-blend-multiply" alt="Nequi" />}
                                            {method === 'bancolombia' && <img src="/bancolombia.png" className="w-full h-full object-contain mix-blend-multiply" alt="Bancolombia" />}
                                        </div>
                                        <span className="font-bold text-sm text-athos-black uppercase">
                                            {method === 'nequi' ? 'Nequi' : 'Bancolombia'}
                                        </span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-athos-black' : 'border-gray-300'}`}>
                                        {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-athos-black"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Instructions & Proof Upload */}
                        <div className="animate-slide-up bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                            <p className="text-sm font-bold text-gray-500 uppercase mb-2">
                                {paymentMethod === 'nequi' ? 'Envía a Nequi' : 'Transferencia Bancolombia'}
                            </p>
                            <p className="text-2xl font-black text-athos-black tracking-widest select-all mb-6">
                                {paymentMethod === 'nequi' ? '311 710 7008' : '813 782 32538'}
                            </p>

                            {/* Upload Section */}
                            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 relative group hover:border-athos-orange transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setProofFile(e.target.files[0]);
                                        }
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="flex flex-col items-center gap-2">
                                    {proofFile ? (
                                        <>
                                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                <CheckCircle size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-green-600 line-clamp-1">{proofFile.name}</span>
                                            <span className="text-[10px] text-gray-400">Click para cambiar</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 bg-gray-100 text-gray-400 group-hover:bg-athos-orange/10 group-hover:text-athos-orange rounded-full flex items-center justify-center transition-colors">
                                                <Upload size={20} />
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 group-hover:text-athos-black">Subir Comprobante</span>
                                            <span className="text-[10px] text-gray-400">Captura de pantalla requerida</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 mt-4 font-medium">
                                * Tu orden no será procesada sin el comprobante.
                            </p>
                        </div>
                    </div>
                )}

                {/* STEP 3: REVIEW ORDER */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="text-center mb-2">
                            <h2 className="text-xl font-black italic text-athos-black uppercase">Resumen</h2>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3">
                            {cart.map((item) => (
                                <div key={item.cartId} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center">
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.product.image} className="w-full h-full object-cover mix-blend-multiply" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-sm text-athos-black uppercase line-clamp-1">{item.product.name}</h4>
                                        <p className="text-xs text-gray-500 italic mb-1">{item.product.category}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="font-black text-athos-black text-sm">${item.product.price.toLocaleString('es-CO')}</span>
                                            <span className="text-xs font-bold text-gray-400">Cant: {item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping Address Summary */}
                        <div className="bg-white border border-dashed border-gray-300 p-4 rounded-xl">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
                                <Truck size={14} /> Envío a:
                            </h4>
                            <p className="text-sm font-bold text-athos-black">{shipping.fullName}</p>
                            <p className="text-xs text-gray-600">{shipping.address}</p>
                            <p className="text-xs text-gray-600">{shipping.city}, {shipping.province}</p>
                        </div>

                        {/* Cost Breakdown */}
                        <div className="bg-white pt-4">
                            <div className="flex justify-between text-sm mb-2 text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-bold text-athos-black">${subtotal.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-4 text-gray-500">
                                <span>Envío</span>
                                <span className="font-bold text-athos-black">${shippingFee.toLocaleString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                <span className="font-black text-lg text-athos-black uppercase">Total</span>
                                <span className="font-black text-2xl text-athos-orange">${total.toLocaleString('es-CO')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ACTION BUTTON (Sticky Bottom) */}
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-6 z-50 md:static md:bg-transparent md:border-0 md:p-0 md:mt-8">
                    <button
                        onClick={step === 3 ? handleConfirmOrder : nextStep}
                        disabled={isProcessing}
                        className="w-full bg-athos-black text-white h-14 rounded-full font-black text-lg uppercase tracking-wide shadow-xl shadow-athos-black/20 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <Loader size={20} className="animate-spin" /> Procesando...
                            </>
                        ) : (
                            <>
                                {step === 1 && 'Ir al Pago'}
                                {step === 2 && 'Revisar Orden'}
                                {step === 3 && (
                                    <>
                                        Confirmar Orden <ShieldCheck size={20} />
                                    </>
                                )}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
