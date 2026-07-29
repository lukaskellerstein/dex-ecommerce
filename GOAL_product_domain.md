# Eshopy — product domain

## Who uses this

Two distinct users with almost no overlap:

- **Shoppers** arrive from search or a category link, browse, and want to be
  checking out in under a minute. Most are not logged in when they start.
- **Store administrators** live in the back office all day and care about
  throughput: editing catalogue entries, moving orders through fulfilment, and
  seeing what is selling.

## Decisions

- Browsing and cart-building never require an account. Sign-in is deferred to
  the first checkout step, with a return URL so nothing is lost.
- A guest cart lives in the browser and merges on login. Where the same item
  exists in both carts, the higher quantity wins.
- Categories nest two levels deep. Deeper hierarchies were considered and cut —
  they complicate navigation without helping the catalogue sizes in scope.
- Filters are additive and reflected as removable chips, so a shopper can always
  see why a list is short.

## Deliberately excluded from v1

Payment provider integration, multi-currency, and subscriptions. Each pulls in
an external dependency and a compliance surface the first release does not need.
