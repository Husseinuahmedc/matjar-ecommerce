/**
 * Cart feature module index.
 *
 * Feature folder structure (to be built):
 * features/cart/
 * ├── components/
 * │   ├── CartItemList.tsx      — List of cart items
 * │   ├── CartItem.tsx          — Single cart item row
 * │   ├── CartSummary.tsx       — Subtotal, discount, total
 * │   └── CartIcon.tsx          — Navbar icon with item count badge (Client Component)
 * ├── hooks/
 * │   ├── useCart.ts            — Cart state management (client)
 * │   └── useGuestCart.ts       — localStorage guest cart
 * └── types.ts
 *
 * Cart strategy:
 * - Authenticated: cart lives in DB, managed via Server Actions
 * - Guest: cart lives in localStorage, merged on login via mergeGuestCart action
 */

export {};
