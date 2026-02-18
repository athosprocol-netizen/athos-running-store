import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { UserProfile, CartItem, Product, ViewState, CustomizationOptions, Review } from './types';
import { INITIAL_USER, MOCK_PRODUCTS } from './constants';
import { supabase } from './lib/supabase';

interface AppContextType {
  user: UserProfile | null;
  products: Product[];
  cart: CartItem[];
  view: ViewState;
  isLoading: boolean; // New Loading State
  selectedProductId: string | null;
  notification: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setView: (view: ViewState) => void;
  selectProduct: (id: string) => void;
  addToCart: (product: Product, size?: string, customization?: CustomizationOptions) => void;
  joinChallenge: (id: string) => void;
  checkout: () => void;
  confirmOrder: () => void;
  showNotification: (msg: string) => void;
  login: (email: string, password?: string) => void;
  register: (name: string, email: string, password?: string) => void;
  logout: () => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, _setView] = useState<ViewState>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start TRUE to wait for session check

  // 1. SUPABASE AUTH & INITIAL LOAD
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Check for active session
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session?.user) {
            console.log("Sesión activa:", session.user.email);
            // Load profile but don't block the entire UI if it takes too long
            await loadUserProfile(session.user);
          }
        }
      } catch (error) {
        console.error("Error inicializando:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setCart([]);
        setViewWithHistory('home');
      } else if (event === 'SIGNED_IN' && session?.user) {
        if (!user) await loadUserProfile(session.user);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ... (loadUserProfile stays same)

  // 2. FETCH REVIEWS
  // ...

  // ...

  const login = async (email: string, password?: string) => {
    if (!password) {
      alert("Se requiere contraseña");
      return;
    }

    setIsLoading(true);

    try {
      // Standard Supabase Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showNotification(error.message);
      } else if (data.session) {
        showNotification("¡Bienvenido!");
        setViewWithHistory('home');
        // Profile will load via onAuthStateChange or we can force it
        loadUserProfile(data.session.user);
      }
    } catch (e: any) {
      console.error(e);
      showNotification("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (authUser: any) => {
    try {
      // Fetch detailed profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUser({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role || 'user',
          avatar: profile.avatar_url,
          wishlist: [],
          coupons: []
        });
      } else {
        console.warn("Perfil no encontrado en DB, usando metadatos", error);
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: authUser.user_metadata?.name || 'Usuario',
          role: 'user',
          avatar: authUser.user_metadata?.avatar_url,
          wishlist: [],
          coupons: []
        });
      }
    } catch (e) {
      console.error("Error cargando perfil:", e);
    }
  };

  // 2. FETCH REVIEWS (Merge DB reviews with Mock Products)
  const fetchReviews = async () => {
    const { data: dbReviews, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    // Merge mock products with DB reviews
    const updatedProducts = MOCK_PRODUCTS.map(p => {
      const productReviews = dbReviews.filter((r: any) => r.product_id === p.id).map((r: any) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        userAvatar: r.user_avatar,
        rating: r.rating,
        comment: r.comment,
        date: new Date(r.created_at).toLocaleDateString(),
        image: r.image_url
      }));

      // Combine with hardcoded mock reviews if any
      const allReviews = [...(p.reviews || []), ...productReviews];
      const totalRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : p.rating;

      return {
        ...p,
        reviews: allReviews,
        rating: parseFloat(totalRating.toFixed(1)),
        reviewsCount: allReviews.length
      };
    });

    setProducts(updatedProducts);
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

  const setViewWithHistory = (newView: ViewState) => {
    if (view !== newView) {
      window.history.pushState({ view: newView }, '', `?view=${newView}`);
      _setView(newView);
      window.scrollTo(0, 0);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- SUPABASE ACTIONS ---

  const login = async (email: string, password?: string) => {
    if (!password) {
      alert("Se requiere contraseña");
      return;
    }

    setIsLoading(true);

    try {
      showNotification("1. Limpiando estado anterior...");

      // Force clear any stale session state before logging in
      // Wrapped in a short timeout race to ensure it doesn't block the UI if it hangs
      try {
        await Promise.race([
          supabase.auth.signOut(),
          new Promise(res => setTimeout(res, 1000))
        ]);
      } catch (err) {
        console.warn("SignOut de limpieza falló (no importa):", err);
      }

      showNotification("2. Enviando credenciales...");

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout 10s")), 10000)
      );

      const { data, error } = await Promise.race([
        supabase.auth.signInWithPassword({ email, password }),
        timeoutPromise
      ]) as any;

      showNotification("3. Respuesta recibida.");

      if (error) {
        showNotification("ERROR: " + error.message);
      } else if (data.session) {
        showNotification("¡ÉXITO! Redirigiendo...");
        setViewWithHistory('home');
        loadUserProfile(data.session.user);
      } else {
        showNotification("Raro: Sin sesión y sin error.");
      }
    } catch (e: any) {
      showNotification("EXCEPCIÓN: " + (e.message || e));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    if (!password) {
      alert("Contraseña requerida");
      return;
    }

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
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setViewWithHistory('home');
    showNotification("Sesión cerrada correctamente");
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;

    // Update local state
    setUser({ ...user, ...data });

    // Update DB
    const updates: any = {};
    if (data.name) updates.name = data.name;
    if (data.avatar) updates.avatar_url = data.avatar;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) console.error(error);
    }

    showNotification("Perfil actualizado");
  };

  // Keep these mostly local for now as per requirements scope
  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    showNotification("Producto actualizado");
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    showNotification("Producto añadido al catálogo");
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotification("Producto eliminado");
  };

  // REVIEWS: INSERT INTO SUPABASE
  const addReview = async (productId: string, review: Review) => {
    if (!user) return;

    // 1. Upload Image if present (Base64 -> Blob -> Storage)
    let imageUrl = null;
    if (review.image && review.image.startsWith('data:')) {
      try {
        const res = await fetch(review.image);
        const blob = await res.blob();
        const fileName = `${Date.now()}-${productId}.jpg`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, blob);

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('review-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      } catch (e) {
        console.error("Error uploading image", e);
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

  const selectProduct = (id: string) => {
    setSelectedProductId(id);
    setViewWithHistory('product');
    window.scrollTo(0, 0);
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

  const confirmOrder = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      user,
      products,
      cart,
      view,
      isLoading,
      selectedProductId,
      notification,
      setSearchQuery,
      setView: setViewWithHistory,
      selectProduct,
      addToCart,
      joinChallenge,
      checkout,
      confirmOrder,
      showNotification,
      login,
      register,
      logout,
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
