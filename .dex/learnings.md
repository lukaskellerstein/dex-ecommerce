# Learnings

- **architecture**: Keeping search and filters pure let them be tested without a catalogue fixture or a datastore. | Catalog and search — search, filters and sort
- **architecture**: Passing a price lookup into totalCents kept cart logic independent of the catalogue module. | Cart and checkout — cart state and guest merge
- **product**: Encoding filter state in the URL removed the need for any client-side filter store. | Catalog and search — search, filters and sort
- **correctness**: Validating stock at checkout rather than on add avoided a cart that silently goes stale. | Cart and checkout — checkout flow
