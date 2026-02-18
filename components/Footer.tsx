import React from 'react';
import { Flame, Instagram, Twitter, Facebook, Youtube, MapPin, Mail, Phone, ArrowRight, Music2 } from 'lucide-react';
import { useApp } from '../context';

export const Footer = () => {
    const { setView } = useApp();

    const socialLinks = [
        { icon: Music2, label: 'TikTok', url: 'https://www.tiktok.com/@athos.co' },
        { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/athos.col' },
        { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@athos_pro' },
        { icon: Twitter, label: 'X', url: 'https://x.com/athos_pro' },
        { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/athos.col' },
    ];

    return (
        <>
            {/* DESKTOP FOOTER */}
            <footer className="hidden md:block bg-athos-black text-white pt-20 pb-10 rounded-t-[50px] mt-20 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-athos-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-[1400px] mx-auto px-10 relative z-10">
                    <div className="grid grid-cols-12 gap-12 mb-20 border-b border-gray-800 pb-16">

                        {/* Brand Column */}
                        <div className="col-span-4 flex flex-col items-center text-center">
                            <div className="flex items-center justify-center gap-2 mb-6 group cursor-pointer" onClick={() => setView('home')}>
                                <img src="/logo.png" alt="ATHOS" className="h-32 w-auto object-contain hover:brightness-110 transition-all" />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm font-medium">
                                Rendimiento, estilo y comunidad. Diseñamos equipamiento de running para quienes buscan superar sus propios límites.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center hover:bg-athos-orange text-white transition-all hover:scale-110"
                                        aria-label={social.label}
                                    >
                                        <social.icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Links Column 1 */}
                        <div className="col-span-2">
                            <h4 className="font-black italic text-lg uppercase mb-6 tracking-wide">Tienda</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Calzado</button></li>
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Ropa Técnica</button></li>
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Accesorios</button></li>
                            </ul>
                        </div>

                        {/* Links Column 2 */}
                        <div className="col-span-2">
                            <h4 className="font-black italic text-lg uppercase mb-6 tracking-wide">Soporte</h4>
                            <ul className="space-y-4 text-sm font-bold text-gray-500">
                                <li><button onClick={() => setView('size-guide')} className="hover:text-athos-orange transition-colors">Guía de Tallas</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Envíos y Devoluciones</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Garantía</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Contacto</button></li>
                            </ul>
                        </div>

                        {/* Newsletter / Contact */}
                        <div className="col-span-4">
                            <h4 className="font-black italic text-lg uppercase mb-6 tracking-wide">Únete al Club</h4>
                            <p className="text-gray-400 text-sm mb-4">Recibe acceso anticipado a lanzamientos y eventos exclusivos.</p>
                            <div className="flex bg-gray-900 p-2 rounded-xl border border-gray-800 mb-8 focus-within:border-athos-orange transition-colors">
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    className="bg-transparent border-none text-white w-full px-4 focus:ring-0 placeholder:text-gray-600 font-bold text-sm"
                                />
                                <button className="bg-athos-orange text-white px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-white hover:text-athos-black transition-colors">
                                    Suscribir
                                </button>
                            </div>
                            <div className="space-y-2 text-sm font-bold text-gray-500">
                                <p className="flex items-center gap-2"><MapPin size={16} className="text-athos-orange" /> Cartago, Valle del Cauca</p>
                                <p className="flex items-center gap-2"><Mail size={16} className="text-athos-orange" /> athospro.col@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                        <p>© 2026 ATHOS RUNNING. TODOS LOS DERECHOS RESERVADOS.</p>
                        <div className="flex gap-6">
                            <span className="cursor-pointer hover:text-white transition-colors">Privacidad</span>
                            <span className="cursor-pointer hover:text-white transition-colors">Términos</span>
                            <span className="cursor-pointer hover:text-white transition-colors">Mapa del Sitio</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* MOBILE FOOTER */}
            <footer className="md:hidden bg-athos-black text-white py-12 mt-12 border-t border-gray-900 relative">
                <div className="px-6 flex flex-col items-center gap-8">
                    {/* Brand Lite */}
                    <div className="flex items-center gap-2 opacity-90" onClick={() => setView('home')}>
                        <img src="/logo.png" alt="ATHOS" className="h-32 w-auto object-contain" />
                    </div>

                    {/* Social Grid */}
                    <div className="flex justify-center gap-5 flex-wrap">
                        {socialLinks.map((social, i) => (
                            <a
                                key={i}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-athos-orange hover:text-white hover:border-athos-orange hover:scale-110 transition-all shadow-lg"
                                aria-label={social.label}
                            >
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>

                    <div className="w-16 h-1 bg-gray-800 rounded-full"></div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                            © 2026 ATHOS Running.
                        </p>
                        <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mt-1">
                            Cartago, Valle del Cauca
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
};