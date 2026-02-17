import React, { useState } from 'react';
import { Ruler, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context';

const TechnicalTable = ({ headers, rows }: { headers: string[], rows: (string | number)[][] }) => (
    <div className="w-full border border-athos-black/10 rounded-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-athos-black text-white text-[10px] uppercase font-bold tracking-wider">
                <tr>
                    {headers.map((h, i) => <th key={i} className="px-4 py-3 border-r border-gray-700 last:border-0">{h}</th>)}
                </tr>
            </thead>
            <tbody className="font-mono text-xs">
                {rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        {row.map((cell, j) => <td key={j} className="px-4 py-3 border-r border-gray-100 last:border-0 font-bold text-gray-600">{cell}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export const SizeGuide = () => {
    const { setView } = useApp();
    const [activeTab, setActiveTab] = useState<'shoes' | 'apparel'>('shoes');
    const [gender, setGender] = useState<'men' | 'women'>('men');

    return (
        <div className="pt-24 md:pt-48 pb-24 px-4 md:px-10 max-w-[1400px] mx-auto min-h-screen bg-white animate-fade-in">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* LEFT COLUMN: CONTROLS & TABLE */}
                <div className="lg:col-span-7">
                    <button
                        onClick={() => setView('shop')}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-athos-black transition-colors mb-12 group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Volver a Tienda
                    </button>

                    <div className="mb-12">
                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-athos-black mb-2 leading-[0.85]">
                            GUÍA TÉCNICA
                        </h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">Referencia de ajuste y medidas corporales</p>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex flex-col md:flex-row gap-6 mb-10 border-b border-gray-100 pb-10">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('shoes')}
                                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${activeTab === 'shoes' ? 'bg-athos-black text-white border-athos-black' : 'bg-white text-gray-400 border-gray-200 hover:border-athos-black'}`}
                            >
                                Calzado
                            </button>
                            <button
                                onClick={() => setActiveTab('apparel')}
                                className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border transition-all ${activeTab === 'apparel' ? 'bg-athos-black text-white border-athos-black' : 'bg-white text-gray-400 border-gray-200 hover:border-athos-black'}`}
                            >
                                Ropa
                            </button>
                        </div>

                        <div className="h-auto w-[1px] bg-gray-200 hidden md:block"></div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setGender('men')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${gender === 'men' ? 'text-athos-orange border-b-2 border-athos-orange' : 'text-gray-400 hover:text-black'}`}
                            >
                                Hombre
                            </button>
                            <button
                                onClick={() => setGender('women')}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors ${gender === 'women' ? 'text-athos-orange border-b-2 border-athos-orange' : 'text-gray-400 hover:text-black'}`}
                            >
                                Mujer
                            </button>
                        </div>
                    </div>

                    {/* TABLES */}
                    {activeTab === 'shoes' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xl font-black italic uppercase">Tabla de Conversión</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Unidad: Centímetros</span>
                            </div>
                            <TechnicalTable
                                headers={['US', 'UK', 'EU', 'CM (Largo Pie)']}
                                rows={
                                    gender === 'men'
                                        ? [['7', '6', '40', '25.0'], ['7.5', '6.5', '40.5', '25.5'], ['8', '7', '41', '26.0'], ['8.5', '7.5', '42', '26.5'], ['9', '8', '42.5', '27.0'], ['9.5', '8.5', '43', '27.5'], ['10', '9', '44', '28.0'], ['11', '10', '45', '29.0'], ['12', '11', '46', '30.0']]
                                        : [['5', '2.5', '35.5', '22.0'], ['6', '3.5', '36.5', '23.0'], ['6.5', '4', '37.5', '23.5'], ['7', '4.5', '38', '24.0'], ['8', '5.5', '39', '25.0'], ['9', '6.5', '40.5', '26.0']]
                                }
                            />
                        </div>
                    )}

                    {activeTab === 'apparel' && (
                        <div className="animate-fade-in">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="text-xl font-black italic uppercase">Medidas Corporales</h3>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Unidad: Centímetros</span>
                            </div>
                            <TechnicalTable
                                headers={['Talla', 'Pecho', 'Cintura', 'Cadera']}
                                rows={
                                    gender === 'men'
                                        ? [['S', '88-96', '73-81', '88-96'], ['M', '96-104', '81-89', '96-104'], ['L', '104-112', '89-97', '104-112'], ['XL', '112-124', '97-109', '112-120']]
                                        : [['XS', '76-83', '60-67', '84-91'], ['S', '83-90', '67-74', '91-98'], ['M', '90-97', '74-81', '98-105'], ['L', '97-104', '81-88', '105-112']]
                                }
                            />
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: VISUAL GUIDE */}
                <div className="lg:col-span-5 bg-[#F9F9F9] p-8 md:p-12 border-l border-gray-100 flex flex-col justify-center">
                    <div className="mb-8 border-b border-gray-200 pb-4">
                        <h4 className="text-xs font-black text-athos-orange uppercase tracking-widest flex items-center gap-2 mb-2">
                            <Ruler size={16} /> Protocolo de Medición
                        </h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            Para asegurar el ajuste perfecto de tu equipo ATHOS, sigue estas instrucciones técnicas. Usa una cinta métrica flexible.
                        </p>
                    </div>

                    <div className="flex-grow flex items-center justify-center py-8">
                        {activeTab === 'shoes' ? (
                            <div className="relative w-full max-w-xs">
                                {/* Technical Drawing Foot */}
                                <svg viewBox="0 0 200 320" className="w-full h-auto drop-shadow-sm">
                                    {/* Grid Background */}
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E5E5" strokeWidth="1" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#grid)" />

                                    {/* Foot Outline */}
                                    <path
                                        d="M80,300 C60,300 50,260 50,220 C50,150 55,100 70,60 C80,40 90,20 100,20 C115,20 125,40 135,60 C145,90 150,150 150,220 C150,260 140,300 120,300 Z"
                                        fill="white"
                                        stroke="#111"
                                        strokeWidth="2"
                                    />

                                    {/* Measurement Lines */}
                                    <line x1="50" y1="310" x2="150" y2="310" stroke="#FF4D00" strokeWidth="2" strokeDasharray="4 2" />
                                    <line x1="160" y1="20" x2="160" y2="300" stroke="#FF4D00" strokeWidth="2" />
                                    <line x1="155" y1="20" x2="165" y2="20" stroke="#FF4D00" strokeWidth="2" />
                                    <line x1="155" y1="300" x2="165" y2="300" stroke="#FF4D00" strokeWidth="2" />

                                    {/* Labels */}
                                    <text x="170" y="160" fontSize="10" fontWeight="bold" fill="#FF4D00" style={{ writingMode: 'vertical-rl' }}>LONGITUD (CM)</text>
                                </svg>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-athos-black text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                                        <p className="text-xs text-gray-600">Coloca el talón contra una pared sobre una hoja de papel.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-athos-black text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                                        <p className="text-xs text-gray-600">Marca la punta del dedo más largo.</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-5 h-5 rounded-full bg-athos-black text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                                        <p className="text-xs text-gray-600">Mide la distancia en CM. Esa es tu talla.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative w-full max-w-xs">
                                {/* Technical Drawing Body */}
                                <svg viewBox="0 0 250 350" className="w-full h-auto drop-shadow-sm">
                                    <path
                                        d="M75,60 L50,90 L70,110 L70,300 L180,300 L180,110 L200,90 L175,60 Q125,80 75,60"
                                        fill="white"
                                        stroke="#111"
                                        strokeWidth="2"
                                    />
                                    {/* Chest Line */}
                                    <line x1="60" y1="130" x2="190" y2="130" stroke="#FF4D00" strokeWidth="2" strokeDasharray="5 3" />
                                    <circle cx="190" cy="130" r="3" fill="#FF4D00" />
                                    <text x="200" y="133" fontSize="10" fontWeight="bold" fill="#111">PECHO</text>

                                    {/* Waist Line */}
                                    <line x1="70" y1="200" x2="180" y2="200" stroke="#FF4D00" strokeWidth="2" strokeDasharray="5 3" />
                                    <circle cx="180" cy="200" r="3" fill="#FF4D00" />
                                    <text x="190" y="203" fontSize="10" fontWeight="bold" fill="#111">CINTURA</text>

                                    {/* Hip Line */}
                                    <line x1="70" y1="260" x2="180" y2="260" stroke="#FF4D00" strokeWidth="2" strokeDasharray="5 3" />
                                    <circle cx="180" cy="260" r="3" fill="#FF4D00" />
                                    <text x="190" y="263" fontSize="10" fontWeight="bold" fill="#111">CADERA</text>
                                </svg>

                                <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-athos-orange" />
                                        <p className="text-xs font-bold text-gray-700 uppercase">Pecho: <span className="text-gray-500 font-normal normal-case">Parte más ancha bajo las axilas.</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-athos-orange" />
                                        <p className="text-xs font-bold text-gray-700 uppercase">Cintura: <span className="text-gray-500 font-normal normal-case">Parte más estrecha del tronco.</span></p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-athos-orange" />
                                        <p className="text-xs font-bold text-gray-700 uppercase">Cadera: <span className="text-gray-500 font-normal normal-case">Parte más ancha de los glúteos.</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};