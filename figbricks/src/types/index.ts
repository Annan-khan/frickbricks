export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  products?: Product[];
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  oldPrice?: number | null;
  stock: number;
  images: string[];
  categoryId: string;
  category?: Category;
  isFeatured?: boolean;
}

export interface Banner {
  id: string;
  title?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  isActive: boolean;
  order: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}
