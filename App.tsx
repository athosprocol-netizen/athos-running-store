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
import { SponsorEvent } from './views/SponsorEvent';
import { ZonaRunning } from './views/ZonaRunning';
import { Marcas } from './views/Marcas';
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
  const { view, isLoading, products, events, selectedProductId, selectedEventId } = useApp();

  // ─── Dynamic SEO: title, meta description, OG tags, Twitter Cards, JSON-LD ───
  React.useEffect(() => {
    const base = 'ATHOS Running Store';
    const siteUrl = 'https://www.athosrun.co';
    const defaultDesc = 'ATHOS Running Store: La Pasión por Correr. Tienda especializada en running con los mejores eventos, calzado y ropa técnica en Colombia.';
    const defaultImg = `${siteUrl}/logo.png`;

    const titleMap: Record<string, string> = {
      home: `${base} – Tienda de Running en Colombia`,
      shop: `Tienda de Running | ${base}`,
      events: `Eventos de Running en Colombia | ${base}`,
      marcas: `Nuestras Marcas | ${base}`,
      'zona-running': `Zona Running – App para Corredores | ${base}`,
      support: `Soporte y Preguntas Frecuentes | ${base}`,
      'size-guide': `Guía de Tallas | ${base}`,
      cart: `Mi Carrito | ${base}`,
      checkout: `Finalizar Compra | ${base}`,
      profile: `Mi Perfil | ${base}`,
      auth: `Iniciar Sesión | ${base}`,
      'forgot-password': `Recuperar Contraseña | ${base}`,
      'update-password': `Nueva Contraseña | ${base}`,
      admin: `Panel Admin | ${base}`,
      organizer: `Panel Organizador | ${base}`,
      'sponsor-event': `Patrocina tu Evento | ${base}`,
    };

    const descMap: Record<string, string> = {
      home: 'ATHOS Running Store: Tienda de running en Colombia. Calzado técnico, ropa deportiva, accesorios y el directorio más completo de carreras y eventos de running.',
      shop: 'Compra calzado, ropa técnica y accesorios para running en Colombia. Productos personalizados en 3D. Envíos a todo el país.',
      events: 'Directorio de eventos y carreras de running en Colombia. Encuentra tu próxima carrera: 5K, 10K, media maratón y maratón en todas las ciudades.',
      marcas: 'Conoce las marcas deportivas que confían en ATHOS Running Store. Las mejores marcas de running en Colombia.',
      'zona-running': 'Zona Running: la app de ATHOS para corredores colombianos. Registra tus entrenamientos, sigue eventos y conecta con la comunidad runner.',
      support: 'Soporte, envíos, devoluciones y garantías en ATHOS Running Store. Resolvemos todas tus dudas.',
      'size-guide': 'Guía de tallas de calzado y ropa de running. Encuentra tu talla perfecta en ATHOS.',
    };

    // Helper: update or create a meta tag
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[([^\]]+)="([^"]+)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Helper: update canonical link
    const setCanonical = (url: string) => {
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'canonical';
        document.head.appendChild(el);
      }
      el.href = url;
    };

    // Helper: inject/replace JSON-LD schema
    const setJsonLd = (id: string, data: object | null) => {
      let el = document.getElementById(id);
      if (data === null) { if (el) el.remove(); return; }
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        (el as HTMLScriptElement).type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };

    let pageTitle = titleMap[view] ?? base;
    let pageDesc = descMap[view] ?? defaultDesc;
    let pageImg = defaultImg;
    let pageUrl = `${siteUrl}/`;
    let eventSchema: object | null = null;
    let productSchema: object | null = null;

    if (view === 'product' && selectedProductId) {
      const product = products.find(p => p.id === selectedProductId || p.slug === selectedProductId);
      if (product) {
        pageTitle = `${product.name} | ${base}`;
        pageDesc = product.description
          ? `${product.description.slice(0, 145)}... Cómpralo en ATHOS Running Store.`
          : `${product.name} – disponible en ATHOS Running Store. Envíos a todo Colombia.`;
        pageImg = product.image || defaultImg;
        pageUrl = `${siteUrl}/tienda/producto/${product.slug || product.id}`;
        productSchema = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description || '',
          image: product.image,
          brand: { '@type': 'Brand', name: 'ATHOS Running' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'COP',
            price: product.price,
            availability: (product.stock ?? 1) > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'ATHOS Running Store' },
          },
          aggregateRating: product.rating && product.reviewsCount
            ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewsCount }
            : undefined,
        };
      } else {
        pageTitle = `Producto | ${base}`;
        pageUrl = `${siteUrl}/tienda`;
      }
    } else if ((view === 'event-detail' || view === 'event-registration' || view === 'event-results') && selectedEventId) {
      const event = events.find(e => e.id === selectedEventId || e.slug === selectedEventId);
      if (event) {
        const dateStr = new Date(event.date).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
        pageTitle = `${event.title} – ${dateStr} | ${base}`;
        pageDesc = event.description
          ? `${event.description.replace(/\n/g, ' ').slice(0, 145)}...`
          : `${event.title} – ${dateStr} en ${event.city}. Distancias: ${event.distances.join(', ')}. Inscríbete en ATHOS Running.`;
        pageImg = event.image || defaultImg;
        pageUrl = `${siteUrl}/eventos/${event.slug || event.id}`;
        eventSchema = {
          '@context': 'https://schema.org',
          '@type': 'SportsEvent',
          name: event.title,
          description: event.description?.replace(/\n/g, ' ') || '',
          startDate: event.date,
          image: event.image,
          url: pageUrl,
          eventStatus: event.status === 'past'
            ? 'https://schema.org/EventScheduled'
            : 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: event.location || event.city,
            address: {
              '@type': 'PostalAddress',
              addressLocality: event.city,
              addressCountry: 'CO',
            },
          },
          organizer: {
            '@type': 'Organization',
            name: 'ATHOS Running Store',
            url: siteUrl,
          },
        };
      } else {
        pageTitle = `Evento | ${base}`;
        pageUrl = `${siteUrl}/eventos`;
      }
    } else {
      const urlMap: Record<string, string> = {
        home: '/', shop: '/tienda', events: '/eventos', marcas: '/marcas',
        'zona-running': '/zona-running', support: '/soporte',
        'size-guide': '/guia-de-tallas', cart: '/carrito', checkout: '/checkout',
        profile: '/perfil', auth: '/ingresar', admin: '/admin',
        'sponsor-event': '/patrocinar-evento',
      };
      pageUrl = `${siteUrl}${urlMap[view] ?? '/'}`;
    }

    // Apply all SEO tags
    document.title = pageTitle;
    setMeta('meta[name="description"]', 'content', pageDesc);
    setCanonical(pageUrl);

    // Open Graph
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', pageDesc);
    setMeta('meta[property="og:image"]', 'content', pageImg);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:type"]', 'content', view === 'product' ? 'product' : (view === 'event-detail' ? 'event' : 'website'));

    // Twitter Cards
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:site"]', 'content', '@athosrun_co');
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', pageDesc);
    setMeta('meta[name="twitter:image"]', 'content', pageImg);

    // Schema.org JSON-LD
    setJsonLd('schema-event', eventSchema);
    setJsonLd('schema-product', productSchema);

    // LocalBusiness schema (always present)
    setJsonLd('schema-local-business', {
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      name: 'ATHOS Running Store',
      description: defaultDesc,
      url: siteUrl,
      logo: defaultImg,
      email: 'athosrun.co@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Cartago',
        addressRegion: 'Valle del Cauca',
        addressCountry: 'CO',
      },
      sameAs: [
        'https://www.instagram.com/athosrun.co',
        'https://www.facebook.com/athosrun.co',
        'https://www.tiktok.com/@athosrun.co',
      ],
    });
  }, [view, selectedProductId, selectedEventId, products, events]);
  // ────────────────────────────────────────────────────────────────────────────

  const [displayView, setDisplayView] = React.useState(view);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const transitionTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const endTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Trigger page transition effect when view changes
  React.useEffect(() => {
    if (view !== displayView && !isLoading) {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);

      setIsTransitioning(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(e => console.log("Video autoplay prevented:", e));
      }

      // Change the actual view component at the peak of the transition
      transitionTimerRef.current = setTimeout(() => {
        setDisplayView(view);
        window.scrollTo(0, 0);
      }, 400);

      // Restore user's preferred 900ms length
      endTimerRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 900);
    }
  }, [view, displayView, isLoading]);

  React.useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    }
  }, []);

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
      case 'sponsor-event': return <SponsorEvent />;
      case 'zona-running': return <ZonaRunning />;
      case 'marcas': return <Marcas />;
      default: return <Home />;
    }
  };

  // If we are in the standalone landing page, render it bare without store integration
  if (displayView === 'zona-running') {
    return (
      <div className="min-h-[100dvh] font-sans selection:bg-black selection:text-white flex flex-col relative overflow-x-hidden">
        {/* We keep the transition overlay to allow smooth entry to the store if they navigate away */}
        <div
          className={`fixed inset-0 z-[500] flex items-center justify-center overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
        >
          <div className="absolute inset-0 bg-black/90"></div>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
            disablePictureInPicture
            className="absolute min-w-full min-h-full object-cover object-center pointer-events-none brightness-110 contrast-125 saturate-200 -hue-rotate-30 drop-shadow-[0_0_50px_rgba(255,100,0,0.5)]"
            src="/llamas.webm"
          />
        </div>
        <main className="w-full flex-grow">
          <ZonaRunning />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-athos-bg text-athos-black font-sans selection:bg-athos-orange selection:text-white flex flex-col relative overflow-x-hidden">
      <BackgroundGlows />

      {/* Global Video Transition Overlay (Permanently mounted for iOS video play policy safety) */}
      <div
        className={`fixed inset-0 z-[500] flex items-center justify-center overflow-hidden transition-opacity duration-300 ${isTransitioning ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Dark backdrop */}
        <div className="absolute inset-0 bg-black/90"></div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          className="absolute min-w-full min-h-full object-cover object-center pointer-events-none brightness-110 contrast-125 saturate-200 -hue-rotate-30 drop-shadow-[0_0_50px_rgba(255,100,0,0.5)]"
          src="/llamas.webm"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-[100dvh]">
        <Navbar />
        <div className="mt-[67px] md:mt-[92px]"> {/* Exact Spacer for fixed navbar height */}
        </div>
        <Notification />
        <main className="w-full flex-grow"> {/* Removed pt-0 md:pt-4 gap */}
          {renderView()}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
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