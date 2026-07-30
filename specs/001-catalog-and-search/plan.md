# Plan — Catalog and search

## Modules

- `src/catalog/types.ts` — Product, Variant and Category models
- `src/catalog/search.ts` — relevance-ranked search, pure
- `src/catalog/filters.ts` — additive filters and URL round-trip, pure

## Decisions

- Name matches outrank description matches, because a shopper searching a product name wants that product first.
- Categories nest exactly two levels — deeper trees complicate navigation without helping catalogues in scope.
- Filter state is encoded in the URL so a filtered list is shareable and the back button behaves.

## Risks

The repository modules are the only impure code. If one grows past reading and
writing its own aggregate, split it before adding another caller.
