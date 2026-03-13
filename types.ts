export type ViewState = 'home' | 'shop' | 'product' | 'academy' | 'challenges' | 'profile' | 'cart' | 'auth' | 'size-guide' | 'admin' | 'checkout' | 'support' | 'forgot-password' | 'update-password' | 'events' | 'event-detail' | 'event-registration' | 'event-results' | 'organizer';

export interface TechSpecs {
  weight?: string;
  drop?: string;
  terrain?: 'Road' | 'Trail' | 'Track' | 'All-Terrain';
  cushioning?: 'Low' | 'Medium' | 'Max';
  stability?: 'Neutral' | 'Stable';
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  image?: string; // URL of the user uploaded image
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'shoes' | 'apparel' | 'accessories' | 'achievements' | 'relojes' | 'cinturones' | 'gafas' | 'gorras' | 'medalleros';
  price: number;
  image: string;
  images?: string[]; // Multiple images support
  rating: number;
  reviewsCount: number;
  reviews?: Review[]; // Array of reviews
  description: string;
  specs?: TechSpecs;
  tags: string[];
  isCustomizable?: boolean;
  stock: number; // Inventory management
  sku?: string; // For backend
  variants?: ProductVariant[]; // Multiple colors with different prices
}

export interface ProductVariant {
  id: string; // unique inside the array
  colorName: string;
  price: number;
  image: string; // base64 or URL (main variant photo)
  images?: string[]; // additional gallery photos for this variant
}

export interface CustomizationOptions {
  line1?: string; // Name
  line2?: string; // Time/Subtitle
  distance?: '5K' | '10K' | '21K' | '42K' | 'Ultra'; // Distance badge
  event?: string;
  material?: 'PLA Premium'; // Only PLA available now
}

export interface Coupon {
  code: string;
  description: string;
  discount: number; // percentage or fixed value logic
  expiry: string;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'organizer';
  avatar?: string;
  // Personal Info
  location?: string;
  address?: string; // Legacy simple string
  shippingAddresses?: Address[]; // Future proof
  phone?: string;
  age?: number;
  // Shop Data
  coupons: Coupon[];
  wishlist: string[];
  favoriteEvents?: string[];
  activeChallengeId?: string;
  createdAt?: string;
  // Events Data
  eventHistory?: string[]; // IDs de eventos participados
}

// --- EVENTS SYSTEM ---

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  city: string;
  description: string;
  distances: string[];
  image: string;
  status: 'upcoming' | 'ongoing' | 'past';
  isFeatured?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  organizerId: string;
  photosLink?: string;
  price: number;
  duration?: string;
  gradientColors?: string[]; // Array of colors for UI gradients (up to 3)
  externalUrl?: string; // Link to external registration pages
  gallery?: string[]; // Array of image URLs for the event gallery

  // Custom properties for UI Mock
  reward?: string;
  daysLeft?: number;
  participants?: number;
  difficulty?: string;
  type?: string;

  // Reviews System
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  buttonText?: string;
  image: string;
  gradientColors: string[];
  isActive: boolean;
  link?: string;
}

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  distance: string;
  shirtSize?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  status: 'pending' | 'paid' | 'cancelled';
  paymentId?: string;
  date: string;
}

export interface EventResult {
  id: string;
  eventId: string;
  userId: string; // o un string simple para el nombre del corredor si no está logueado
  runnerName: string;
  distance: string;
  time: string; // Ej: "01:45:30"
  rankOverall: number;
  rankCategory?: number;
  category?: string;
}

export interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  size?: string;
  customization?: CustomizationOptions;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
}

export interface Challenge {
  id: string;
  title: string;
  location: string;
  description: string;
  goal: string;
  metric: 'distance' | 'elevation' | 'speed';
  targetValue: number;
  image: string;
  reward: string;
  daysLeft: number;
  participants: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado' | 'Élite';
  type: 'Road' | 'Trail' | 'Mixed';
}
