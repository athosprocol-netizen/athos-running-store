import React, { useEffect, useState } from 'react';
import { Flame, Instagram, Twitter, Facebook, Youtube, MapPin, Mail, Phone, ArrowRight, Music2, Users, Eye, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context';
import { registerVisit, getUniqueVisitorCount } from '../lib/analytics';
import emailjs from '@emailjs/browser';

export const Footer = () => {
    const { setView } = useApp();
    const [visitorCount, setVisitorCount] = useState<number | null>(null);
    const [activeUsers, setActiveUsers] = useState(24);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
        setNewsletterStatus('loading');
        try {
            await emailjs.send(
                'service_w0gw0zj',
                'template_uo3yssb',
                {
                    to_name: 'ATHOS',
                    from_name: newsletterEmail,
                    customer_name: 'Nueva suscripción al newsletter',
                    customer_email: newsletterEmail,
                    subject: 'Nueva suscripción al newsletter',
                    message: `El correo ${newsletterEmail} se suscribió al newsletter de ATHOS.`,
                    order_items: `Suscriptor: ${newsletterEmail}`,
                    total: '-',
                    shipping_address: '-',
                    delivery_notes: '-',
                },
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'Ze2no8CSyEuXkoj2H'
            );
            setNewsletterStatus('success');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterStatus('idle'), 4000);
        } catch {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus('idle'), 3000);
        }
    };

    useEffect(() => {
        registerVisit().then(() => {
            getUniqueVisitorCount().then(count => {
                setVisitorCount(count > 0 ? (12450 + count) : 12450); // Sumamos count real al fallback initial
            });
        });

        // Simulate active users for the "real-time" indicator
        setActiveUsers(Math.floor(Math.random() * 15) + 18);
        const interval = setInterval(() => {
            setActiveUsers(prev => {
                const change = Math.random() > 0.5 ? 1 : -1;
                const next = prev + change;
                return next < 12 ? 12 : (next > 50 ? 50 : next);
            });
        }, 6500);
        
        return () => clearInterval(interval);
    }, []);

    const socialLinks = [
        { icon: Music2, label: 'TikTok', url: 'https://www.tiktok.com/@athosrun.co' },
        { icon: Facebook, label: 'Facebook', url: 'https://www.facebook.com/athosrun.co' },
        { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@athosrun_co' },
        { icon: Twitter, label: 'X', url: 'https://x.com/athosrun_co' },
        { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/athosrun.co' },
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
                                <picture>
                                    <source srcSet="/logo.webp" type="image/webp" />
                                    <img src="/logo.png" alt="ATHOS" loading="lazy" width="400" height="100" className="h-32 w-auto object-contain hover:brightness-110 transition-all" />
                                </picture>
                            </div>
                            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-sm font-medium">
                                Rendimiento, estilo y comunidad. Diseñamos equipamiento de running para quienes buscan superar sus propios límites.
                            </p>
                            <div className="flex gap-4 mb-6">
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

                            {/* Visitor Counters */}
                            {visitorCount !== null && (
                                <div className="flex flex-col gap-2 mt-2">
                                    {/* Real-time Indicator */}
                                    <div className="bg-gray-900/80 border border-gray-800 rounded-full px-4 py-2 flex items-center justify-center gap-2 shadow-lg group hover:border-athos-orange/50 transition-colors self-center min-w-[180px]">
                                        <div className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-athos-orange opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-athos-orange"></span>
                                        </div>
                                        <span className="text-sm font-black text-white tracking-wider flex items-center gap-1">
                                            {activeUsers} <span className="text-gray-400 font-bold text-xs">EN LÍNEA</span>
                                        </span>
                                    </div>
                                    
                                    {/* Total Visits Indicator */}
                                    <div className="flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity self-center">
                                        <Eye size={12} className="text-gray-500" />
                                        <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                            {visitorCount.toLocaleString()} Histórico
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Links Column 1 */}
                        <div className="col-span-2">
                            <h4 className="font-black italic text-xl uppercase mb-6 tracking-wide">Tienda</h4>
                            <ul className="space-y-4 text-base font-bold text-gray-500">
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Calzado</button></li>
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Ropa Técnica</button></li>
                                <li><button onClick={() => setView('shop')} className="hover:text-athos-orange transition-colors">Accesorios</button></li>
                                <li><button onClick={() => setView('marcas')} className="hover:text-athos-orange transition-colors">Nuestras Marcas</button></li>
                            </ul>
                        </div>

                        {/* Links Column 2 */}
                        <div className="col-span-2">
                            <h4 className="font-black italic text-xl uppercase mb-6 tracking-wide">Soporte</h4>
                            <ul className="space-y-4 text-base font-bold text-gray-500">
                                <li><button onClick={() => setView('size-guide')} className="hover:text-athos-orange transition-colors">Guía de Tallas</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Envíos y Devoluciones</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Garantía</button></li>
                                <li><button onClick={() => setView('support')} className="hover:text-athos-orange transition-colors">Contacto</button></li>
                            </ul>
                        </div>

                        {/* Newsletter / Contact */}
                        <div className="col-span-4">
                            <h4 className="font-black italic text-xl uppercase mb-6 tracking-wide">Únete al Club</h4>
                            <p className="text-gray-400 text-base mb-4">Recibe acceso anticipado a lanzamientos y eventos exclusivos.</p>
                            <form onSubmit={handleNewsletterSubmit} className={`flex bg-gray-900 p-2 rounded-xl border mb-8 transition-colors focus-within:border-athos-orange ${newsletterStatus === 'success' ? 'border-green-500' : newsletterStatus === 'error' ? 'border-red-500' : 'border-gray-800'}`}>
                                <input
                                    type="email"
                                    placeholder="Tu correo electrónico"
                                    value={newsletterEmail}
                                    onChange={e => setNewsletterEmail(e.target.value)}
                                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                                    className="bg-transparent border-none text-white w-full px-4 focus:ring-0 placeholder:text-gray-600 font-bold text-base disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                                    className={`flex-shrink-0 px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest transition-colors flex items-center gap-2 ${
                                        newsletterStatus === 'success' ? 'bg-green-500 text-white' :
                                        newsletterStatus === 'error' ? 'bg-red-500 text-white' :
                                        'bg-athos-orange text-white hover:bg-white hover:text-athos-black'
                                    }`}
                                >
                                    {newsletterStatus === 'loading' && <Loader2 size={14} className="animate-spin" />}
                                    {newsletterStatus === 'success' && <Check size={14} />}
                                    {newsletterStatus === 'success' ? '¡Listo!' : newsletterStatus === 'error' ? 'Error' : 'Suscribir'}
                                </button>
                            </form>
                            <div className="space-y-2 text-base font-bold text-gray-500">
                                <p className="flex items-center gap-2"><MapPin size={16} className="text-athos-orange" /> Cartago, Valle del Cauca</p>
                                <p className="flex items-center gap-2 mb-6"><Mail size={16} className="text-athos-orange" /> athosrun.co@gmail.com</p>
                                <div className="pt-4 border-t border-gray-800">
                                    <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Descarga Nuestra App</p>
                                    <img 
                                        src="/Zonarunning logo.png" 
                                        alt="Zona Running" 
                                        className="h-10 w-auto object-contain brightness-0 invert opacity-50 hover:opacity-100 cursor-pointer transition-opacity" 
                                        onClick={() => setView('zona-running')} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex justify-between items-center text-xs font-bold text-gray-600 uppercase tracking-widest">
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
                        <picture>
                            <source srcSet="/logo.webp" type="image/webp" />
                            <img src="/logo.png" alt="ATHOS" loading="lazy" width="400" height="100" className="h-32 w-auto object-contain" />
                        </picture>
                    </div>

                    {/* Social Grid */}
                    <div className="flex flex-col items-center gap-6">
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

                        {/* Visitor Counters Mobile */}
                        {visitorCount !== null && (
                            <div className="flex flex-col gap-2 items-center mt-2">
                                {/* Real-time Indicator Mobile */}
                                <div className="bg-gray-900/80 border border-gray-800 rounded-full px-5 py-2.5 flex items-center gap-2 shadow-inner">
                                    <div className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-athos-orange opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-athos-orange"></span>
                                    </div>
                                    <span className="text-sm font-black text-white tracking-widest flex items-center gap-1.5">
                                        {activeUsers} <span className="text-gray-400 font-bold text-[10px]">EN LÍNEA</span>
                                    </span>
                                </div>
                                
                                {/* Total Visits Indicator */}
                                <div className="flex items-center justify-center gap-1.5 mt-1 opacity-70">
                                    <Eye size={12} className="text-gray-500" />
                                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                                        {visitorCount.toLocaleString()} Histórico
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-16 h-1 bg-gray-800 rounded-full mt-2"></div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                            © 2026 ATHOS Running.
                        </p>
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-widest mt-1 mb-6">
                            Cartago, Valle del Cauca
                        </p>
                        <div className="pt-6 border-t border-gray-800 w-full flex flex-col items-center">
                            <p className="text-[10px] font-bold text-gray-600 mb-3 uppercase tracking-wide">Descarga Nuestra App</p>
                            <img 
                                src="/Zonarunning logo.png" 
                                alt="Zona Running" 
                                className="h-8 w-auto object-contain brightness-0 invert opacity-50 cursor-pointer" 
                                onClick={() => setView('zona-running')} 
                            />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};