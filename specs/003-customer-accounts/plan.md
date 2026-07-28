# Plan — Customer accounts

## Modules

- `src/accounts/types.ts` — Customer and Address models
- `src/accounts/accounts.ts` — address rules, lockout window and wishlist, pure

## Decisions

- Lockout is computed from a list of failure timestamps rather than a counter, so the fifteen-minute window is a filter and not a scheduled reset.
- The address cap is enforced in the domain rather than the UI, so the back office cannot bypass it.
- Wishlist entries survive an item going out of stock; the entry is labelled instead of removed.

## Risks

The repository modules are the only impure code. If one grows past reading and
writing its own aggregate, split it before adding another caller.
