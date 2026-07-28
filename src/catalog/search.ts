import type { Product } from "./types.js";

export interface SearchHit {
  product: Product;
  score: number;
}

/**
 * Relevance-ranked search over name and description. A name match outweighs a
 * description match — shoppers searching "headphones" want the product called
 * Headphones before every product that merely mentions them.
 */
export function search(products: readonly Product[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return products.map((product) => ({ product, score: 0 }));

  const hits: SearchHit[] = [];
  for (const product of products) {
    const name = product.name.toLowerCase();
    const description = product.description.toLowerCase();
    let score = 0;
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 50;
    else if (name.includes(q)) score += 25;
    if (description.includes(q)) score += 5;
    if (score > 0) hits.push({ product, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}
