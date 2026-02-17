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
                                headers={['TALLA', 'TAMAÑO (cm)', 'US']}
                                rows={
                                    gender === 'men'
                                        ? [
                                            ['27', '19 cm', '10'],
                                            ['28', '20 cm', '11, 115'],
                                            ['29', '21 cm', '12,5'],
                                            ['30', '22 cm', '13'],
                                            ['31', '23 cm', '1'],
                                            ['34', '24 cm', '5,5 / 6 cm'],
                                            ['35', '25 cm', '6,5'],
                                            ['36', '26 cm', '8'],
                                            ['37', '27 cm', '5,5 / 7,6'],
                                            ['40', '28 cm', '9'],
                                            ['46', '30 cm', '11.5']
                                        ]
                                        : [
                                            ['34', '21 cm', '4'],
                                            ['35', '22 cm', '5'],
                                            ['36', '23 cm', '5,5 / 6'],
                                            ['37', '24 cm', '6,5'],
                                            ['38', '25 cm', '7.5'],
                                            ['39', '26 cm', '8'],
                                            ['40', '27 cm', '9'],
                                            ['42', '28 cm', '9'],
                                            ['44', '29 cm', '10']
                                        ]
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
                                headers={['TALLA', 'PECHO', 'ALTURA', 'MANGAS']}
                                rows={
                                    gender === 'men'
                                        ? [
                                            ['2-4', '33 cm', '46 cm', '20 cm'],
                                            ['6-8', '35 cm', '52 cm', '24 cm'],
                                            ['10-12', '40 cm', '60 cm', '28 cm'],
                                            ['PEQUEÑO (S)', '48 cm', '71 cm', '35 cm'],
                                            ['MEDIANO (M)', '52 cm', '74 cm', '36 cm'],
                                            ['GRANDE (L)', '56 cm', '77 cm', '40 cm'],
                                            ['EXTRA GR (XL)', '60 cm', '80 cm', '43 cm']
                                        ]
                                        : [
                                            ['PEQUEÑO (S)', '44 cm', '59 cm', '19° 24cm'],
                                            ['MEDIANO (M)', '46 cm', '61 cm', '21° 25cm'],
                                            ['GRANDE (L)', '48 cm', '64 cm', '22° 26cm'],
                                            ['EXTRA GR (XL)', '51 cm', '67 cm', '21° 27cm']
                                        ]
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
                            <div className="relative w-full">
                                <img
                                    src="/talla-zapatos.png"
                                    className="w-full h-auto object-contain rounded-2xl shadow-sm mix-blend-multiply"
                                    alt="Guía de tallas calzado"
                                />
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
                            <div className="relative w-full">
                                <img
                                    src="/talla-camisetas.png"
                                    className="w-full h-auto object-contain rounded-2xl shadow-sm mix-blend-multiply"
                                    alt="Guía de tallas ropa"
                                />
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