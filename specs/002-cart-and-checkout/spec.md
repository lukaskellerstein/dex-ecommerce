# Spec — Cart and checkout

## Summary

Shoppers build a cart as a guest or signed in. A guest cart persists in the browser and merges on login. Checkout runs behind authentication, validates stock, and writes an order.

## Acceptance criteria

1. Adding a variant already in the cart increases its quantity rather than adding a second line.
2. Quantities are capped at available stock at the moment of adding.
3. On login, a SKU present in both the guest and server carts ends at the higher of the two quantities.
4. Checkout rejects the order when any line item exceeds available stock, naming the offending SKU.

## Out of scope

Anything the clarified plan excludes from v1 — payment provider integration,
multi-currency and subscriptions.
