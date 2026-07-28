export interface LineItem {
  sku: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items: LineItem[];
}

export type OrderStatus = "placed" | "fulfilled" | "cancelled";

export interface Order {
  id: string;
  cart: Cart;
  totalCents: number;
  status: OrderStatus;
  placedAt: string;
}
