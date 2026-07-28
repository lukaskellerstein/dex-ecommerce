# Eshopy constitution

## Principles

1. **The shopper is never blocked.** Browsing, searching and cart-building work
   without an account. Authentication appears at checkout and nowhere earlier.
2. **Pure core, thin edges.** Catalogue, cart and pricing logic are pure
   functions. Datastore access lives behind repository modules.
3. **State that survives a refresh.** Filters and sort live in the URL; carts
   live in the browser until they live on the server. A reload loses nothing.
4. **Strict types, no escape hatches.** No `any` and no non-null assertions on
   data crossing a module boundary.
5. **Measure before denormalising.** Caches and derived columns need a recorded
   reason.

## Review gates

A feature lands with its types, its tests and its data shape in one change. A
feature that compiles but has no test is not done.
