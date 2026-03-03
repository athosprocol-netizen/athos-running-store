import React, { createContext, useContext, useState, PropsWithChildren, useEffect, useRef } from 'react';
import { UserProfile, CartItem, Product, ViewState, CustomizationOptions, Review, Event, EventRegistration, EventResult } from './types';
import { INITIAL_USER, MOCK_PRODUCTS } from './constants';
import { supabase } from './lib/supabase';

// Mock initial events to speed up UI development
const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Maratón Medellín 2026',
    date: '2026-09-06T06:00:00Z',
    location: 'Parque de las Luces',
    city: 'Medellín',
    description: 'La maratón más esperada de Colombia.',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org1',
    isFeatured: true,
    distances: ['42K', '21K', '10K', '5K'],
    status: 'upcoming',
    maxParticipants: 15000,
    currentParticipants: 8500
  },
  {
    id: 'e2',
    title: 'Trail Run Andes',
    date: '2026-06-15T05:30:00Z',
    location: 'Represa del Sisga',
    city: 'Bogotá',
    description: 'Desafío en montaña con paisajes increíbles.',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerId: 'org2',
    isFeatured: false,
    distances: ['21K', '10K'],
    status: 'upcoming',
    maxParticipants: 2000,
    currentParticipants: 1200
  }
];

interface AppContextType {
  user: UserProfile | null;
  products: Product[];
  cart: CartItem[];
  recentlyViewed: Product[];
  view: ViewState;
  isLoading: boolean; // New Loading State
  selectedProductId: string | null;
  selectedEventId: string | null;
  // Events state
  events: Event[];
  registrations: EventRegistration[];
  results: EventResult[];
  notification: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  setView: (view: ViewState) => void;
  selectProduct: (id: string) => void;
  addToCart: (product: Product, size?: string, customization?: CustomizationOptions) => void;
  removeFromCart: (cartId: string) => void;
  updateCartItemQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  // Events Functions
  selectEvent: (id: string) => void;
  addEvent: (event: Event) => void;
  registerForEvent: (registration: EventRegistration) => void;
  joinChallenge: (id: string) => void;
  checkout: () => void;
  confirmOrder: (proofUrl?: string | null) => void;
  showNotification: (msg: string) => void;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Review) => void;
  toggleWishlist: (productId: string) => void;
  shareWishlist: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('athos_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('athos_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [view, _setView] = useState<ViewState>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [results, setResults] = useState<EventResult[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start TRUE to wait for session check
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const fetchReviews = async () => {
    try {
      const { data: dbReviews, error } = await supabase.from('reviews').select('*');
      if (!error && dbReviews) {
        setProducts(prevProducts => prevProducts.map(p => {
          const productReviews = dbReviews.filter(r => r.product_id === p.id).map(r => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name,
            userAvatar: r.user_avatar,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString(),
            image: r.image_url
          }));

          return {
            ...p,
            reviews: productReviews,
            reviewsCount: productReviews.length,
            rating: productReviews.length > 0
              ? Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1))
              : p.rating
          };
        }));
      }
    } catch (e) {
      console.error("Error fetching reviews", e);
    }
  };

  // 1. SUPABASE AUTH & INITIAL LOAD
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Safety timeout to force loading false if Supabase hangs
      const safetyTimeout = setTimeout(() => {
        if (mounted) setIsLoading(false);
      }, 3000);

      try {
        // Fetch custom products
        const { data: dbProducts } = await supabase.from('products').select('*');
        if (dbProducts && dbProducts.length > 0) {
          const mappedCustomProducts = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            subtitle: p.subtitle || '',
            category: p.category as Product['category'],
            price: p.price,
            image: p.image,
            images: p.images || [],
            description: p.description || '',
            tags: p.tags || [],
            stock: p.stock || 0,
            variants: p.variants || [],
            rating: p.rating || 0,
            reviewsCount: p.reviews_count || 0
          }));

          // Render local mocks + loaded custom DB products ensuring no duplicates
          setProducts(prev => {
            const newIds = new Set(mappedCustomProducts.map(cp => cp.id));
            const filteredMocks = prev.filter(mp => !newIds.has(mp.id));
            return [...filteredMocks, ...mappedCustomProducts];
          });
        }

        // Check for active session
        const { data: { session } } = await supabase.auth.getSession();

        await fetchReviews();

        if (mounted) {
          // Handle Hash routing for Password Recovery explicitly
          // Supabase uses the hash fragment instead of standard query params
          if (window.location.hash.includes('type=recovery')) {
            console.log("Detectado hash de type=recovery en carga inicial");
            _setView('update-password');
          } else if (session?.user) {
            console.log("Sesión activa:", session.user.email);
            // Load profile but don't block the entire UI if it takes too long
            await loadUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error("Error inicializando:", error);
      } finally {
        clearTimeout(safetyTimeout);
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth Event: ${event}`, session?.user?.email);

      if (event === 'SIGNED_OUT') {
        // Double check: sometimes SIGNED_OUT fires but we still have a session in storage/memory
        // or it's a false positive during initial load.
        // We only clear if we are SURE.
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.log("Confirmed SIGNED_OUT, clearing user.");
          setUser(null);
          setCart([]);
          // Don't force redirect to home immediately, allows user to realize they were logged out
          // setViewWithHistory('home'); 
        } else {
          console.log("Ignored SIGNED_OUT because session still exists (race condition?)");
        }
      } else if (event === 'SIGNED_IN' && session?.user) {
        if (!user || user.id !== session.user.id) {
          // Do not await this. Blocking onAuthStateChange blocks the entire GoTrue 
          // state machine and prevents the login Promise from resolving.
          loadUserProfile(session.user).catch(console.error);
        }
      } else if (event === 'PASSWORD_RECOVERY') {
        console.log("Evento PASSWORD_RECOVERY detectado");
        setViewWithHistory('update-password');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('athos_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('athos_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const setViewWithHistory = (newView: ViewState) => {
    if (view !== newView) {
      window.history.pushState({ view: newView }, '', `?view=${newView}`);
      _setView(newView);
      window.scrollTo(0, 0);
    }
  };

  const setView = (newView: ViewState) => {
    setViewWithHistory(newView);
  };

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    setViewWithHistory('product');

    const product = products.find(p => p.id === id);
    if (product) {
      setRecentlyViewed(prev => {
        const filtered = prev.filter(p => p.id !== id);
        return [product, ...filtered].slice(0, 4); // Keep only the first 4
      });
    }
  };

  const login = async (email: string, password?: string) => {
    if (!password) {
      alert("Se requiere contraseña");
      return;
    }

    try {
      console.log("Iniciando sesión con:", email);
      showNotification("Conectando con el servidor...");

      setIsLoading(true);

      // Wrapper with explicit timeout in case Supabase network hangs
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado. Verifica tu conexión e intenta nuevamente.")), 10000)
      );

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error("Error Login:", error.message);

        // If it was a timeout, it means the Supabase SDK is stuck. 
        // The most reliable way to unstick it is a full page reload.
        if (error.message.includes("Tiempo de espera agotado")) {
          showNotification("Reconectando sesión...");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          return;
        }

        showNotification(error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message);
      } else if (data.session) {
        console.log("Login exitoso en Login Function. Delegando carga de perfil al ON_AUTH_STATE_CHANGE...");

        // We set a placeholder immediately so the UI responds
        const sessionUser = data.session.user;
        setUser({
          id: sessionUser.id,
          email: sessionUser.email || '',
          name: sessionUser.user_metadata?.name || 'Cargando...',
          role: 'user',
          avatar: sessionUser.user_metadata?.avatar_url,
          wishlist: [],
          coupons: []
        });

        // 2. NAVIGATE IMMEDIATELY
        setViewWithHistory('home');
        showNotification("¡Bienvenido de nuevo!");

        // Profile loading is handled by the onAuthStateChange listener on SIGNED_IN event.
      } else if (data.user && !data.session) {
        // Email not confirmed case
        console.warn("Usuario identificado pero sin sesión (Email no confirmado).");
        alert("Por favor confirma tu correo electrónico para iniciar sesión.");
        showNotification("Verifica tu correo electrónico.");
      } else {
        console.error("Estado desconocido post-login:", data);
        showNotification("Error desconocido al iniciar sesión.");
      }
    } catch (e: any) {
      console.error("Excepción en login:", e);
      // Show actual error message to user
      showNotification(e.message || "Error desconocido al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (authUser: any) => {
    try {
      console.log("Cargando perfil para:", authUser.email);
      // Fetch detailed profile with a strict timeout to prevent infinite hangs on second login
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const profileTimeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout cargando perfil")), 5000)
      );

      const { data: profile, error } = await Promise.race([profilePromise, profileTimeout]) as any;

      if (profile) {
        console.log("Perfil encontrado en DB");
        const profileEmail = profile.email || authUser.email || '';
        setUser({
          id: profile.id,
          email: profileEmail,
          name: profile.name,
          role: profileEmail.toLowerCase() === 'kaieke37@gmail.com' ? 'admin' : (profile.role || 'user'),
          avatar: profile.avatar_url,
          age: profile.age,
          location: profile.location,
          address: profile.address,
          phone: profile.phone,
          wishlist: [],
          coupons: []
        });
      } else {
        console.warn("Perfil no encontrado en DB, usando metadatos. Error:", error?.message);
        // Fallback to metadata
        const authEmail = authUser.email || '';
        setUser({
          id: authUser.id,
          email: authEmail,
          name: authUser.user_metadata?.name || 'Usuario',
          role: authEmail.toLowerCase() === 'kaieke37@gmail.com' ? 'admin' : 'user',
          avatar: authUser.user_metadata?.avatar_url,
          wishlist: [],
          coupons: []
        });
      }
    } catch (e) {
      console.error("EXCEPCIÓN cargando perfil:", e);
      //CRITICAL FALLBACK: Ensure user is set even if DB fails/throws
      const fallbackEmail = authUser.email || '';
      setUser({
        id: authUser.id,
        email: fallbackEmail,
        name: authUser.user_metadata?.name || 'Usuario',
        role: fallbackEmail.toLowerCase() === 'kaieke37@gmail.com' ? 'admin' : 'user',
        avatar: authUser.user_metadata?.avatar_url,
        wishlist: [],
        coupons: []
      });
    }
  };

  // Browser History Handling
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        _setView(event.state.view);
      } else {
        _setView('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNotification = (msg: string | null, persistent: boolean = false) => {
    setNotification(msg);
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    if (msg && !persistent) {
      notificationTimeoutRef.current = setTimeout(() => {
        setNotification(null);
      }, 4500);
    }
  };

  // --- SUPABASE ACTIONS ---



  const register = async (name: string, email: string, password?: string) => {
    if (!password) {
      alert("Contraseña requerida");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Intentando registro con:", email);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            avatar_url: `https://ui-avatars.com/api/?name=${name}&background=FF4D00&color=fff`
          }
        }
      });

      console.log("Respuesta Supabase:", data, error);

      if (error) {
        console.error("Error en registro:", error);
        showNotification(error.message);
        alert("Error: " + error.message); // Force visibility
      } else {
        if (data.user && !data.session) {
          console.log("Usuario creado pero sin sesión (¿Esperando confirmación de email?)");
          alert("Cuenta creada. REVISA TU EMAIL para confirmar antes de iniciar sesión.");
        }

        // Backup: Manually create profile if session exists (Auto Confirm ON)
        if (data.session?.user) {
          console.log("Sesión activa, intentando crear perfil manual...");
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user!.id,
            email: email,
            name: name,
            role: 'user',
            avatar_url: `https://ui-avatars.com/api/?name=${name}&background=FF4D00&color=fff`
          });
          if (profileError) {
            console.error("Error creando perfil manual:", profileError);
            alert("Error guardando perfil: " + profileError.message);
          } else {
            console.log("Perfil creado manualmente con éxito.");
          }
        }

        showNotification("Cuenta creada. ¡Bienvenido al Club!");
        if (data.session) {
          setViewWithHistory('home');
        }
      }
    } catch (e: any) {
      console.error("Unexpected error in register:", e);
      showNotification("Error inesperado en registro");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Optimistic logout to make the UI feel fast
    setUser(null);
    setCart([]);
    setViewWithHistory('home');
    showNotification("Sesión cerrada correctamente");

    // Aggressively clear localStorage tokens
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
        localStorage.removeItem(key);
      }
    });

    try {
      // Fire and forget server logout. Do NOT await this, as it can hang
      // if the token was just wiped from localStorage.
      supabase.auth.signOut({ scope: 'local' }).catch(() => { });
    } catch (e) {
      console.error("Error en logout:", e);
    }

    // Force strict reload to completely wipe React memory state
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?view=update-password`,
      });
      if (error) throw error;
      showNotification("Correo de recuperación enviado. Revisa tu bandeja de entrada.", true);
      setViewWithHistory('home');
    } catch (e: any) {
      console.error(e);
      showNotification(e.message || "Error al enviar el correo.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (password: string) => {
    setIsLoading(true);
    try {
      const updatePromise = supabase.auth.updateUser({ password });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tiempo de espera agotado. Verifica tu conexión e intenta nuevamente.")), 10000)
      );

      const { data, error } = await Promise.race([updatePromise, timeoutPromise]) as any;

      if (error) throw error;

      showNotification("Contraseña actualizada exitosamente.");

      // Auto-logout so they are forced to log in with the new password
      // We use a delayed full page reload to completely wipe the recovery session 
      // from memory and state, preventing the "hanging login" bug on the next attempt.
      await supabase.auth.signOut({ scope: 'local' });

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (e: any) {
      console.error(e);
      showNotification(e.message || "Error al actualizar contraseña.", true);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    // Update local state
    setUser({ ...user, ...data });

    // Update DB
    const updates: any = {};
    if (data.name !== undefined) updates.name = data.name;
    if (data.avatar !== undefined) updates.avatar_url = data.avatar;
    if (data.age !== undefined) updates.age = data.age;
    if (data.location !== undefined) updates.location = data.location;
    if (data.address !== undefined) updates.address = data.address;
    if (data.phone !== undefined) updates.phone = data.phone;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) console.error(error);
    }

    showNotification("Perfil actualizado");
  };

  // IMAGE UPLOADER HELPER
  const dataURItoBlob = (dataURI: string) => {
    const split = dataURI.split(',');
    const byteString = atob(split[1]);
    const mimeString = split[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  };

  const uploadProductImage = async (base64Image: string, productId: string, suffix: string = '') => {
    if (!base64Image.startsWith('data:')) return base64Image;
    try {
      const blob = dataURItoBlob(base64Image);
      const fileName = `${productId}${suffix}-${Date.now()}.jpg`;

      const uploadPromise = supabase.storage.from('product-images').upload(fileName, blob);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("La subida de la imagen tardó demasiado (Timeout). Intenta con una foto más ligera.")), 15000)
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (!error && data) {
        return supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
      } else {
        console.error("Error al subir imagen Supabase:", error);
        throw new Error(error?.message || "Error desconocido en el servidor de fotos.");
      }
    } catch (e: any) {
      console.error("Excepción al subir foto:", e);
      throw new Error(e?.message || "El navegador falló al procesar la imagen.");
    }
  };

  const uploadImageArray = async (images: string[] | undefined, productId: string, suffix: string) => {
    if (!images || images.length === 0) return [];
    const uploadedUrls: string[] = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.startsWith('data:')) {
        const url = await uploadProductImage(img, productId, `${suffix}-${i}`);
        uploadedUrls.push(url);
      } else {
        uploadedUrls.push(img);
      }
    }
    return uploadedUrls;
  };

  // PERSISTENT PRODUCTS
  const updateProduct = async (updatedProduct: Product) => {
    // Optimistic UI Update
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification("⏳ Guardando cambios en la nube... No cierres esta ventana.", true);

    let productToSave = { ...updatedProduct };

    try {
      let mainImg = updatedProduct.image;
      if (mainImg.startsWith('data:')) {
        mainImg = await uploadProductImage(mainImg, updatedProduct.id);
        if (mainImg.startsWith('data:')) throw new Error("Falló subida de foto principal.");
      }

      let galleryImgs = await uploadImageArray(updatedProduct.images, updatedProduct.id, '-gallery');

      // Process Variants
      let processedVariants = updatedProduct.variants ? [...updatedProduct.variants] : [];
      for (let i = 0; i < processedVariants.length; i++) {
        if (processedVariants[i].image?.startsWith('data:')) {
          processedVariants[i].image = await uploadProductImage(
            processedVariants[i].image,
            updatedProduct.id,
            `-var-${processedVariants[i].id}`
          );
          if (processedVariants[i].image.startsWith('data:')) throw new Error("Falló subida de foto de variante.");
        }
        processedVariants[i].images = await uploadImageArray(
          processedVariants[i].images,
          updatedProduct.id,
          `-var-${processedVariants[i].id}-gallery`
        );
      }

      productToSave = { ...updatedProduct, image: mainImg, images: galleryImgs, variants: processedVariants };
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? productToSave : p)); // Update with real URLs

      const cleanPayload = {
        id: productToSave.id,
        name: productToSave.name || 'Sin Título',
        subtitle: productToSave.subtitle || '',
        price: productToSave.price || 0,
        category: productToSave.category || 'shoes',
        description: productToSave.description || '',
        image: productToSave.image || '',
        images: Array.isArray(productToSave.images) ? productToSave.images : [],
        tags: Array.isArray(productToSave.tags) ? productToSave.tags : [],
        variants: Array.isArray(productToSave.variants) ? productToSave.variants.map(v => ({
          id: v.id,
          colorName: v.colorName || '',
          price: v.price || 0,
          image: v.image || '',
          images: Array.isArray(v.images) ? v.images : []
        })) : [],
        stock: productToSave.stock || 0,
        sku: productToSave.sku || '',
        is_customizable: productToSave.isCustomizable || false
      };

      console.log("Enviando a BD (UPDATE):", cleanPayload);

      const { error } = await supabase.from('products').upsert(cleanPayload);

      if (error) throw error;
      showNotification("Producto actualizado exitosamente");

    } catch (e: any) {
      console.error("Excepción actualizando producto:", e);
      showNotification("Error crítico: " + (e?.message || "No se pudo actualizar"));
    }
  };

  const addProduct = async (newProduct: Product) => {
    // Optimistic UI Update
    setProducts(prev => [...prev, newProduct]);
    showNotification("⏳ Subiendo producto y fotos... No cierres esta ventana.", true);

    let productToSave = { ...newProduct };

    try {
      let mainImg = newProduct.image;
      if (mainImg.startsWith('data:')) {
        mainImg = await uploadProductImage(mainImg, newProduct.id);
        if (mainImg.startsWith('data:')) throw new Error("Falló subida de foto principal.");
      }

      let galleryImgs = await uploadImageArray(newProduct.images, newProduct.id, '-gallery');

      // Process Variants
      let processedVariants = newProduct.variants ? [...newProduct.variants] : [];
      for (let i = 0; i < processedVariants.length; i++) {
        if (processedVariants[i].image?.startsWith('data:')) {
          processedVariants[i].image = await uploadProductImage(
            processedVariants[i].image,
            newProduct.id,
            `-var-${processedVariants[i].id}`
          );
          if (processedVariants[i].image.startsWith('data:')) throw new Error("Falló subida de foto de variante.");
        }
        processedVariants[i].images = await uploadImageArray(
          processedVariants[i].images,
          newProduct.id,
          `-var-${processedVariants[i].id}-gallery`
        );
      }

      productToSave = { ...newProduct, image: mainImg, images: galleryImgs, variants: processedVariants };
      setProducts(prev => prev.map(p => p.id === newProduct.id ? productToSave : p)); // Update with real URLs

      const cleanPayload = {
        id: productToSave.id,
        name: productToSave.name || 'Sin Título',
        subtitle: productToSave.subtitle || '',
        price: productToSave.price || 0,
        category: productToSave.category || 'shoes',
        description: productToSave.description || '',
        image: productToSave.image || '',
        images: Array.isArray(productToSave.images) ? productToSave.images : [],
        tags: Array.isArray(productToSave.tags) ? productToSave.tags : [],
        variants: Array.isArray(productToSave.variants) ? productToSave.variants.map(v => ({
          id: v.id,
          colorName: v.colorName || '',
          price: v.price || 0,
          image: v.image || '',
          images: Array.isArray(v.images) ? v.images : []
        })) : [],
        stock: productToSave.stock || 0,
        sku: productToSave.sku || '',
        is_customizable: productToSave.isCustomizable || false
      };

      console.log("Enviando a BD (INSERT):", cleanPayload);

      const { error } = await supabase.from('products').insert(cleanPayload);

      if (error) throw error;
      showNotification("Producto guardado permanente");

    } catch (e: any) {
      console.error("Excepción insertando producto:", e);
      showNotification("Error crítico al crear: " + (e?.message || "Desconocido"));
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
    showNotification("Producto eliminado");
  };

  // REVIEWS: INSERT INTO SUPABASE
  const addReview = async (productId: string, review: Review) => {
    if (!user) return;

    // 1. Upload Image if present (Base64 -> Blob -> Storage)
    let imageUrl = null;
    if (review.image && review.image.startsWith('data:')) {
      try {
        const blob = dataURItoBlob(review.image);
        const fileName = `${Date.now()}-${productId}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, blob);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('review-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        } else {
          console.error("Supabase Storage Error:", uploadError);
          throw uploadError;
        }
      } catch (e) {
        console.error("Error uploading review image", e);
        showNotification("Hubo un problema subiendo tu foto, intenta sin ella o con una más ligera.");
        return; // Stop review submission if photo upload explicitly failed
      }
    }

    // 2. Insert Review to DB
    const { error } = await supabase.from('reviews').insert({
      product_id: productId,
      user_id: user.id,
      user_name: user.name,
      user_avatar: user.avatar,
      rating: review.rating,
      comment: review.comment,
      image_url: imageUrl || review.image
    });

    if (error) {
      showNotification("Error al guardar reseña");
      console.error(error);
      return;
    }

    showNotification("¡Reseña publicada!");
    await fetchReviews(); // Refresh
  };

  const addToCart = (product: Product, size?: string, customization?: CustomizationOptions) => {
    const newItem: CartItem = {
      cartId: Math.random().toString(36).substr(2, 9),
      product,
      quantity: 1,
      size,
      customization
    };
    setCart([...cart, newItem]);
    showNotification("Agregado al Carrito");
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateCartItemQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    if (!user) {
      setViewWithHistory('auth');
      return;
    }
    const exists = user.wishlist.includes(productId);
    const newWishlist = exists
      ? user.wishlist.filter(id => id !== productId)
      : [...user.wishlist, productId];

    setUser({ ...user, wishlist: newWishlist });
    showNotification(exists ? "Eliminado de Deseos" : "Agregado a Deseos");
  };

  const shareWishlist = () => {
    const dummyLink = `https://athos.co/wishlist/${user?.id || 'guest'}`;
    navigator.clipboard.writeText(dummyLink);
    showNotification("Enlace copiado al portapapeles");
  };

  const selectEvent = (id: string) => {
    setSelectedEventId(id);
    setViewWithHistory('event-detail');
  };

  const addEvent = (event: Event) => {
    setEvents(prev => [...prev, event]);
    showNotification("Evento creado exitosamente");
  };

  const registerForEvent = (registration: EventRegistration) => {
    setRegistrations(prev => [...prev, registration]);
    // update user history logic would go here if backend supported
    showNotification("Inscripción confirmada. ¡Nos vemos en la meta!");
  };

  const joinChallenge = (id: string) => {
    if (!user) {
      setViewWithHistory('auth');
      return;
    }
    setUser(prev => prev ? ({ ...prev, activeChallengeId: id }) : null);
    showNotification("¡Te uniste al reto!");
  };

  const checkout = () => {
    if (!user) {
      setViewWithHistory('auth');
      showNotification("Inicia sesión para comprar");
      return;
    }
    setViewWithHistory('checkout');
    window.scrollTo(0, 0);
  };

  const confirmOrder = (proofUrl?: string | null) => {
    console.log("Order Confirmed. Proof:", proofUrl);
    setCart([]);
    showNotification("Orden recibida. Te contactaremos pronto.");
  };

  return (
    <AppContext.Provider value={{
      user,
      products,
      cart,
      recentlyViewed,
      view,
      isLoading,
      selectedProductId,
      selectedEventId,
      events,
      registrations,
      results,
      notification,
      searchQuery,
      setSearchQuery,
      activeCategory,
      setActiveCategory,
      setView: setViewWithHistory,
      selectProduct,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      selectEvent,
      addEvent,
      registerForEvent,
      joinChallenge,
      checkout,
      confirmOrder,
      showNotification,
      login,
      register,
      logout,
      resetPassword,
      updatePassword,
      updateUserProfile,
      updateProduct,
      addProduct,
      deleteProduct,
      addReview,
      toggleWishlist,
      shareWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
