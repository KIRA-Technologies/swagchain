import type { Role, OrderStatus } from "@prisma/client";

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
    };
  }
}

// Product types
export interface ProductWithLikes {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  keywords: string[];
  rating: number;
  ratingCount: number;
  stock: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
  _count?: {
    likes: number;
  };
}

// Cart types
export interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
}

// Order types
export interface OrderWithDetails {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  paidAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  kiraPayUrl: string | null;
  kiraPayLinkId: string | null;
  address: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

// Filter types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: boolean;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
}

// Kira-Pay types
export interface KiraPayLinkData {
  id: string;
  url: string;
  price: number;
  customOrderId: string;
  type: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Category type
export const PRODUCT_CATEGORIES = [
  "Hoodies",
  "T-Shirts",
  "Hats",
  "Mugs",
  "Accessories",
  "Stickers",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
