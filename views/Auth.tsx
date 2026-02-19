import React, { useState } from 'react';
import { useApp } from '../context';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, ArrowRight, Mail, Lock, User } from 'lucide-react';

export const Auth = () => {
    const { login, register, showNotification, isLoading } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Formulario enviado. Login:", isLogin, "Email:", email);
        if (isLogin) {
            login(email, password);
        } else {
            if (!name.trim()) {
                showNotification("Por favor ingresa tu nombre completo.");
                return;
            }
            register(name, email, password);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4 flex items-center justify-center">
            {/* ... context ... */}
            {/* Skipping to button part for brevity in replacement if possible, but replace_file_content requires exact context matching. 
                I will target the specific chunks.
            */}

            <div className="w-full max-w-4xl bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden border border-gray-100 animate-fade-in rounded-[40px]">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 bg-athos-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=1000&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    />
                    <div className="relative z-10">
                        <span className="bg-athos-orange text-white px-2 py-1 rounded-md font-bold uppercase tracking-widest text-[10px] mb-4 inline-block">Club ATHOS</span>
                        <h2 className="text-4xl font-black italic tracking-tighter mb-4 leading-none">
                            {isLogin ? 'BIENVENIDO AL CLUB.' : 'ÚNETE AL CLUB.'}
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {isLogin
                                ? 'Tus récords te esperan. Accede a tu perfil y gestiona tus órdenes.'
                                : 'Accede a precios exclusivos y gestiona tus órdenes de forma fácil y rápida.'
                            }
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <h3 className="text-2xl font-black italic text-athos-black mb-8 uppercase">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="animate-slide-up">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-2">Nombre</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3.5 bg-[#F4F4F4] border-none rounded-xl focus:ring-2 focus:ring-athos-orange/20 text-sm font-bold placeholder:text-gray-400"
                                    placeholder="Tu Nombre"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-2">Correo</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3.5 bg-[#F4F4F4] border-none rounded-xl focus:ring-2 focus:ring-athos-orange/20 text-sm font-bold placeholder:text-gray-400"
                                placeholder="ejemplo@athos.co"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-2">Contraseña</label>
                            <input
                                type="password"
                                className="w-full px-4 py-3.5 bg-[#F4F4F4] border-none rounded-xl focus:ring-2 focus:ring-athos-orange/20 text-sm font-bold placeholder:text-gray-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-athos-black text-white h-12 rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg mt-4"
                        >
                            {isLogin ? 'ENTRAR' : 'CREAR CUENTA'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setName('');
                            setEmail('');
                            setPassword('');
                        }}
                        className="font-bold text-gray-400 hover:text-athos-black text-xs tracking-wide transition-colors mt-8 text-center w-full"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia Sesión'}
                    </button>
                </div>
            </div>
        </div>

    );
};