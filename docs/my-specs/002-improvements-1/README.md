# Product Recommendations — Feature Spec

This spec extends the Eshopy v1 store with a product recommendations system. It is intended to be read alongside the main Eshopy spec; concepts like products, variants, categories, orders, wishlists, and the admin dashboard are reused without redefinition.

The goal is to help customers discover relevant products at three points in their journey — while browsing a product, while building a cart, and when they return to the store — and to give administrators meaningful control over what gets surfaced.

---

## What recommendations look like for a customer

Recommendations appear in three distinct places, each with its own purpose, layout, and source of data. They are always visually consistent: a horizontal scrollable rail of product cards on desktop, a swipeable carousel on mobile. Each card shows the product image, name, price (with the original price struck through if discounted), and average star rating. Tapping a card opens the product detail page. Tapping a small "+" icon on the card adds the product to the cart directly — using the default variant if the product has variants, or opening a quick-pick modal if no sensible default exists.

Out-of-stock products are never recommended. Inactive products are never recommended. Products the customer already has in their cart are filtered out of cart-page recommendations. Products the customer has purchased in the last 90 days are filtered out of personalized recommendations (but not co-purchase recommendations, since reorders are valid there).

### "Customers also bought" — on product detail pages

Below the reviews section on every product detail page, a rail titled "Customers also bought" shows up to 8 products that other customers frequently purchased together with the current product. The data comes from co-purchase analysis of completed orders (status of paid or later) over the last 180 days.

If fewer than 3 co-purchase matches exist for a product — common for new or low-volume items — the rail falls back to other products in the same category, sorted by popularity. If neither yields enough results, the rail is hidden entirely rather than padded with low-quality picks.

The current product itself is always excluded. Variants of the same product are also excluded (recommending the red version of a shirt the customer is already viewing in blue is not useful).

### "Recommended for you" — on the home page and account dashboard

A logged-in customer sees a personalized rail of up to 12 products on the storefront home page (positioned above categories) and a smaller rail of up to 6 products on the account dashboard at `/account`.

Personalization is based on the customer's behavior: products they've purchased, products they've reviewed, products on their wishlist, and categories they've browsed most often in the last 60 days. Items the customer has explicitly dismissed (see below) are excluded permanently.

For guests and brand-new accounts with no behavior signal, the rail is titled "Trending now" instead and shows the top-selling products across the store over the last 30 days, weighted toward the customer's geographic region if available, otherwise globally.

Each card on the personalized rail has a small "x" in the corner. Tapping it removes that product from this rail and records a "not interested" signal that prevents it from being recommended again to that customer. A toast confirms the dismissal with an "Undo" action that's available for 5 seconds.

### "Complete your order" — on the cart page

Above the cart summary, a rail titled "Complete your order" shows up to 6 products that pair well with what's currently in the cart. The logic considers every product in the cart and surfaces the most frequent co-purchase matches across all of them, deduplicated and ranked by combined frequency.

If the cart is empty, this rail is not shown — empty carts already have a "Continue Shopping" message and don't need a second prompt.

---

## What recommendations look like for an administrator

Admins manage recommendations through a new section in the admin dashboard at `/admin/recommendations`, with three subsections: per-product overrides, a settings panel, and a performance report.

### Per-product overrides

On the existing product edit page, a new "Recommendations" tab is added alongside the existing tabs. It has two lists:

- **Pinned products** — up to 4 products the admin chooses to always recommend on this product's detail page, ahead of any algorithmic results. Useful for accessory bundling (a phone case for a specific phone, batteries for a flashlight). Pinned products are searchable by name and added one at a time.
- **Blocked products** — products that should never be recommended on this product's detail page, regardless of co-purchase data. Useful for hiding direct competitors or discontinued lines.

Pinned and blocked lists are independent of the algorithmic data, which continues to refresh nightly. The displayed rail is built as: pinned products first (in the admin's chosen order), then algorithmic results, with blocked products filtered out throughout.

### Settings panel

A single settings page controls system-wide behavior:

- **Co-purchase window** — how far back to look at order history. Default 180 days, adjustable between 30 and 365.
- **Minimum co-purchase count** — the minimum number of co-occurrences before a pair is considered "frequently bought together." Default 3. Lower values surface more recommendations but reduce signal quality.
- **Personalization lookback** — how far back to consider a customer's behavior. Default 60 days.
- **Fallback behavior** — when an algorithmic rail has fewer than 3 results, choose between "fall back to category popularity" (default), "fall back to global popularity," or "hide rail."
- **Enable/disable each rail** — three toggles to turn off any of the three rails site-wide if needed (useful for emergencies or A/B comparisons).

Changes take effect on the next nightly batch run. A "Recompute now" button forces an immediate recalculation; it's rate-limited to once per hour to avoid overload.

### Performance report

A read-only report shows how recommendations are performing over a selectable date range (last 7, 30, or 90 days):

- Impressions per rail (how many times each rail was shown)
- Click-through rate per rail (clicks / impressions)
- Add-to-cart rate per rail (adds / impressions)
- Conversion rate per rail (purchases of recommended items / impressions)
- Top 10 most-clicked recommended products
- Top 10 most-converted recommended products

The data is aggregated nightly. The report is filterable by rail type and exportable as CSV.

---

## How the data is computed

Two batch jobs run nightly during off-peak hours (default 02:00 in the store's timezone):

1. **Co-purchase matrix job** — scans all orders in the configured window, builds pairs of products that appeared in the same order, counts co-occurrences, and stores the top 20 pairs per product in a dedicated `product_recommendations` table. Pair frequency is symmetric (if A appears with B, both A→B and B→A are recorded).

2. **Personalization job** — for each customer with activity in the lookback window, computes a ranked list of up to 50 recommended products based on weighted signals: purchases (weight 5), reviews (weight 3), wishlist adds (weight 2), and category browsing frequency (weight 1). Results are stored in a `customer_recommendations` table.

Both jobs are idempotent and can be safely re-run. They produce snapshots that are read at request time — no live computation happens during a customer's page load, keeping recommendation rendering fast.

When a customer dismisses a product, the dismissal is written to a `recommendation_dismissals` table immediately and applied as a filter at read time, so it takes effect without waiting for the next batch run.

---

## Tracking and privacy

Every recommendation impression, click, add-to-cart, and resulting purchase is logged with the rail type, the source product (for "also bought" and "complete your order"), the recommended product, and a hashed customer or session identifier. Logs are retained for 180 days and used only to power the admin performance report. They are not shared with third parties.

Customers can opt out of personalized recommendations from their account profile. When opted out, the "Recommended for you" rail is replaced with "Trending now" for that customer, and personalization data is no longer computed for them.

---

## What is not included in this version

To match the v1 scope discipline of the rest of Eshopy, the following are deferred:

- Real-time recommendations (sub-second updates as the customer browses)
- Machine learning models beyond simple weighted scoring (no neural nets, no embeddings, no third-party recommendation services)
- Email-based recommendations ("Products you might like" newsletters)
- Recommendations on category or search result pages
- Cross-customer collaborative filtering ("Customers like you also bought")
- Recommendations driven by inventory pressure (push slow-moving stock)
- A/B testing framework for comparing recommendation strategies
- Per-customer-segment overrides (e.g., different recommendations for VIP customers)
- Time-of-day or seasonal weighting
- Recommendations in mobile push notifications
- Image-similarity-based recommendations ("Looks like this")