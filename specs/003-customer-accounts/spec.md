# Spec — Customer accounts

## Summary

Customers register, sign in, and manage a profile, saved addresses, a wishlist and their order history. Failed logins lock the account; password resets are single-use and time-limited.

## Acceptance criteria

1. Five failed logins within fifteen minutes lock the account for thirty minutes.
2. A password reset link works once and expires one hour after it is issued.
3. A customer may save at most five addresses, exactly one of which is the default.
4. Marking a new address as default clears the flag on the previous one.

## Out of scope

Anything the clarified plan excludes from v1 — payment provider integration,
multi-currency and subscriptions.
