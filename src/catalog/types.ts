export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  parent: CategorySlug | null;
  productCount: number;
}

export interface Variant {
  sku: string;
  label: string;
  priceCents: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategorySlug;
  variants: Variant[];
  averageRating: number;
  reviewCount: number;
}
