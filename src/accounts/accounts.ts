import type { Address, Customer } from "./types.js";

export const MAX_ADDRESSES = 5;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

export class AddressLimitError extends Error {
  constructor() {
    super("AddressLimitError: a customer may save at most " + MAX_ADDRESSES + " addresses");
    this.name = "AddressLimitError";
  }
}

export function addAddress(customer: Customer, address: Address): Customer {
  if (customer.addresses.length >= MAX_ADDRESSES) throw new AddressLimitError();
  const addresses = address.isDefault
    ? [...customer.addresses.map((a) => ({ ...a, isDefault: false })), address]
    : [...customer.addresses, address];
  return { ...customer, addresses };
}

/** Five failures inside the window locks the account. */
export function isLockedOut(failedAt: readonly number[], now: number): boolean {
  const recent = failedAt.filter((t) => now - t <= LOCKOUT_WINDOW_MS);
  return recent.length >= LOCKOUT_THRESHOLD;
}

export function toggleWishlist(customer: Customer, productId: string): Customer {
  const wishlist = customer.wishlist.includes(productId)
    ? customer.wishlist.filter((id) => id !== productId)
    : [...customer.wishlist, productId];
  return { ...customer, wishlist };
}
