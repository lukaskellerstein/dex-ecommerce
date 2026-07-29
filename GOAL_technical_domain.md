# Eshopy — technical domain

## Stack

TypeScript in strict mode across the storefront and the back office. Server-side
rendering for catalogue and product pages so search engines see real content;
client-side state only for the cart and filter interactions.

## Structure

```
src/catalog/     product, category and variant models, search, filters
src/cart/        cart state, guest-cart merge, checkout flow
src/accounts/    registration, sessions, addresses, wishlist
src/admin/       back-office views over the same models
```

## Constraints

- Model and query logic stay pure. Anything touching the datastore lives behind
  a repository module so catalogue and cart logic are testable without fixtures.
- Filter and sort state is encoded in the URL, so a filtered list is shareable
  and the back button behaves.
- Rating aggregates are denormalised onto the product record. Recomputing them
  per request was measured as the dominant cost on category pages.
