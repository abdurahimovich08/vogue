
export type ProductCategory = 'Outerwear' | 'Tops' | 'Bottoms' | 'Dresses' | 'Footwear' | 'Accessories' | 'Headwear';

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
}

export interface ProductAttributes {
  color: string;
  availableColors: string[];
  season: 'Summer' | 'Winter' | 'Spring/Autumn' | 'All-season';
  gender: 'Male' | 'Female' | 'Unisex';
  sizes: string[];
  tags: string[];
}

export interface ShopProfile {
  shopName: string;
  phone: string;
  address: string;
  logoUrl?: string;
  registeredAt: number;
  email?: string;
  role?: 'SELLER' | 'BUYER' | 'ADMIN';
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  googleId?: string;
}

export interface ProductStats {
  views: number;
  likes: number;
  sales?: number; // Added for Sales Dashboard
  regionalData?: Record<string, number>; // Added for Regional Analysis
  reviews: { user: string; rating: number; comment: string }[];
}

export type BodyType = 'Athletic' | 'Slim' | 'Average' | 'Curvy' | 'Large';

export interface UserMeasurements {
  height: number;
  weight: number;
  bodyType: BodyType;
}

export type ClothingSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Product {
  id: string;
  sellerId: string;
  originalImageUrl: string;
  professionalImageUrl: string;
  name: string;
  brand: string;
  material: string;
  quality: 'New' | 'Like New' | 'Used';
  price: number;
  description: string;
  category: ProductCategory;
  attributes: ProductAttributes;
  variants: ProductVariant[];
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  stats: ProductStats;
}

export enum ModelVibe {
  STUDIO = 'Studio',
  URBAN = 'Urban',
  NATURE = 'Nature',
  MINIMAL = 'Minimal'
}

export interface GenerationConfig {
  vibe: ModelVibe;
  gender: 'Male' | 'Female' | 'Non-binary';
  lighting: 'Natural' | 'Soft' | 'Dramatic';
  measurements?: UserMeasurements;
  clothingSize: ClothingSize;
}

export interface GeneratedImage {
  id: string;
  originalUrl: string;
  personUrl?: string;
  generatedUrl: string;
  timestamp: number;
  prompt: string;
  category: string;
  isFittingRoom: boolean;
}

export type AppView = 'REGISTRATION' | 'DASHBOARD' | 'AI_ASSISTANT' | 'ANALYTICS' | 'MARKETPLACE' | 'GALLERY' | 'INVENTORY' | 'PROFILE';
