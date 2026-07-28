import type { Cart, Order } from "./types.js";

export class OutOfStockError extends Error {
  readonly sku: string;
  constructor(sku: string) {
    super("OutOfStockError: " + sku + " is no longer available in the requested quantity");
    this.name = "OutOfStockError";
    this.sku = sku;
  }
}

/**
 * Stock is validated here rather than on add, because a cart can sit idle for
 * days while stock moves underneath it.
 */
export function placeOrder(
  cart: Cart,
  stockOf: (sku: string) => number,
  priceOf: (sku: string) => number,
  now: string,
): Order {
  for (const item of cart.items) {
    if (stockOf(item.sku) < item.quantity) throw new OutOfStockError(item.sku);
  }
  const totalCents = cart.items.reduce((sum, i) => sum + priceOf(i.sku) * i.quantity, 0);
  return { id: "order-" + cart.id, cart, totalCents, status: "placed", placedAt: now };
}
