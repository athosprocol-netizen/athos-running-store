
import React, { createContext, useContext, useState, PropsWithChildren, useEffect } from 'react';
import { UserProfile, CartItem, Product, ViewState, CustomizationOptions, Review } from './types';
import { INITIAL_USER, MOCK_PRODUCTS } from './constants';

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
  login: (email: string) => void;
  register: (name: string, email: string) => void;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [view, _setView] = useState<ViewState>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start loading

  // Simulate Fetching Data from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Add stock to mock products if missing (migration logic)
      const productsWithStock = MOCK_PRODUCTS.map(p => ({
        ...p,
        stock: p.stock !== undefined ? p.stock : Math.floor(Math.random() * 20)
      }));

      setProducts(productsWithStock);
      setIsLoading(false);
    };

    fetchProducts();
  }, []);

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

  // Wrapped setView to update History
  const setViewWithHistory = (newView: ViewState) => {
    // Don't push if it's the same view
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

  const login = (email: string) => {
    // Logic to simulate login - Load "Alejandro" only here
    const role = email.includes('admin') ? 'admin' : 'user';
    const baseUser = email === 'alejandro@athos.co' ? { ...INITIAL_USER, role: 'user' } : INITIAL_USER;

    setUser({
      ...baseUser,
      email: email,
      name: email.split('@')[0],
      role: role, // Default to user unless admin email
    });
    setViewWithHistory('home');
    showNotification(role === 'admin' ? "¡Hola Admin!" : "¡Bienvenido de nuevo!");
  };

  const register = (name: string, email: string) => {
    const newUser: UserProfile = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: name,
      role: 'user',
      coupons: [],
      wishlist: []
    };
    setUser(newUser);
    setViewWithHistory('home');
    showNotification(`¡Cuenta creada! Bienvenido, ${name}.`);
  };

  const logout = () => {
    setUser(null);
    setViewWithHistory('home');
    showNotification("Sesión cerrada correctamente");
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
    showNotification("Perfil actualizado exitosamente");
  };

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

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newReviews = [...(p.reviews || []), review];
        const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
        const newRating = totalRating / newReviews.length;

        return {
          ...p,
          reviews: newReviews,
          rating: parseFloat(newRating.toFixed(1)),
          reviewsCount: newReviews.length
        };
      }
      return p;
    }));
    showNotification("¡Gracias por tu reseña!");
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
