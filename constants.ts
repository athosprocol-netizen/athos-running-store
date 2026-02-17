
import { Product, UserProfile, BlogPost, Challenge } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'ATHOS Carbon Alpha',
    subtitle: 'Competición Maratón',
    category: 'shoes',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop', // Mock alternate angle
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop'  // Mock detail
    ],
    rating: 4.9,
    reviewsCount: 128,
    reviews: [
        {
            id: 'r1',
            userId: 'u2',
            userName: 'Santiago M.',
            rating: 5,
            comment: 'Bajé mis tiempos en la Media Maratón de Bogotá. Increíbles.',
            date: '2023-10-15',
            image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=200&auto=format&fit=crop'
        }
    ],
    description: 'La cúspide del rendimiento para el día de la carrera. Con nuestra espuma patentada con infusión de nitrógeno y placa de fibra de carbono completa para máxima propulsión.',
    specs: {
      weight: '198g',
      drop: '8mm',
      terrain: 'Road',
      cushioning: 'Max',
      stability: 'Neutral'
    },
    tags: ['Día de Carrera', 'Placa Carbono', 'Más Vendido'],
    stock: 12
  },
  {
    id: 'p2',
    name: 'Terra Grip Ultra',
    subtitle: 'Trail Técnico',
    category: 'shoes',
    price: 680000,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',
    images: [
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1454944338482-a69bb95894af?q=80&w=1000&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewsCount: 84,
    description: 'Construidas para las ultras más duras de Colombia. Tacos agresivos de 5mm para tracción en barro y roca, con placa protectora.',
    specs: {
      weight: '280g',
      drop: '4mm',
      terrain: 'Trail',
      cushioning: 'Max',
      stability: 'Stable'
    },
    tags: ['Ultra Distancia', 'Gore-Tex'],
    stock: 8
  },
  {
    id: 'p3',
    name: 'Velocity Split Short',
    subtitle: 'Ropa de Élite',
    category: 'apparel',
    price: 180000,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    reviewsCount: 45,
    description: 'Tejido ultraligero con costuras selladas para eliminar rozaduras durante tus esfuerzos más rápidos.',
    tags: ['Ligero', 'Secado Rápido'],
    stock: 25
  },
  {
    id: 'p4',
    name: 'Soporte Medallas 3D Pro',
    subtitle: 'Impresión 3D Personalizada',
    category: 'achievements',
    price: 150000,
    image: 'https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=1000&auto=format&fit=crop', 
    rating: 5.0,
    reviewsCount: 210,
    description: 'Celebra tu logro con tecnología aditiva. Exhibidor impreso en 3D con biopolímeros de alta resistencia (PLA+), personalizado capa a capa con tu nombre, distancia y tiempo final.',
    isCustomizable: true,
    tags: ['Personalizado', 'Impresión 3D', 'Eco-Friendly'],
    stock: 50
  },
  {
    id: 'p5',
    name: 'Pack Geles Endurance',
    subtitle: 'Energía & Electrolitos',
    category: 'accessories',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1622602726546-44445851453e?q=80&w=1000&auto=format&fit=crop',
    rating: 4.6,
    reviewsCount: 320,
    description: 'Pack de 12 geles de alta carga de carbohidratos. Fáciles de digerir, formulados para distancias superiores a 21km.',
    tags: ['Nutrición', 'Pack'],
    stock: 100
  }
];

export const INITIAL_USER: UserProfile = {
  id: "u123",
  email: "alejandro@athos.co",
  name: "Alejandro Runner",
  role: 'admin', 
  location: "Bogotá, COL",
  address: "Cra 15 # 124-30, Apto 502",
  phone: "310 555 1234",
  age: 28,
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  coupons: [
      { code: 'BIENVENIDO10', description: '10% en tu primera compra', discount: 10, expiry: '2024-12-31' },
      { code: 'MMB2024', description: 'Envío gratis temporada maratón', discount: 100, expiry: '2024-08-01' }
  ],
  wishlist: ['p1', 'p2']
};

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'b1',
    title: 'Impresión 3D en el Running: El Futuro',
    category: 'Innovación',
    excerpt: 'Cómo la tecnología aditiva está permitiendo personalizar desde suelas hasta soportes de medallas.',
    image: 'https://images.unsplash.com/photo-1633535921825-721200632b00?q=80&w=1000&auto=format&fit=crop',
    readTime: '4 min',
    date: '14 Oct'
  },
  {
    id: 'b2',
    title: 'Plan de Entrenamiento Sub-3 Horas',
    category: 'Entrenamiento',
    excerpt: 'Un plan estructurado de 16 semanas diseñado para romper la barrera.',
    image: 'https://images.unsplash.com/photo-1552674605-469536d07f40?q=80&w=1000&auto=format&fit=crop',
    readTime: '8 min',
    date: '28 Sep'
  },
  {
    id: 'b3',
    title: 'El Arte del Tapering',
    category: 'Bienestar',
    excerpt: 'Cómo reducir el volumen sin perder la forma física en las 3 semanas finales antes de la carrera.',
    image: 'https://images.unsplash.com/photo-1516487979678-83b320df683c?q=80&w=1000&auto=format&fit=crop',
    readTime: '4 min',
    date: '15 Sep'
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Rey de Patios',
    location: 'Bogotá, Cundinamarca',
    description: 'Acumula 2,000m de desnivel positivo subiendo a Patios o El Verjón este mes.',
    goal: '2,000m Desnivel',
    metric: 'elevation',
    targetValue: 2000,
    image: 'https://images.unsplash.com/photo-1596727147705-54a9d0c20968?q=80&w=1000&auto=format&fit=crop', // Cycling/Running Uphill
    reward: 'Insignia "Escalador"',
    daysLeft: 14,
    participants: 3420,
    difficulty: 'Intermedio',
    type: 'Road'
  },
  {
    id: 'c2',
    title: 'Ultra Chicamocha',
    location: 'Santander',
    description: 'Completa 50km de trail running acumulados en terrenos mixtos.',
    goal: '50 km Totales',
    metric: 'distance',
    targetValue: 50,
    image: 'https://images.unsplash.com/photo-1454944338482-a69bb95894af?q=80&w=1000&auto=format&fit=crop', // Canyon/Trail
    reward: '30% OFF en Gama Trail',
    daysLeft: 22,
    participants: 850,
    difficulty: 'Avanzado',
    type: 'Trail'
  },
  {
    id: 'c3',
    title: 'Velocidad Simón Bolívar',
    location: 'Nacional (Pista/Parque)',
    description: 'Registra tu 5K más rápido. El objetivo es romper la barrera de los 25 minutos.',
    goal: '5K Personal Best',
    metric: 'speed',
    targetValue: 5,
    image: 'https://images.unsplash.com/photo-1552674605-469536d07f40?q=80&w=1000&auto=format&fit=crop', // Track
    reward: 'Gorra ATHOS Elite',
    daysLeft: 8,
    participants: 5100,
    difficulty: 'Principiante',
    type: 'Road'
  }
];
