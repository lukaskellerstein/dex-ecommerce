# Promo Codes & Discounts — Feature Spec

This spec extends the Eshopy v1 store with a promo code and discount system. It is intended to be read alongside the main Eshopy spec; concepts like products, categories, the cart, checkout, orders, and the admin dashboard are reused without redefinition.

The goal is to give administrators a flexible tool for running sales and promotions, and to give customers a clear, predictable experience when redeeming a code or benefiting from an automatic discount.

---

## What discounts look like for a customer

### Entering a code in the cart

On the cart page, below the line items and above the order summary, a collapsible "Have a promo code?" section reveals a single text input and an "Apply" button. The input accepts up to 32 characters and is case-insensitive (codes are normalized to uppercase on submission).

When a code is applied successfully, the order summary updates immediately to show a new "Discount" line with the code name and the amount saved (formatted as a negative number, e.g. `-$12.50`). A small "Remove" link next to the discount line lets the customer take it off. A green confirmation message appears briefly: "Code APPLIED — you saved $12.50."

When a code fails, the input shows a clear, specific error rather than a generic "invalid code" message:

- **Code doesn't exist** — "This code isn't valid. Check the spelling and try again."
- **Code is expired** — "This code expired on [date]."
- **Code hasn't started yet** — "This code becomes active on [date]."
- **Code reached its usage limit** — "This code is no longer available."
- **Customer already used a single-use code** — "You've already used this code."
- **Cart doesn't meet the minimum** — "Add $[amount] more to use this code."
- **No eligible items in cart** — "This code applies to [category/products] not currently in your cart."
- **Another code is already applied** — "Only one code can be used per order. Remove the current code first."

Only one code can be applied at a time. Applying a new code while one is active prompts the customer to confirm replacement.

### Automatic discounts

Some discounts apply without a code — for example, a sitewide weekend sale. These appear in the order summary as a "Promotion" line with the campaign name set by the admin (e.g. "Spring Sale — 15% off"). Customers can't remove an automatic discount, but they can see exactly what it's saving them. A small info icon next to the line opens a tooltip explaining when the promotion ends.

If both an automatic discount and a manually entered code are eligible, the customer keeps both — automatic discounts and code-based discounts apply to different "slots" and don't conflict. The customer sees them as separate lines.

### How discounts appear during checkout and after

The applied discount carries through every step of checkout. The shipping step, payment step, and confirmation page all show the discount line with the same code name and amount. The Stripe charge is for the final post-discount total.

On the order detail page (both in the customer's order history and in the admin order view), the discount appears in the payment summary alongside subtotal, shipping, and tax. The code itself is displayed for reference.

If an order is cancelled and refunded, the refund amount is the post-discount total — the customer is refunded what they actually paid, not the pre-discount price. If the code was single-use, cancellation does not return a usage credit to the customer (this prevents abuse via cancel-and-reuse loops). Admins can manually re-issue a code to a specific customer if appropriate.

### Discount types in detail

Three types are supported:

- **Percentage off** — a percentage between 1 and 90 applied to eligible items. A maximum discount cap can optionally be set (e.g. "20% off, up to $50").
- **Fixed amount off** — a flat currency amount subtracted from eligible items. Cannot exceed the eligible subtotal (a $50 code on a $30 cart caps at $30, never goes negative).
- **Free shipping** — sets the shipping cost to zero regardless of the chosen shipping method. Compatible with both Standard and Express.

Tax is recalculated on the discounted subtotal, not the original. Shipping is unaffected by percentage or fixed-amount codes — those only discount items.

### Scope of a code

Each code applies to one of three scopes, set by the admin:

- **Whole cart** — the discount applies to the full subtotal.
- **Specific category** — the discount applies only to items in the selected category (or any of its subcategories). A 20%-off-electronics code on a cart with a $200 phone and a $50 shirt discounts only the phone.
- **Specific products** — the discount applies only to a hand-picked list of products.

For category and product scopes, the cart still goes through normally if no eligible items are present — the customer just sees the "no eligible items" error and can choose to remove the code or leave it (it stays in the input but contributes $0).

---

## What discounts look like for an administrator

Admins manage codes through a new section in the admin dashboard at `/admin/promotions`. It has a list view, an edit/create view, and a small reporting view per code.

### The promotions list

A data table shows every code with its name, type, value, scope, status (scheduled, active, expired, disabled), usage count, and start/end dates. Admins can filter by status and type, search by name, and sort by creation date, end date, or usage count. A status badge color-codes each row at a glance.

A "New promotion" button opens the create form.

### Creating or editing a code

Admins fill in:

- **Code** — the string customers will type. Required, 4-32 characters, alphanumeric plus hyphens. Stored uppercase. Must be unique. A small "Generate" button produces a random 8-character code. If the code is marked automatic, this field is hidden and a "Campaign name" field is shown instead (for display purposes only).
- **Type** — percentage off, fixed amount off, or free shipping (radio buttons).
- **Value** — the percentage (1-90) or fixed amount. Hidden when type is free shipping.
- **Maximum discount cap** — optional, only shown for percentage type.
- **Scope** — whole cart, category, or specific products. When category is selected, a dropdown lets the admin pick one (subcategories are automatically included). When specific products is selected, a searchable picker lets them add products one at a time.
- **Minimum order subtotal** — optional. The cart subtotal must reach this before the code is valid.
- **Start date and end date** — both optional. If start is empty, the code is active immediately. If end is empty, it never expires.
- **Total usage limit** — optional cap on how many times the code can be redeemed across all customers.
- **Per-customer usage limit** — optional cap per customer. Default is 1 if the code is single-use, otherwise unlimited.
- **Customer eligibility** — choose between "all customers," "first-time customers only" (no completed orders yet), or "specific customers" (a searchable picker for individual accounts).
- **Automatic** — toggle. When on, the code applies without being typed; the customer sees only the campaign name.
- **Status** — active or disabled. Disabled codes can't be redeemed even if they're within their date window.

A live preview panel shows what the customer would see in the cart given a sample $100 cart, updating as the admin fills in the form.

Saving the form runs validation: code uniqueness, value bounds, date ordering (end after start), and at least one eligible product (for category and product scopes). Errors are shown inline.

### Editing live codes

A code that has already been redeemed at least once can still be edited, with restrictions: the type, value, and scope cannot be changed (changing them retroactively would distort already-placed orders). The end date, usage limits, status, and eligibility list can be changed at any time. Disabling an active code takes effect immediately — any cart with that code applied has it silently removed at checkout, and the customer sees a notice that the promotion has ended.

A code is never deleted. A "Disable" action takes it out of circulation while preserving its history. Disabled codes remain visible in the list and on the orders that used them.

### Per-code reporting

Opening a code's detail page shows its configuration plus a small report:

- Total redemptions
- Total discount value given (sum across all orders that used the code)
- Total revenue from orders that used the code (post-discount)
- Average order value with the code vs. store average
- Conversion rate from "code applied" to "order completed" (codes applied during a session that resulted in a purchase, divided by total applications)

The list of orders that used the code is shown below, linking to each order detail.

### The dashboard KPI

The main admin dashboard at `/admin` gains a new tile in the 30-day KPI row: "Discount cost — $[amount]" showing the total discount value given over the last 30 days, with a small percentage of revenue underneath (e.g. "4.2% of revenue").

---

## How discounts are applied at checkout

Stock and pricing validation already happens at cart-add and at checkout-start. Discount validation is added as a third check: when the customer reaches the payment step, the applied code is re-validated against current state. If the code has expired, been disabled, hit its usage cap, or the cart no longer meets eligibility (e.g., the customer removed the only eligible item), the code is removed and the customer is shown a clear notice with the updated total before they can pay.

Code redemption is recorded atomically with the order: the same database transaction that decrements stock also increments the code's usage count and creates a redemption record linking the code to the customer and order. This prevents two simultaneous checkouts from both consuming the last available use of a limited code.

If two codes were eligible at the same moment (one automatic, one manual), both are applied as described in the customer section. The order's payment summary stores them as two separate discount lines so the original intent is preserved in history.

---

## What is not included in this version

To match the v1 scope discipline of the rest of Eshopy, the following are deferred:

- Stacking multiple manually-entered codes on a single order
- Tiered discounts ("spend $100 save 10%, spend $200 save 20%")
- "Buy X get Y free" or BOGO-style promotions
- Bundle pricing (e.g., buy these three items together for a fixed price)
- Customer-generated codes via referral or affiliate programs
- Shareable wishlist-based discounts
- Loyalty points or store credit
- Gift cards
- Bulk code generation or CSV import/export of codes
- Personalized codes (one unique code per customer, mailed out)
- Country- or region-specific promotions
- Discounts on specific shipping methods (e.g., "$5 off Express shipping")
- A/B testing framework for comparing promotions
- Email notifications when a code is about to expire
- Showing applicable codes to the customer ("You qualify for SPRING15") inside the cart
- Abandoned-cart code emails
- Time-of-day flash sale scheduling more granular than start/end date-times