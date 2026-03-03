import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Plus, Trash2, Edit2, Upload, X, Check, Package, DollarSign, Image } from 'lucide-react';
import { Product } from '../types';

export const Admin = () => {
    const { products, updateProduct, addProduct, deleteProduct, user, showNotification } = useApp();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const [tempProduct, setTempProduct] = useState<Partial<Product>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (user?.role !== 'admin') {
        return <div className="pt-32 text-center text-xl font-bold">Acceso Denegado</div>;
    }

    const handleEditClick = (product: Product) => {
        setEditingId(product.id);
        setTempProduct(product);
        setIsAdding(false);
    };

    const handleAddClick = () => {
        setEditingId(null);
        setTempProduct({
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            price: 0,
            stock: 0,
            category: 'shoes',
            description: '',
            image: '',
            tags: [],
            variants: []
        });
        setIsAdding(true);
    };

    const handleSave = () => {
        if (!tempProduct.name || tempProduct.name.trim() === '') {
            showNotification("❌ Error: Necesitas ponerle un nombre al producto.");
            return;
        }

        if (isAdding && (!tempProduct.price || tempProduct.price <= 0)) {
            showNotification("❌ Error: Necesitas ingresar un precio válido (mayor a 0).");
            return;
        }

        if (isAdding) {
            addProduct(tempProduct as Product);
        } else if (editingId) {
            updateProduct(tempProduct as Product);
        }

        setEditingId(null);
        setIsAdding(false);
        setTempProduct({});
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProduct(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVariantImageUpload = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const variants = tempProduct.variants || [];
                const updatedVariants = variants.map(v =>
                    v.id === variantId ? { ...v, image: reader.result as string } : v
                );
                setTempProduct(prev => ({ ...prev, variants: updatedVariants }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProduct(prev => ({
                    ...prev,
                    images: [...(prev.images || []), reader.result as string]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (index: number) => {
        setTempProduct(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== index)
        }));
    };

    const handleVariantGalleryUpload = (variantId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []) as File[];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProduct(prev => ({
                    ...prev,
                    variants: (prev.variants || []).map(v =>
                        v.id === variantId
                            ? { ...v, images: [...(v.images || []), reader.result as string] }
                            : v
                    )
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const removeVariantGalleryImage = (variantId: string, index: number) => {
        setTempProduct(prev => ({
            ...prev,
            variants: (prev.variants || []).map(v =>
                v.id === variantId
                    ? { ...v, images: (v.images || []).filter((_, i) => i !== index) }
                    : v
            )
        }));
    };

    const addVariant = () => {
        const variants = tempProduct.variants || [];
        setTempProduct({
            ...tempProduct,
            variants: [...variants, { id: Math.random().toString(36).substr(2, 9), colorName: '', price: tempProduct.price || 0, image: '' }]
        });
    };

    const removeVariant = (variantId: string) => {
        const variants = tempProduct.variants || [];
        setTempProduct({
            ...tempProduct,
            variants: variants.filter(v => v.id !== variantId)
        });
    };

    const updateVariant = (variantId: string, field: string, value: any) => {
        const variants = tempProduct.variants || [];
        setTempProduct({
            ...tempProduct,
            variants: variants.map(v => v.id === variantId ? { ...v, [field]: value } : v)
        });
    };

    return (
        <div className="pt-6 md:pt-10 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen bg-transparent animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-black italic text-athos-black">PANEL <span className="text-athos-orange">ADMIN</span></h1>
                <button
                    onClick={handleAddClick}
                    className="bg-athos-black text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 hover:bg-athos-orange transition-colors"
                >
                    <Plus size={16} /> Nuevo Producto
                </button>
            </div>

            {/* Editor Form Modal/Inline */}
            {(editingId || isAdding) && (
                <div className="bg-gray-50 p-8 rounded-[40px] mb-8 shadow-sm animate-slide-up border border-gray-100">
                    <h3 className="font-black text-lg mb-6 flex items-center gap-2 uppercase">
                        {isAdding ? 'Crear Producto' : 'Editar Producto'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Nombre del Producto</label>
                                <input
                                    type="text"
                                    className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm md:text-base focus:ring-2 focus:ring-athos-orange/20 placeholder:text-gray-300"
                                    placeholder="Ej: ATHOS Carbon Alpha"
                                    value={tempProduct.name || ''}
                                    onChange={e => setTempProduct({ ...tempProduct, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Precio</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                        value={tempProduct.price || 0}
                                        onChange={e => setTempProduct({ ...tempProduct, price: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Stock</label>
                                    <input
                                        type="number"
                                        className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                        value={tempProduct.stock || 0}
                                        onChange={e => setTempProduct({ ...tempProduct, stock: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Categoría</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                        placeholder="Ej: Calzado, Relojes, Gafas..."
                                        value={tempProduct.category || ''}
                                        onChange={e => setTempProduct({ ...tempProduct, category: e.target.value.toLowerCase() })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Descripción</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20 h-24"
                                    value={tempProduct.description || ''}
                                    onChange={e => setTempProduct({ ...tempProduct, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Imagen Principal</label>
                                <div className="relative aspect-video bg-white rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 group hover:border-athos-orange transition-colors">
                                    {tempProduct.image ? (
                                        <img src={tempProduct.image} className="w-full h-full object-contain p-4" />
                                    ) : (
                                        <Image size={48} className="text-gray-300" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <span className="text-white font-bold flex items-center gap-2 uppercase text-xs tracking-widest">
                                            <Upload size={20} /> Subir Foto
                                        </span>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                {/* Main Gallery */}
                                {tempProduct.images && tempProduct.images.length > 0 && (
                                    <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-2">
                                        {tempProduct.images.map((img, idx) => (
                                            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200 group">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-2 text-right">
                                    <label className="cursor-pointer text-[10px] font-bold text-athos-orange uppercase flex justify-end items-center gap-1 hover:text-orange-600">
                                        <Plus size={12} /> Añadir a Galería
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 block">Variantes / Colores Adicionales</label>
                                    <button
                                        onClick={addVariant}
                                        className="text-xs font-bold text-athos-orange uppercase flex items-center gap-1 hover:text-orange-600"
                                    >
                                        <Plus size={14} /> Añadir Variante
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {tempProduct.variants?.map((variant) => (
                                        <div key={variant.id} className="bg-white p-4 rounded-xl border border-gray-100 relative">
                                            <button
                                                onClick={() => removeVariant(variant.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Color</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2 rounded-lg bg-gray-50 border-none font-bold text-xs"
                                                        placeholder="Ej: Negro"
                                                        value={variant.colorName}
                                                        onChange={e => updateVariant(variant.id, 'colorName', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Precio Específico</label>
                                                    <input
                                                        type="number"
                                                        className="w-full p-2 rounded-lg bg-gray-50 border-none font-bold text-xs"
                                                        value={variant.price || 0}
                                                        onChange={e => updateVariant(variant.id, 'price', parseInt(e.target.value))}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Foto Principal</label>
                                                    <div className="relative h-9 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 group hover:border-athos-orange transition-colors cursor-pointer">
                                                        {variant.image ? (
                                                            <img src={variant.image} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Upload size={10} /> Subir</span>
                                                        )}
                                                        <input
                                                            type="file"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            accept="image/*"
                                                            onChange={(e) => handleVariantImageUpload(variant.id, e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Variant Gallery */}
                                            {variant.images && variant.images.length > 0 && (
                                                <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar pb-1">
                                                    {variant.images.map((img, idx) => (
                                                        <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 group">
                                                            <img src={img} className="w-full h-full object-cover" />
                                                            <button
                                                                onClick={() => removeVariantGalleryImage(variant.id, idx)}
                                                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X size={8} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="mt-2 text-right">
                                                <label className="cursor-pointer text-[10px] font-bold text-athos-orange uppercase flex justify-end items-center gap-1 hover:text-orange-600">
                                                    <Plus size={10} /> Añadir a Galería del Color
                                                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleVariantGalleryUpload(variant.id, e)} />
                                                </label>
                                            </div>

                                        </div>
                                    ))}
                                    {(!tempProduct.variants || tempProduct.variants.length === 0) && (
                                        <div className="text-center p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs font-bold text-gray-400">
                                            Sin variantes. Se usará el nombre, precio y foto principal del producto original.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-8">
                                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="px-6 py-3 bg-white text-gray-500 rounded-xl font-bold uppercase text-xs hover:bg-gray-100">
                                    Cancelar
                                </button>
                                <button onClick={handleSave} className="px-6 py-3 bg-athos-black text-white rounded-xl font-bold uppercase text-xs hover:bg-athos-orange transition-colors shadow-lg">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-[30px] p-2 overflow-hidden border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4 pl-6">Producto</th>
                            <th className="p-4">Categoría</th>
                            <th className="p-4">Precio</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right pr-6">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {products.map(product => (
                            <tr key={product.id} className="group">
                                <td className="p-2">
                                    <div className="bg-white rounded-2xl p-2 flex items-center gap-4 group-hover:shadow-sm transition-shadow">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                            <img src={product.image} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <span className="font-bold text-athos-black">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 capitalize text-gray-600 font-bold">{product.category}</td>
                                <td className="p-4 font-black text-athos-black">${product.price.toLocaleString('es-CO')}</td>
                                <td className="p-4">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${(product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                        {(product.stock || 0)} ud.
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEditClick(product)} className="bg-white p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"><Edit2 size={16} /></button>
                                        <button onClick={() => deleteProduct(product.id)} className="bg-white p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};