import type { Cart, LineItem } from "./types.js";

export function addItem(cart: Cart, sku: string, quantity: number, stock: number): Cart {
  const existing = cart.items.find((i) => i.sku === sku);
  const capped = (want: number) => Math.min(want, stock);
  const items: LineItem[] = existing
    ? cart.items.map((i) =>
        i.sku === sku ? { ...i, quantity: capped(i.quantity + quantity) } : i,
      )
    : [...cart.items, { sku, quantity: capped(quantity) }];
  return { ...cart, items };
}

export function removeItem(cart: Cart, sku: string): Cart {
  return { ...cart, items: cart.items.filter((i) => i.sku !== sku) };
}

/**
 * Guest cart merges into the server cart on login. Where a SKU is in both, the
 * higher quantity wins — a shopper who deliberately raised the quantity as a
 * guest should not have it silently reduced by an older signed-in cart.
 */
export function mergeCarts(server: Cart, guest: Cart): Cart {
  const items = [...server.items];
  for (const g of guest.items) {
    const existing = items.find((i) => i.sku === g.sku);
    if (existing) existing.quantity = Math.max(existing.quantity, g.quantity);
    else items.push({ ...g });
  }
  return { ...server, items };
}

export function totalCents(cart: Cart, priceOf: (sku: string) => number): number {
  return cart.items.reduce((sum, i) => sum + priceOf(i.sku) * i.quantity, 0);
}
