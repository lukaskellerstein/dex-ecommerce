# Tasks — Cart and checkout

## Phase 1: Cart state and guest merge

**Purpose**: Hold line items, survive a reload, and merge a guest cart on login.

- [ ] T001 Define Cart and LineItem types keyed by variant SKU
- [ ] T002 Implement add, remove and quantity change with stock caps
- [ ] T003 Persist the guest cart in the browser
- [ ] T004 Merge guest and server carts on login, higher quantity winning

## Phase 2: Checkout flow

**Purpose**: Take an authenticated cart through address, shipping and confirmation.

- [ ] T005 Redirect guests to login with a return URL
- [ ] T006 Validate stock for every line item before placing the order
- [ ] T007 Write the order and clear the cart atomically
- [ ] T008 Cover the merge rule and out-of-stock rejection with tests
