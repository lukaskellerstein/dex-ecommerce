# Learnings

- **architecture**: Keeping search and filters pure let them be tested without a catalogue fixture or a datastore. | Catalog and search — search, filters and sort
- **architecture**: Passing a price lookup into totalCents kept cart logic independent of the catalogue module. | Cart and checkout — cart state and guest merge
- **architecture**: Enforcing the address cap in the domain kept the back office from bypassing it. | Customer accounts — account area
- **product**: Encoding filter state in the URL removed the need for any client-side filter store. | Catalog and search — search, filters and sort
- **correctness**: Validating stock at checkout rather than on add avoided a cart that silently goes stale. | Cart and checkout — checkout flow
- **security**: Deriving lockout from failure timestamps made the fifteen-minute window a filter rather than a reset job. | Customer accounts — registration and sessions
