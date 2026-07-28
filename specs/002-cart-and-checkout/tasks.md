# Tasks — Cart and checkout

## Phase 1: Cart state and guest merge

**Purpose**: Hold line items, survive a reload, and merge a guest cart on login.

- [x] T001 Define Cart and LineItem types keyed by variant SKU
- [x] T002 Implement add, remove and quantity change with stock caps
- [x] T003 Persist the guest cart in the browser
- [x] T004 Merge guest and server carts on login, higher quantity winning

## Phase 2: Checkout flow

**Purpose**: Take an authenticated cart through address, shipping and confirmation.

- [x] T005 Redirect guests to login with a return URL
- [x] T006 Validate stock for every line item before placing the order
- [x] T007 Write the order and clear the cart atomically
- [x] T008 Cover the merge rule and out-of-stock rejection with tests
