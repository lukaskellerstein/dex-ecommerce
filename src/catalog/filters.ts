import type { Product } from "./types.js";

export interface Filters {
  minPriceCents?: number;
  maxPriceCents?: number;
  minRating?: number;
  inStockOnly?: boolean;
}

const lowestPrice = (p: Product): number =>
  Math.min(...p.variants.map((v) => v.priceCents));

const anyInStock = (p: Product): boolean => p.variants.some((v) => v.stock > 0);

/** Filters are additive: an absent field constrains nothing. */
export function applyFilters(products: readonly Product[], filters: Filters): Product[] {
  return products.filter((p) => {
    if (filters.minPriceCents !== undefined && lowestPrice(p) < filters.minPriceCents) return false;
    if (filters.maxPriceCents !== undefined && lowestPrice(p) > filters.maxPriceCents) return false;
    if (filters.minRating !== undefined && p.averageRating < filters.minRating) return false;
    if (filters.inStockOnly && !anyInStock(p)) return false;
    return true;
  });
}

/** Round-trips through the URL so a filtered list is shareable. */
export function toSearchParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.minPriceCents !== undefined) params.set("min", String(filters.minPriceCents));
  if (filters.maxPriceCents !== undefined) params.set("max", String(filters.maxPriceCents));
  if (filters.minRating !== undefined) params.set("rating", String(filters.minRating));
  if (filters.inStockOnly) params.set("stock", "1");
  return params;
}
