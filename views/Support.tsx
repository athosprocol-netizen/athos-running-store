import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Phone, Truck, ShieldCheck, HelpCircle, MessageCircle } from 'lucide-react';

export const Support = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "¿Cuáles son los tiempos de envío?",
            answer: "Procesamos tu pedido en 24-48 horas. El tiempo de entrega estándar es de 3-5 días hábiles para ciudades principales y de 5-8 días para zonas rurales. Recibirás un número de guía apenas tu pedido sea despachado."
        },
        {
            question: "¿Cómo puedo realizar un cambio o devolución?",
            answer: "Tienes 30 días calendario desde la entrega para solicitar cambios por talla o defectos de fábrica. El producto debe estar sin uso y con sus etiquetas originales. Escríbenos a soporte@athos.co para iniciar el proceso."
        },
        {
            question: "¿Qué garantía tienen los productos?",
            answer: "Todos nuestros productos cuentan con garantía de 90 días por defectos de fabricación (costuras, pegues, decoloración prematura). La garantía no cubre desgaste normal por uso o mal lavado."
        },
        {
            question: "¿Hacen envíos internacionales?",
            answer: "Actualmente solo realizamos envíos a todo el territorio nacional de Colombia. Estamos trabajando para expandir nuestra cobertura próximamente."
        },
        {
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos tarjetas de crédito/débito, PSE, Nequi y Daviplata a través de nuestra pasarela de pagos segura."
        }
    ];

    const policies = [
        {
            icon: Truck,
            title: "Envíos y Entregas",
            content: "Realizamos envíos asegurados a toda Colombia. El costo se calcula en el checkout según tu ubicación. Envío GRATIS por compras superiores a $300.000 COP."
        },
        {
            icon: ShieldCheck,
            title: "Garantía de Calidad",
            content: "Si tu producto presenta fallas de origen, lo reparamos o cambiamos sin costo. Tu satisfacción y rendimiento son nuestra prioridad."
        },
        {
            icon: MessageCircle,
            title: "Atención Personalizada",
            content: "Nuestro equipo de runners expertos está disponible para asesorarte en la elección de tu equipamiento ideal. No dudes en contactarnos."
        }
    ];

    return (
        <div className="min-h-screen bg-athos-bg text-athos-black font-sans">
            {/* HER0 SECTION */}
            <div className="bg-athos-black text-white pt-32 pb-20 px-6 relative overflow-hidden rounded-b-[40px]">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-athos-orange/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <span className="bg-athos-orange text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block">Soporte ATHOS</span>
                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6">
                        ¿CÓMO PODEMOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-athos-orange to-red-600">AYUDARTE?</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Resolvemos tus dudas para que nada te detenga en tu camino a la meta.
                    </p>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-16">

                {/* POLICIES GRID */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {policies.map((policy, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:border-athos-orange/30 transition-all hover:shadow-xl group">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-athos-orange group-hover:text-white transition-colors">
                                <policy.icon size={28} strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-black italic uppercase mb-3">{policy.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-bold">{policy.content}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-16">
                    {/* FAQ SECTION */}
                    <div>
                        <h2 className="text-3xl font-black italic uppercase mb-8 flex items-center gap-3">
                            <HelpCircle className="text-athos-orange" /> Preguntas Frecuentes
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className="font-black italic uppercase text-lg text-gray-800">{faq.question}</span>
                                        {openIndex === index ? <ChevronUp className="text-athos-orange" /> : <ChevronDown className="text-gray-400" />}
                                    </button>

                                    <div className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}>
                                        <p className="text-gray-500 font-bold text-sm leading-relaxed border-t border-gray-100 pt-4">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONTACT SECTION */}
                    <div className="bg-athos-black text-white p-10 rounded-[40px] relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-[-20%] right-[-20%] w-[300px] h-[300px] bg-athos-orange/20 rounded-full blur-[80px]"></div>

                        <h2 className="text-3xl font-black italic uppercase mb-6 relative z-10">Contacto Directo</h2>
                        <p className="text-gray-400 mb-8 relative z-10 font-medium">
                            ¿No encuentras lo que buscas? Nuestro equipo está listo para responderte.
                        </p>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-athos-orange transition-colors">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Email</p>
                                    <p className="text-lg font-bold">athospro.col@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-athos-orange transition-colors">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Ubicación</p>
                                    <p className="text-lg font-bold">Cartago, Valle del Cauca</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-athos-orange transition-colors">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">WhatsApp</p>
                                    <p className="text-lg font-bold">+57 300 123 4567</p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-10 w-full bg-white text-athos-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-athos-orange hover:text-white transition-all shadow-lg transform hover:-translate-y-1">
                            Iniciar Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
