# Spec — Catalog and search

## Summary

Shoppers browse a two-level category tree, search products by name and description with relevance ranking, and narrow results with additive filters on price, rating and stock. Filter and sort state lives in the URL.

## Acceptance criteria

1. A category page lists its own products and those of its children, with a product count per category.
2. Searching ranks an exact name match above a partial name match, and both above a description-only match.
3. Selecting a price range and a minimum rating applies both constraints together.
4. Reloading a filtered page restores the same filters from the URL.

## Out of scope

Anything the clarified plan excludes from v1 — payment provider integration,
multi-currency and subscriptions.
