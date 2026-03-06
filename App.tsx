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
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Trigger page transition effect when view changes
  React.useEffect(() => {
    if (view !== displayView && !isLoading) {
      setIsTransitioning(true);

      if (videoRef.current) {
        // Skip first 0.5s to avoid pure black starting frames
        videoRef.current.currentTime = 0.5;
        videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
      }

      // Change the actual view component at the peak of the transition
      const timerMid = setTimeout(() => {
        setDisplayView(view);
        window.scrollTo(0, 0);
      }, 400);

      const timerEnd = setTimeout(() => {
        setIsTransitioning(false);
      }, 900);

      return () => {
        clearTimeout(timerMid);
        clearTimeout(timerEnd);
      };
    }
  }, [view, displayView, isLoading]);

  // Sync initial render correctly
  React.useEffect(() => {
    if (!isLoading && !isTransitioning) setDisplayView(view);
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

      {/* Global Video Transition Overlay (Always rendered, but hidden via inline styles to ensure video is cached and preloaded instantly) */}
      <div
        className="fixed inset-0 z-[500] pointer-events-none flex items-center justify-center overflow-hidden"
        style={{
          opacity: isTransitioning ? 1 : 0,
          visibility: isTransitioning ? 'visible' : 'hidden',
          transition: 'visibility 0s linear, opacity 0.3s ease-in-out',
          transitionDelay: isTransitioning ? '0s, 0s' : '0.3s, 0s'
        }}
      >
        {/* Dark backdrop so the mix-blend-screen fire actually appears over the white store background */}
        <div className="absolute inset-0 bg-black/95"></div>

        {/* Video overlay with screen blend to remove pure black background */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ mixBlendMode: 'screen', opacity: 0.95 }}
          src="/llamas.mp4"
        />
      </div>

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