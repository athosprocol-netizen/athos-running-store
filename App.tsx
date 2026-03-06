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
import { Support } from './views/Support';
import { ForgotPassword } from './views/ForgotPassword';
import { UpdatePassword } from './views/UpdatePassword';
import { EventsDirectory } from './views/EventsDirectory';
import { EventDetail } from './views/EventDetail';
import { EventRegistration } from './views/EventRegistration';
import { EventResults } from './views/EventResults';
import { OrganizerDashboard } from './views/OrganizerDashboard';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Marquee } from './components/Marquee';
import { BackgroundGlows } from './components/BackgroundGlows';

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
  const { view, isLoading } = useApp();
  const [displayView, setDisplayView] = React.useState(view);
  const [transitionKey, setTransitionKey] = React.useState(0);

  // Trigger page transition effect when view changes
  React.useEffect(() => {
    if (view !== displayView && !isLoading) {
      setTransitionKey(prev => prev + 1);
      // Change the actual view component at the peak of the transition (screen covered)
      const timer = setTimeout(() => {
        setDisplayView(view);
        window.scrollTo(0, 0); // Scroll to top on route change
      }, 300); // 300ms is the midpoint of the 0.6s animation when screen is fully covered
      return () => clearTimeout(timer);
    }
  }, [view, displayView, isLoading]);

  // Sync initial render correctly
  React.useEffect(() => {
    if (!isLoading && transitionKey === 0) setDisplayView(view);
  }, [isLoading]);

  const renderView = () => {
    if (isLoading) {
      return (
        <div className="flex-grow flex items-center justify-center min-h-[50vh]">
          <div className="text-athos-orange font-bold uppercase tracking-widest text-sm animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-athos-orange rounded-full animate-burn"></div>
            Cargando Sesión...
          </div>
        </div>
      );
    }
    switch (displayView) {
      case 'home': return <Home />;
      case 'shop': return <Shop />;
      case 'product': return <ProductDetail />;
      case 'profile': return <Profile />;
      case 'cart': return <Cart />;
      case 'auth': return <Auth />;
      case 'size-guide': return <SizeGuide />;
      case 'admin': return <Admin />;
      case 'checkout': return <Checkout />;
      case 'support': return <Support />;
      case 'forgot-password': return <ForgotPassword />;
      case 'update-password': return <UpdatePassword />;
      case 'events': return <EventsDirectory />;
      case 'event-detail': return <EventDetail />;
      case 'event-registration': return <EventRegistration />;
      case 'event-results': return <EventResults />;
      case 'organizer': return <OrganizerDashboard />;
      default: return <Home />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-athos-bg text-athos-black font-sans selection:bg-athos-orange selection:text-white flex flex-col relative overflow-x-hidden">
      <BackgroundGlows />

      {/* Global Speed Transition Overlay */}
      {transitionKey > 0 && (
        <div
          key={transitionKey}
          className="fixed inset-0 z-[200] pointer-events-none flex"
          style={{ animation: 'sprintWipe 0.6s cubic-bezier(0.8, 0, 0.2, 1) forwards' }}
        >
          <div className="w-[150%] md:w-[120%] h-[120%] -top-[10%] bg-athos-orange transform -skew-x-[15deg] shadow-[0_0_80px_rgba(255,77,0,0.8)] border-r-8 md:border-r-[16px] border-athos-black relative flex items-center justify-end pr-32">
            <div className="text-athos-black/20 font-black italic text-8xl md:text-[150px] uppercase tracking-tighter mix-blend-overlay transform skew-x-[15deg]">ATHOS</div>
          </div>
          <style>{`
                @keyframes sprintWipe {
                    0% { transform: translateX(-150%); }
                    100% { transform: translateX(150%); }
                }
            `}</style>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <Navbar />
        <div className="mt-[67px] md:mt-[92px]"> {/* Exact Spacer for fixed navbar height */}
          <Marquee />
        </div>
        <Notification />
        <main className="w-full flex-grow"> {/* Removed pt-0 md:pt-4 gap */}
          {renderView()}
        </main>
        <Footer />
      </div>
      <WhatsAppButton />
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