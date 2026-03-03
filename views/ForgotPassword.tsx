import React, { useState } from 'react';
import { useApp } from '../context';
import { ArrowRight, Mail } from 'lucide-react';

export const ForgotPassword = () => {
    const { resetPassword, isLoading } = useApp();
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await resetPassword(email);
    };

    return (
        <div className="min-h-screen bg-transparent pt-24 md:pt-32 pb-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 md:p-12 shadow-2xl rounded-[40px] border border-gray-100 flex flex-col justify-center animate-fade-in relative z-10">
                <h3 className="text-2xl font-black italic text-athos-black mb-4 uppercase text-center">
                    Recuperar Contraseña
                </h3>
                <p className="text-gray-500 text-sm mb-8 text-center">
                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-2">Correo</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                className="w-full pl-12 pr-4 py-3.5 bg-[#F4F4F4] border-none rounded-xl focus:ring-2 focus:ring-athos-orange/20 text-sm font-bold placeholder:text-gray-400"
                                placeholder="ejemplo@athos.co"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-athos-orange text-white h-12 rounded-xl font-black uppercase tracking-widest transition-transform flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,77,0,0.3)] mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                    >
                        {isLoading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
                        {!isLoading && <ArrowRight size={20} />}
                    </button>
                </form>
            </div>
        </div>
    );
};
