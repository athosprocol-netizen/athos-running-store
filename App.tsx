import React from 'react';
import { AppProvider, useApp } from './context';
import { Navbar } from './components/Navbar';
import { Home } from './views/Home';
import { Shop } from './views/Shop';
import { ProductDetail } from './views/ProductDetail';
import { Profile } from './views/Profile';
import { Cart } from './views/Cart';
import { Auth } from './views/Auth';
import { SizeGuide } from './views/SizeGuide';
import { Admin } from './views/Admin';
import { Checkout } from './views/Checkout';
import { Footer } from './components/Footer';

const Notification = () => {
    const { notification } = useApp();
    if (!notification) return null;
    return (
        <div className="fixed top-24 right-4 z-[100] bg-athos-black text-white px-6 py-4 shadow-[0_0_20px_rgba(255,77,0,0.4)] animate-fade-in font-bold flex items-center gap-3 max-w-xs md:max-w-md border-l-4 border-athos-orange">
            <div className="w-2 h-2 bg-athos-orange rounded-full animate-burn"></div>
            {notification}
        </div>
    );
};

const MainContent = () => {
  const { view } = useApp();

  const renderView = () => {
    switch (view) {
      case 'home': return <Home />;
      case 'shop': return <Shop />;
      case 'product': return <ProductDetail />;
      case 'profile': return <Profile />;
      case 'cart': return <Cart />;
      case 'auth': return <Auth />;
      case 'size-guide': return <SizeGuide />;
      case 'admin': return <Admin />;
      case 'checkout': return <Checkout />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-athos-bg text-athos-black font-sans selection:bg-athos-orange selection:text-white flex flex-col">
      <Navbar />
      <Notification />
      <main className="w-full flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
};

export default App;