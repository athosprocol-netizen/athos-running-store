
export type ViewState = 'home' | 'shop' | 'product' | 'academy' | 'challenges' | 'profile' | 'cart' | 'auth' | 'size-guide' | 'admin' | 'checkout';

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
  role: 'user' | 'admin';
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
  activeChallengeId?: string;
  createdAt?: string;
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
