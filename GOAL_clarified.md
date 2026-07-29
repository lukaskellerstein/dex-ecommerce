# Eshopy — clarified plan

## Summary

A full ecommerce storefront with a back office. Shoppers browse a nested
category tree, search and filter products, build a cart as a guest or a signed-in
customer, and check out. Administrators manage catalogue and orders.

## Features

### 1. Catalog and search

Nested categories two levels deep with product counts. Full-text search over
names and descriptions, ranked by relevance. Additive filters on price, rating
and stock, with sorting and removable filter chips. Filter state lives in the URL.

### 2. Cart and checkout

Add to cart from product and listing pages, with variant selection required
where variants exist. Guest carts persist in the browser and merge on login,
higher quantity winning. Multi-step checkout behind authentication with a
return URL.

### 3. Customer accounts

Registration with password strength feedback, lockout after five failed logins
in fifteen minutes, and single-use one-hour password resets. Account area with
profile, up to five saved addresses, order history and a wishlist.

## Constraints

- TypeScript strict mode throughout
- Server-rendered catalogue pages; client state only for cart and filters
- No payment provider, no multi-currency, no subscriptions in v1
