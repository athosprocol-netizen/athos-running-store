import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context';
import { Calendar, MapPin, Clock, Users, ArrowRight, Share2, Map as MapIcon, Image as ImageIcon, X, ChevronLeft, ChevronRight, Star, Camera, User } from 'lucide-react';
import { Review } from '../types';

export const EventDetail = () => {
    const { events, selectedEventId, setView, user, addEventReview, showNotification, products, setSelectedProductId } = useApp();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [isFullScreenReviewImage, setIsFullScreenReviewImage] = useState<string | null>(null);

    // Get a subset of products to display as suggestions
    let promoProducts = products.filter(p => ['shoes', 'apparel', 'medalleros', 'accessories'].includes(p.category)).slice(0, 3);
    if (promoProducts.length === 0) {
        promoProducts = products.slice(0, 3); // Fallback to any products
    }

    // Reviews State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [newReviewComment, setNewReviewComment] = useState('');
    const [newReviewImage, setNewReviewImage] = useState<string | null>(null);
    const [hoverRating, setHoverRating] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const event = events.find(e => e.id === selectedEventId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [selectedEventId]);

    if (!event) {
        return (
            <div className="pt-32 min-h-screen text-center flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black italic text-athos-black mb-4">EVENTO NO <span className="text-athos-orange">ENCONTRADO</span></h1>
                <button onClick={() => setView('events')} className="bg-athos-black text-white px-8 py-4 rounded-2xl font-black mt-4 hover:bg-athos-orange transition-colors">Volver al Directorio</button>
            </div>
        );
    }

    const isPast = event.status === 'past';

    const actionCardContent = (
        <>
            <div className="flex flex-col gap-4 mb-6">
                <button onClick={() => {
                    const shareUrl = `${window.location.origin}/?event=${event.id}`;
                    if (navigator.share) {
                        navigator.share({
                            title: event.title,
                            url: shareUrl
                        }).catch(console.error);
                    } else {
                        navigator.clipboard.writeText(shareUrl);
                        alert('Enlace copiado al portapapeles');
                    }
                }} className="w-full bg-athos-orange text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 glow-effect">
                    <Share2 size={20} /> Compartir Evento
                </button>

                {event.externalUrl && (
                    <button onClick={() => window.open(event.externalUrl, '_blank')} className="w-full bg-athos-black text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                        VISITAR SITIO <ArrowRight size={20} />
                    </button>
                )}
            </div>
            {isPast && <div className="mb-6 border-t border-gray-100 pt-6"></div>}

            {isPast && (
                <div className="space-y-4">
                    <div className="w-full bg-gray-100 text-gray-400 font-black uppercase tracking-widest py-5 rounded-2xl text-center cursor-not-allowed">
                        Evento Finalizado
                    </div>
                    <button
                        onClick={() => setView('event-results')}
                        className="w-full bg-athos-black text-white font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2"
                    >
                        Ver Resultados
                    </button>
                </div>
            )}
        </>
    );

    const handlePrevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && event.gallery) {
            setSelectedImageIndex(selectedImageIndex === 0 ? event.gallery.length - 1 : selectedImageIndex - 1);
        }
    };

    const handleNextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedImageIndex !== null && event.gallery) {
            setSelectedImageIndex(selectedImageIndex === event.gallery.length - 1 ? 0 : selectedImageIndex + 1);
        }
    };

    // --- REVIEWS LOGIC ---
    const handleStarClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setNewReviewRating(index + 1);
    };

    const handleStarHover = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        setHoverRating(index + 1);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = (event) => {
                const img = new window.Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 1000;
                    const MAX_HEIGHT = 1000;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setNewReviewImage(compressedDataUrl);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const submitReview = () => {
        if (!user) {
            showNotification('Debes iniciar sesión para comentar.');
            setView('auth');
            return;
        }
        if (newReviewRating === 0) {
            showNotification('Por favor califica con estrellas.');
            return;
        }
        if (!newReviewComment.trim()) {
            showNotification('Por favor escribe un comentario.');
            return;
        }

        const review: Review = {
            id: Math.random().toString(36).substr(2, 9),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            rating: newReviewRating,
            comment: newReviewComment,
            date: new Date().toLocaleDateString(),
            image: newReviewImage || undefined
        };

        addEventReview(event.id, review);
        setShowReviewForm(false);
        setNewReviewRating(0);
        setNewReviewComment('');
        setNewReviewImage(null);
    };

    const renderStars = (rating: number, size = 16) => {
        return (
            <div className="flex gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => {
                    const full = rating >= i + 1;
                    const half = rating >= i + 0.5 && rating < i + 1;
                    return (
                        <div key={i} className="relative">
                            <Star size={size} className={full ? "fill-athos-orange text-athos-orange" : "text-gray-300"} />
                            {half && (
                                <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                                    <Star size={size} className="fill-athos-orange text-athos-orange" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen pb-24 animate-fade-in relative">
            {/* Hero Image */}
            <div className="w-full h-[40vh] md:h-[60vh] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-athos-black via-athos-black/40 to-transparent z-10" />
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    style={{
                        maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 50%, transparent 100%)'
                    }}
                />

                <div className="absolute top-4 left-4 z-20 md:top-8 md:left-8">
                    <button
                        onClick={() => setView('events')}
                        className="bg-white/20 hover:bg-white/40 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                        &larr; Volver
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 max-w-[1400px] mx-auto">
                    {event.isFeatured && (
                        <span className="inline-block bg-athos-orange text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4 glow-effect">
                            Evento Destacado
                        </span>
                    )}
                    <h1 className="text-white text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-4">
                        {event.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-white/90 font-medium text-sm md:text-base">
                        <span className="flex items-center gap-2"><Calendar size={18} className="text-athos-orange" /> {new Date(event.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span className="flex items-center gap-2"><MapPin size={18} className="text-athos-orange" /> {event.location}, {event.city}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Details */}
                <div className="lg:col-span-2 flex flex-col gap-12 order-2 lg:order-1">
                    {/* Event Grid Details (City, Time, Distance) */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 order-2 lg:order-1">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <MapPin className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Ciudad</span>
                            <span className="text-athos-black font-black text-lg">{event.city}</span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                            <Clock className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Hora</span>
                            <span className="text-athos-black font-black text-lg">
                                {new Date(event.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center max-md:col-span-2">
                            <MapIcon className="text-athos-orange mb-2" size={28} />
                            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Distancias</span>
                            <span className="text-athos-black font-black text-lg">{event.distances.join(' • ')}</span>
                        </div>
                    </div>

                    {/* About */}
                    <section className="order-3 lg:order-2">
                        <h2 className="text-2xl font-black italic text-athos-black uppercase mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                            Acerca de la Carrera
                        </h2>
                        <div className="text-gray-600 leading-relaxed text-lg md:text-xl font-medium whitespace-pre-line">
                            {event.description}
                        </div>
                    </section>

                    {/* Mobile Action Card */}
                    <div className="lg:hidden bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-6 order-3">
                        {actionCardContent}
                    </div>

                    {/* Event Photo Gallery */}
                    {event.gallery && event.gallery.length > 0 && (
                        <section className="order-4 lg:order-2">
                            <h2 className="text-2xl font-black italic text-athos-black uppercase mb-6 flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-athos-orange rounded-full"></div>
                                Galería del Evento
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {event.gallery.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative"
                                    >
                                        <img
                                            src={img}
                                            alt={`Galería ${idx + 1}`}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <ImageIcon className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" size={32} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Shopping Promo / Premium Product Collection */}
                    <section className="order-5 lg:order-3 pt-6 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div>
                                <h2 className="text-3xl font-black italic text-athos-black uppercase mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-athos-orange rounded-full"></div>
                                    Prepárate con Athos
                                </h2>
                                <p className="text-gray-500 font-medium">Equípate con la mejor tecnología y accesorios para romper tus propios récords.</p>
                            </div>
                            <button 
                                onClick={() => setView('shop')}
                                className="bg-athos-black text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-athos-orange transition-colors shadow-lg"
                            >
                                Ver Tienda
                            </button>
                        </div>

                        {/* Premium Product Grid (Top 3 items) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {promoProducts.slice(0, 3).map((product) => (
                                <div 
                                    key={product.id} 
                                    onClick={() => { setSelectedProductId(product.id); setView('product-detail'); }}
                                    className="bg-white rounded-[24px] overflow-hidden cursor-pointer group flex flex-col border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="bg-gray-50 aspect-square relative flex items-center justify-center p-8 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <img 
                                            src={product.image} 
                                            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out" 
                                            alt={product.name} 
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-athos-black">{product.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="font-bold text-lg text-athos-black line-clamp-2 leading-snug mb-3 group-hover:text-athos-orange transition-colors">
                                            {product.name}
                                        </h4>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="font-black text-xl">${product.price.toLocaleString('es-CO')}</span>
                                            <div className="w-10 h-10 rounded-full bg-athos-black text-white flex items-center justify-center group-hover:bg-athos-orange transition-colors">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>



                    {/* Photos Link (if Past) */}
                    {isPast && event.photosLink && (
                        <section className="order-7 lg:order-5 bg-athos-black text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 opacity-10 blur-sm pointer-events-none">
                                <ImageIcon size={200} />
                            </div>
                            <div className="relative z-10 w-full md:w-2/3">
                                <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-2">
                                    Galería Oficial
                                </h2>
                                <p className="text-gray-400 font-medium">Encuentra tus fotos de la carrera usando reconocimiento facial o buscando por tu número de dorsal.</p>
                            </div>
                            <button
                                onClick={() => window.open(event.photosLink, '_blank')}
                                className="relative z-10 w-full md:w-auto bg-athos-orange text-white font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors flex justify-center items-center gap-2 glow-effect"
                            >
                                Ver Fotos <ArrowRight size={18} />
                            </button>
                        </section>
                    )}
                </div>

                {/* Right Column: Sticky Action Card */}
                <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2">
                    <div className="sticky top-[100px] bg-white rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-6">
                        {actionCardContent}
                    </div>
                </div>

            </div>

            {/* EVENT REVIEWS SECTION */}
            <div className="max-w-[1400px] mx-auto px-6 py-12 border-t border-gray-100 mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-black italic text-athos-black uppercase mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-8 bg-athos-orange rounded-full"></div>
                            Experiencia de Corredores
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-black text-athos-orange">{event.rating || 0}</span>
                            <div className="flex flex-col">
                                {renderStars(event.rating || 0, 14)}
                                <span className="text-xs text-gray-400 font-bold mt-1">Basado en {event.reviewsCount || 0} opiniones</span>
                            </div>
                        </div>
                    </div>

                    {!showReviewForm && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-athos-black text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-athos-orange transition-colors shadow-lg"
                        >
                            Calificar Evento
                        </button>
                    )}
                </div>

                {showReviewForm && (
                    <div className="bg-gray-50 p-6 md:p-8 rounded-[30px] mb-12 animate-fade-in border border-gray-100 relative overflow-hidden">
                        <div className="relative z-10 w-full lg:w-2/3">
                            <h3 className="text-xl font-black italic text-athos-black uppercase mb-6">Comparte tu Experiencia</h3>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Tu Calificación</label>
                                <div className="flex gap-2" onMouseLeave={() => setHoverRating(0)}>
                                    {[0, 1, 2, 3, 4].map((index) => {
                                        const rating = hoverRating || newReviewRating;
                                        const full = rating >= index + 1;
                                        const half = rating >= index + 0.5 && rating < index + 1;

                                        return (
                                            <button
                                                key={index}
                                                className="relative w-10 h-10 focus:outline-none transition-transform hover:scale-110"
                                                onClick={(e) => handleStarClick(e, index)}
                                                onMouseMove={(e) => handleStarHover(e, index)}
                                            >
                                                <Star
                                                    size={40}
                                                    className={`${full ? "fill-athos-orange text-athos-orange" : "text-gray-300"} transition-colors`}
                                                />
                                                {half && (
                                                    <div className="absolute top-0 left-0 overflow-hidden w-[50%] pointer-events-none">
                                                        <Star size={40} className="fill-athos-orange text-athos-orange" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Tu Comentario</label>
                                <textarea
                                    value={newReviewComment}
                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                    placeholder="¿Cómo te pareció la organización, la ruta y la hidratación?"
                                    className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-athos-orange/20 outline-none font-medium h-32 resize-none placeholder:text-gray-300 text-athos-black transition-all"
                                ></textarea>
                            </div>

                            {/* Image Upload */}
                            <div className="mb-8">
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-3">Sube tu Medalla o Foto (Opcional)</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-600 hover:border-athos-orange hover:text-athos-orange transition-colors shadow-sm"
                                    >
                                        <Camera size={20} />
                                        <span>Buscar Foto</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    {newReviewImage && (
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md group border cursor-pointer">
                                            <img src={newReviewImage} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setNewReviewImage(null)}
                                                className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full backdrop-blur transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={submitReview}
                                    className="px-8 py-3 bg-athos-black text-white rounded-xl font-black uppercase tracking-widest hover:bg-athos-orange transition-colors shadow-lg shadow-athos-orange/20"
                                >
                                    Publicar Reseña
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* REVIEWS LIST */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {event.reviews && event.reviews.length > 0 ? (
                        event.reviews.map((review) => (
                            <div key={review.id} className="bg-white border border-gray-100 p-6 rounded-[24px] hover:shadow-lg transition-shadow flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                            {review.userAvatar ? (
                                                <img src={review.userAvatar} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-athos-black line-clamp-1">{review.userName}</h4>
                                            <p className="text-[10px] font-bold text-gray-400">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {renderStars(review.rating, 14)}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-4 flex-grow">"{review.comment}"</p>
                                {/* Modificado para soportar onClick en la imagen cargada por el usuario */}
                                {review.image && (
                                    <div 
                                        className="mt-2 rounded-xl overflow-hidden h-32 bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow relative group cursor-zoom-in"
                                        onClick={() => setIsFullScreenReviewImage(review.image || null)}
                                        title="Ver foto cargada"
                                    >
                                        <img src={review.image} className="w-full h-full object-cover" alt="Foto de la reseña" />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <Camera className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={24} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <Star className="text-gray-300 mx-auto mb-4" size={48} />
                            <p className="text-gray-500 font-bold mb-2 text-lg">Aún no hay calificaciones para este evento.</p>
                            <p className="text-sm text-gray-400">Si participaste, ¡sé el primero en compartir tu experiencia!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Review Image Modal */}
            {isFullScreenReviewImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in" 
                    onClick={() => setIsFullScreenReviewImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-[110]"
                        onClick={() => setIsFullScreenReviewImage(null)}
                    >
                        <X size={24} />
                    </button>
                    
                    <img
                        src={isFullScreenReviewImage}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl cursor-zoom-out z-[105] rounded-2xl"
                        alt="Visor de imagen de reseña"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFullScreenReviewImage(null);
                        }}
                    />
                </div>
            )}

            {/* Fullscreen Image Modal (Gallery) */}
            {selectedImageIndex !== null && event.gallery && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fade-in"
                    onClick={() => setSelectedImageIndex(null)}
                >
                    <button
                        onClick={() => setSelectedImageIndex(null)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-50"
                    >
                        <X size={28} />
                    </button>

                    {event.gallery.length > 1 && (
                        <>
                            <button
                                onClick={handlePrevImage}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-colors z-50 backdrop-blur-md"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={handleNextImage}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 md:p-4 rounded-full transition-colors z-50 backdrop-blur-md"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    <div className="relative w-full max-w-6xl max-h-screen flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        <img
                            src={event.gallery[selectedImageIndex]}
                            alt={`Imagen ${selectedImageIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-widest uppercase bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md">
                            {selectedImageIndex + 1} / {event.gallery.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
