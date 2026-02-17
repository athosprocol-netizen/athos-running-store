import React, { useState, useRef } from 'react';
import { useApp } from '../context';
import { Plus, Trash2, Edit2, Upload, X, Check, Package, DollarSign, Image } from 'lucide-react';
import { Product } from '../types';

export const Admin = () => {
  const { products, updateProduct, addProduct, deleteProduct, user } = useApp();
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
          category: 'shoes',
          description: '',
          image: '',
          tags: []
      });
      setIsAdding(true);
  };

  const handleSave = () => {
      if (isAdding && tempProduct.name && tempProduct.price) {
          addProduct(tempProduct as Product);
      } else if (editingId && tempProduct.name) {
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

  return (
    <div className="pt-24 pb-24 px-4 md:px-8 max-w-7xl mx-auto min-h-screen bg-white animate-fade-in">
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
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Nombre</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                value={tempProduct.name || ''}
                                onChange={e => setTempProduct({...tempProduct, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Subtítulo</label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                value={tempProduct.subtitle || ''}
                                onChange={e => setTempProduct({...tempProduct, subtitle: e.target.value})}
                            />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Precio</label>
                                <input 
                                    type="number" 
                                    className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                    value={tempProduct.price || 0}
                                    onChange={e => setTempProduct({...tempProduct, price: parseInt(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Categoría</label>
                                <select 
                                    className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20"
                                    value={tempProduct.category || 'shoes'}
                                    onChange={e => setTempProduct({...tempProduct, category: e.target.value as any})}
                                >
                                    <option value="shoes">Calzado</option>
                                    <option value="apparel">Ropa</option>
                                    <option value="accessories">Accesorios</option>
                                    <option value="achievements">Logros 3D</option>
                                </select>
                            </div>
                        </div>
                        <div>
                             <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Descripción</label>
                             <textarea 
                                className="w-full p-3 rounded-xl border-none bg-white font-bold text-sm focus:ring-2 focus:ring-athos-orange/20 h-24"
                                value={tempProduct.description || ''}
                                onChange={e => setTempProduct({...tempProduct, description: e.target.value})}
                             />
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Imagen</label>
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
        <div className="bg-[#F4F4F4] rounded-[30px] p-2 overflow-hidden">
             <table className="w-full text-left border-collapse">
                 <thead className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                     <tr>
                         <th className="p-4 pl-6">Producto</th>
                         <th className="p-4">Categoría</th>
                         <th className="p-4">Precio</th>
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