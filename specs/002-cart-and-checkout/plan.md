# Plan — Cart and checkout

## Modules

- `src/cart/types.ts` — Cart, LineItem and Order models
- `src/cart/cart.ts` — add, remove, quantity and guest-cart merge, pure
- `src/cart/checkout.ts` — stock validation and order placement

## Decisions

- Line items are keyed by variant SKU, not product id, because price and stock live on the variant.
- The merge rule takes the higher quantity so a deliberate guest-side increase is never silently reduced.
- Stock is validated at checkout rather than on add, because a cart can sit idle while stock moves.

## Risks

The repository modules are the only impure code. If one grows past reading and
writing its own aggregate, split it before adding another caller.
