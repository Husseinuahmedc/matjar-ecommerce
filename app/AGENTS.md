
# Matjar (متجر) — Single Source of Truth

## 1. Project Overview
Bilingual (Arabic/English) multi-seller e-commerce platform for the Iraqi market (IQD currency). Uses Next.js App Router with Supabase Auth for authentication, Prisma ORM over PostgreSQL for data, `next-intl` for i18n (ar/en, default ar). WhatsApp OTP login via UltraMsg. Payments scaffolded but not connected to a real gateway. ~75% complete — core flows work, payment + polish remain.

- **Next.js** 16.2.9, **React** 19.2.4, **TypeScript** ^5
- **Tailwind CSS** v4, **shadcn/ui**, **class-variance-authority** 0.7.1
- **Prisma** 7.8.0 with `@prisma/adapter-pg` (PostgreSQL driver adapter)
- **Supabase** JS 2.108.2, SSR 0.12.0 (Auth + DB)
- **next-intl** 4.13.0, **zod** 4.4.3, **motion** 12.40.0, **recharts** 3.8.1
- Working directory: `app/` (root of `package.json`)

## 2. Complete Folder Structure
```
app/src/
├── app/                     # Next.js App Router (16.2)
│   ├── globals.css            # Tailwind v4 + CSS custom props + @theme tokens + dark mode
│   ├── layout.tsx             # Root layout — minimal, just passes children through
│   ├── page.tsx               # Redirects / → /ar
│   ├── api/                   # Route Handlers (external HTTP, not Server Actions)
│   │   ├── auth/callback/route.ts   # GET — Supabase OAuth code exchange
│   │   ├── cart/route.ts           # GET — fetch user's DB cart as JSON
│   │   └── webhooks/payment/route.ts  # POST — payment webhook (TODO stub, no sig verification)
│   └── [locale]/              # i18n route segment (ar | en)
│       ├── layout.tsx           # Real layout: Cairo font, RTL/LTR dir, CartProvider, Toaster
│       ├── error.tsx            # Global error boundary (Arabic-only hardcoded text)
│       ├── loading.tsx          # Generic skeleton
│       ├── (auth)/              # Unauthenticated route group
│       │   ├── layout.tsx         # Centered auth form wrapper
│       │   ├── login/page.tsx     # Email/password login form
│       │   ├── register/page.tsx  # Email/password registration form
│       │   ├── phone-login/page.tsx    # WhatsApp OTP login entry
│       │   ├── phone-register/page.tsx # WhatsApp OTP registration entry
│       │   ├── verify-otp/page.tsx     # 6-digit OTP code entry
│       │   ├── create-password/page.tsx # Set password after OTP verification
│       │   └── enter-password/page.tsx  # Enter password after OTP (returning user)
│       ├── (public)/            # No auth required
│       │   ├── layout.tsx         # Navbar(`userProfile={null}` — BUG) + Footer
│       │   ├── page.tsx           # Homepage: hero, featured products, categories
│       │   ├── cart/page.tsx      # Shopping cart (client, uses useCart hook)
│       │   ├── checkout/page.tsx  # Multi-step checkout stepper
│       │   └── products/          # Product catalog
│       │       ├── page.tsx         # Product grid with filters (category, price, search)
│       │       └── [slug]/page.tsx  # Product detail + reviews + add-to-cart
│       ├── (admin)/             # Admin panel (must have ADMIN role)
│       │   └── admin/
│       │       ├── layout.tsx       # Sidebar + Toaster
│       │       ├── dashboard/page.tsx  # Stats cards, recent orders, pending products
│       │       ├── orders/page.tsx     # All orders with status/date filters (client-side filtered — scales poorly)
│       │       ├── products/page.tsx   # Product approval (PUBLISH/REJECT), tabs by status, limit 50 no pagination
│       │       └── users/page.tsx      # User list filtered by role
│       ├── (buyer)/              # Buyer dashboard (BUYER role required)
│       │   ├── layout.tsx         # Buyer layout wrapper
│       │   ├── buyer/dashboard/page.tsx  # Stats, recent orders table, wishlist, account summary
│       │   ├── buyer/dashboard/loading.tsx # Skeleton
│       │   ├── buyer/dashboard/dashboard-animation-wrapper.tsx # Motion wrapper (misplaced — should be in components/)
│       │   ├── orders/page.tsx         # Order list with review modal
│       │   ├── orders/loading.tsx
│       │   ├── orders/[id]/page.tsx      # Order detail (client, with review)
│       │   └── orders/confirmation/page.tsx  # Post-checkout confirmation page
│       ├── (seller)/             # Seller dashboard (SELLER role required)
│       │   └── seller/
│       │       ├── layout.tsx       # SellerSidebar + Toaster
│       │       ├── error.tsx        # Seller error boundary
│       │       ├── dashboard/page.tsx   # Revenue chart, inventory alerts, top products
│       │       ├── dashboard/loading.tsx
│       │       ├── products/page.tsx    # Product table (client: filters, bulk actions, status toggle)
│       │       ├── products/loading.tsx
│       │       ├── products/new/page.tsx   # ProductForm (create)
│       │       ├── products/[id]/edit/page.tsx # ProductForm (edit)
│       │       ├── orders/page.tsx        # Orders with status tabs, seller-specific transitions
│       │       ├── orders/loading.tsx
│       │       └── orders/[id]/page.tsx   # Order detail + timeline + status update
│       └── (support)/            # Support staff (SUPPORT role, minimal)
│           └── support/orders/page.tsx  # Stub — shows badge only
├── actions/                  # Server Actions ("use server" files)
│   ├── auth.ts                # signIn, signUp, signOut
│   ├── otp.ts                 # sendPhoneOtp, verifyPhoneOtp, completeRegistration, completeLogin
│   ├── products.ts            # createProduct, updateProduct, deleteProduct, submitForReview, toggleProductStatus, updateProductStock, bulkDeleteProducts, updateStatus
│   ├── orders.ts              # placeOrder, updateOrderStatus (admin), sellerUpdateOrderStatus, cancelOrder (buyer)
│   ├── cart.ts                # addToCart, updateCartItem, removeCartItem, clearCart, syncCart
│   ├── payments.ts            # TODO stub — createPaymentIntent returns placeholder
│   └── reviews.ts             # createReview
├── components/               # React components
│   ├── admin/                 # admin-sidebar.tsx, order-status-dropdown.tsx, pending-product-actions.tsx
│   ├── auth/                  # 11 form components: login, register, phone-login, phone-register, verify-otp, create-password, enter-password, otp-input, password-strength, phone-input, logout-button
│   ├── cart/                  # cart-drawer.tsx, cart-item.tsx, cart-summary.tsx
│   ├── dashboard/             # DashboardCard.tsx, BuyerSidebar.tsx, MobileDashboardNav.tsx + 5 DEAD components (AccountSummary, EmptyState, RecentOrdersTable, RecommendationsGrid, WishlistGrid — never imported)
│   ├── products/              # product-image.tsx, add-to-cart-button.tsx, product-form.tsx, status-button.tsx
│   ├── reviews/               # review-modal.tsx
│   ├── seller/                # seller-sidebar.tsx, seller-products-client.tsx, seller-order-status-dropdown.tsx, revenue-chart.tsx, inventory-alerts.tsx, top-products.tsx
│   ├── shared/                # Navbar.tsx (437 lines — needs decomposition), Footer.tsx, index.ts (empty)
│   └── ui/                    # base.tsx (Button, Input, Textarea, Label, Card, Badge, Table, Skeleton), select.tsx, sonner.tsx, alert-dialog.tsx, dropdown-menu.tsx, avatar.tsx, reactbits/ (Dock, Counter, BlurText)
├── features/                 # Feature modules
│   ├── auth/                  # schema.ts (signIn/signUp zod), otp.schema.ts (phone/otp/password zod)
│   ├── checkout/              # checkout-stepper.tsx, order-summary.tsx, payment-method-select.tsx, shipping-address-form.tsx, shipping-method-select.tsx, schema.ts
│   └── 6 empty stubs: analytics/, cart/, inventory/, orders/, payments/, products/ (all just empty index.ts)
├── hooks/                    # use-cart.tsx (CartContext + CartProvider), index.ts (empty stub)
├── i18n/                     # request.ts, routing.ts (locales: ar/en, default ar), messages/{ar,en}.json
├── lib/                      # db.ts (Prisma singleton + pg adapter), utils.ts (cn, formatPrice, formatDate), otp.ts (crypto hash), rate-limiter.ts (in-memory Map — won't scale), ultramsg.ts (WhatsApp), supabase/{client,server}.ts, data/buyer.ts (getBuyerDashboard)
├── services/                 # product.service.ts, order.service.ts, cart.service.ts, inventory.service.ts, analytics.service.ts, otp.service.ts, payment.service.ts (stub)
├── types/                    # index.ts (UserRole, ActionResult, Pagination, Locale), order.ts, product.ts
├── utils/                    # index.ts (empty stub)
└── middleware.ts             # next-intl locale routing + Supabase auth + role-based redirects
```

## 3. Route Map
| Route | File | Auth | Role | Status |
|-------|------|------|------|--------|
| `/` | `app/page.tsx` | No | — | ✅ Redirects to `/ar` |
| `/[locale]/` | `app/[locale]/(public)/page.tsx` | No | — | ✅ Homepage |
| `/[locale]/products` | `app/[locale]/(public)/products/page.tsx` | No | — | ✅ |
| `/[locale]/products/[slug]` | `app/[locale]/(public)/products/[slug]/page.tsx` | No | — | ✅ |
| `/[locale]/cart` | `app/[locale]/(public)/cart/page.tsx` | No | — | ✅ |
| `/[locale]/checkout` | `app/[locale]/(public)/checkout/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/login` | `app/[locale]/(auth)/login/page.tsx` | No | — | ✅ |
| `/[locale]/register` | `app/[locale]/(auth)/register/page.tsx` | No | — | ✅ |
| `/[locale]/phone-login` | `app/[locale]/(auth)/phone-login/page.tsx` | No | — | ✅ |
| `/[locale]/phone-register` | `app/[locale]/(auth)/phone-register/page.tsx` | No | — | ✅ |
| `/[locale]/verify-otp` | `app/[locale]/(auth)/verify-otp/page.tsx` | No | — | ✅ |
| `/[locale]/create-password` | `app/[locale]/(auth)/create-password/page.tsx` | No | — | ✅ |
| `/[locale]/enter-password` | `app/[locale]/(auth)/enter-password/page.tsx` | No | — | ✅ |
| `/[locale]/buyer/dashboard` | `app/[locale]/(buyer)/buyer/dashboard/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders` | `app/[locale]/(buyer)/orders/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders/[id]` | `app/[locale]/(buyer)/orders/[id]/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders/confirmation` | `app/[locale]/(buyer)/orders/confirmation/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/admin/dashboard` | `app/[locale]/(admin)/admin/dashboard/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/orders` | `app/[locale]/(admin)/admin/orders/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/products` | `app/[locale]/(admin)/admin/products/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/users` | `app/[locale]/(admin)/admin/users/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/orders/[id]` | — | Yes | ADMIN | ❌ **MISSING** (linked from dashboard but no route) |
| `/[locale]/seller/dashboard` | `app/[locale]/(seller)/seller/dashboard/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products` | `app/[locale]/(seller)/seller/products/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products/new` | `app/[locale]/(seller)/seller/products/new/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products/[id]/edit` | `app/[locale]/(seller)/seller/products/[id]/edit/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/orders` | `app/[locale]/(seller)/seller/orders/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/orders/[id]` | `app/[locale]/(seller)/seller/orders/[id]/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/support/orders` | `app/[locale]/(support)/support/orders/page.tsx` | Yes | SUPPORT | 🚧 Minimal stub |

**No `not-found.tsx` exists in any route group.** Unsupported locales fall back to Next.js default 404 (not localized).

## 4. API Map
| Method | Endpoint | Auth | Status |
|--------|----------|------|--------|
| GET | `src/app/api/auth/callback/route.ts` | Implicit (Supabase code) | ✅ |
| GET | `src/app/api/cart/route.ts` | Yes (getUser) | ✅ |
| POST | `src/app/api/webhooks/payment/route.ts` | No | 🚧 Stub — no HMAC signature verification, returns 200 for all |

## 5. Database Models
All models in `app/prisma/schema.prisma`. PostgreSQL via Prisma 7 driver adapter.

### User (`users`)
`id String @id @default(cuid())` (should match Supabase Auth UUID), `email String @unique`, `fullName String`, `phone String?`, `role UserRole @default(BUYER)`, `rewardPoints Int @default(0)`. Relations: products[], orders[], reviews[], shippingAddresses[], cart?, wishlist?, orderEvents[].

### Category (`categories`)
`id`, `nameAr`, `nameEn`, `slug @unique`, `parentId?` (self-relation `CategoryHierarchy`). Relations: children[], products[], parent?.  
**Issue:** No index on `parentId`. No `@unique([parentId, slug])` — same slug works under different parents (intentional?).

### Product (`products`)
`id`, `titleAr`, `titleEn`, `descriptionAr`, `descriptionEn`, `slug @unique`, `price Decimal(10,2)`, `discountPrice? Decimal(10,2)`, `stock Int @default(0)`, `lowStockThreshold Int @default(5)`, `sku @unique`, `status ProductStatus @default(DRAFT)`, `isFeatured Boolean @default(false)`, `sellerId`, `categoryId`. Indexes: `[sellerId]`, `[categoryId]`, `[status]`. Relations: seller(User), category, images[], tags[], reviews[], cartItems[], wishlistItems[], orderItems[].

### ProductImage (`product_images`)
`id`, `productId`, `url`, `position`, `isPrimary`. `onDelete: Cascade` on product. Index: `[productId]`.

### Tag (`tags`)
`id`, `nameAr`, `nameEn`, `slug @unique`. M2M with Product via implicit junction.

### Cart (`carts`)
`id`, `userId @unique`. `onDelete: Cascade` on user. Relation: items[].

### CartItem (`cart_items`)
`id`, `cartId`, `productId`, `quantity Int`, `unitPrice Decimal(10,2)`. `@@unique([cartId, productId])`. Relation: cart (`onDelete: Cascade`), product (no `onDelete` → `Restrict` — **blocks product deletion**).

### ShippingAddress (`shipping_addresses`)
`id`, `userId`, `fullName`, `phone`, `city`, `country`, `street`, `isDefault`. Index: `[userId]`. `onDelete: Cascade` on user. Relation: orders[] (no `onDelete` → `Restrict`).

### Order (`orders`)
`id`, `buyerId`, `status OrderStatus @default(PENDING)`, `paymentStatus PaymentStatus @default(PENDING)`, `paymentIntentId? @unique`, `subtotal/shppingCost/discount/total Decimal(10,2)`, `shippingAddressId`, `couponCode?`. Indexes: `[buyerId]`, `[status]`. Relations: buyer(User), shippingAddress, items[], events[].  
**Issue:** No index on `shippingAddressId`.

### OrderItem (`order_items`)
`id`, `orderId`, `productId`, `quantity Int`, `unitPrice Decimal(10,2)`. `onDelete: Cascade` on order. Product relation: no `onDelete` → `Restrict`.  
**Issue:** No indexes on `orderId` or `productId`.

### OrderEvent (`order_events`)
`id`, `orderId`, `status OrderStatus`, `actorId`, `note?`. Index: `[orderId]`. `onDelete: Cascade` on order.  
**Issue:** No index on `actorId`. Actor(User) relation no `onDelete` → `Restrict`.

### Review (`reviews`)
`id`, `productId`, `buyerId`, `rating Int`, `title?`, `body?`, `status ReviewStatus @default(PENDING)`. `@@unique([productId, buyerId])`. Index: `[productId]`. Product `onDelete: Cascade`, buyer no `onDelete` → `Restrict`.  
**Issue:** No index on `buyerId`.

### Wishlist (`wishlists`)
`id`, `userId @unique`. `onDelete: Cascade` on user. Relation: items[].

### WishlistItem (`wishlist_items`)
`id`, `wishlistId`, `productId`. `@@unique([wishlistId, productId])`. `onDelete: Cascade` on both wishlist and product.

### PhoneOtp (`phone_otps`)
`id`, `phone`, `otpHash`, `expiresAt`, `attempts`, `verified`, `verifiedToken?`, `tokenExpiresAt?`, `requestCount`, `windowStart`. Index: `[phone]`.  
**Issue:** Missing composite index `[phone, verified]` and index on `expiresAt` for cleanup queries.

### Enums
`UserRole`: ADMIN, SELLER, BUYER, SUPPORT
`ProductStatus`: DRAFT, PENDING, PUBLISHED, REJECTED
`OrderStatus`: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → COMPLETED (or CANCELLED/REFUNDED from earlier states)
`PaymentStatus`: PENDING, PAID, FAILED, REFUNDED
`ReviewStatus`: PENDING, APPROVED, REJECTED

## 6. What's Done ✅
- Email/password auth (Supabase, signUp/signIn/signOut)
- WhatsApp OTP auth flow (ultramsg.com → OTP → verify → set password)
- Role-based access (ADMIN, SELLER, BUYER, SUPPORT) enforced in middleware + actions
- Product catalog: grid, detail page, category filtering, search, price filters
- Shopping cart: add/update/remove, guest localStorage + DB sync on login
- Checkout: multi-step shipping address → method → payment selection (UI only)
- Order placement with stock decrement + cart clearing (transactional)
- Order lifecycle: status transitions, audit events, stock restore on cancel
- Buyer dashboard: stats, recent orders, wishlist, recommendations
- Seller dashboard: revenue chart (recharts), inventory alerts, top products
- Seller product management: CRUD, bulk delete, status toggle, SKU auto-gen, drag-drop images
- Seller order management: status tabs, CONFIRMED→PROCESSING→SHIPPED transitions
- Admin: dashboard stats, order management, product approval/rejection, user list
- Bilingual AR/EN with i18n messages, RTL layout, Cairo font
- IQD currency formatting (`formatPrice` in `lib/utils.ts`)

## 7. What's In Progress 🚧
- **Payment gateway integration**: `services/payment.service.ts` and `actions/payments.ts` are TODO stubs. Webhook route returns 200 for everything. UI shows payment method selection (Stripe, Tap, Moyasar, Cash on Delivery) but no real integration.
- **Support module**: `support/orders/page.tsx` is a minimal stub showing a badge only.

## 8. What's Missing ❌
- `/admin/orders/[id]` detail page (linked from dashboard, 404s)
- `not-found.tsx` files in every route group (localized 404s)
- `forgot-password` flow (link hidden in login form, no route exists)
- Real payment gateway connection (Stripe/Tap/Moyasar)
- Webhook signature verification (`PAYMENT_WEBHOOK_SECRET` defined but unused)
- Distributed rate limiter (current in-memory Map won't scale past single instance)
- Full-text product search (uses slow `contains` with `mode: "insensitive"`)
- Admin delete product functionality (blocked by CartItem/OrderItem Restrict cascade)
- Production-grade slug generation (uses `Math.random()`, no uniqueness check)
- Shipping cost configuration (hardcoded 25/50)
- Newsletter/contact form functionality (Footer has non-functional placeholder)

## 9. Known Issues 🔴
1. **Broken link**: Admin dashboard → "View" order links to `/[locale]/admin/orders/[id]` — route does not exist.
2. **Webhook stub**: `POST /api/webhooks/payment` has no signature verification. Deploying this exposes an unprotected endpoint.
3. **In-memory rate limiter**: `lib/rate-limiter.ts` uses a `Map` — rate limits don't share across instances/edge. Effectively bypassable on serverless platforms.
4. **CartItem/OrderItem product foreign key**: No `onDelete` → defaults to `Restrict`. A seller cannot delete a product if it's in any cart or order.
5. **OrderItem missing indexes**: No indexes on `orderId` or `productId` — will degrade performance at scale.
6. **No `not-found.tsx`**: Unsupported locale or 404 renders generic Next.js page with no i18n.
7. **Public layout passes `userProfile={null}`**: Logged-in users see "Login / Sign Up" on public pages instead of their avatar.
8. **Admin orders filter client-side**: `getOrdersByAdmin()` fetches ALL orders, then `.filter()`s in memory. Will break at scale.
9. **Duplicate logic**: `getDashboardPath` defined in 3 files (`middleware.ts:22`, `actions/auth.ts:32`, `actions/otp.ts:20`). `STATUS_COLORS` defined in 4 files.
10. **Error boundary**: `/[locale]/error.tsx` has hardcoded Arabic text — not localized.
11. **5 dead components**: `AccountSummary`, `EmptyState`, `RecentOrdersTable`, `RecommendationsGrid`, `WishlistGrid` in `components/dashboard/` — never imported anywhere.
12. **6 empty `features/*/index.ts` files**: analytics, cart, inventory, orders, payments, products.
13. **Global error boundary**: `/[locale]/error.tsx` has hardcoded Arabic text — not localized.

## 10. Coding Standards
### Architecture Pattern
- **Server Components** (default) → fetch data directly, render static content
- **Client Components** (`"use client"`) → interactive UI, use `useState`/`useEffect`
- **Server Actions** (`"use server"`) → form submissions, mutations, called from client components
- **Services** → pure business logic, no React dependencies, imported only by actions
- **Data flow**: Page → Service (server component) OR Client Component → Server Action → Service → Prisma

### Component Structure
- Server components: `async function` with `params: Promise<{ locale: string }>`
- Client components: `"use client"` directive at top, use `useLocale()` for locale
- Components use `cn()` from `lib/utils.ts` for class merging (never string concat)
- Form components: local state → `startTransition` / `useActionState` → Server Action call
- Named exports preferred for components imported from barrel files

### Import Order (observed pattern)
1. React/Next.js imports
2. Third-party libraries (next-intl, lucide-react, supabase)
3. Local modules (`@/` alias = `src/`)
4. Components: `@/components/ui/*`, `@/components/shared/*`, `@/components/*`
5. Relative imports (rare)

### Naming
- Files: kebab-case (`product-form.tsx`, `use-cart.tsx`)
- Server Actions: camelCase verbs (`createProduct`, `placeOrder`, `updateOrderStatus`)
- Service functions: camelCase verbs (`getProducts`, `createProduct`, `updateStock`)
- Components: PascalCase (`LoginForm`, `CartProvider`, `AdminSidebar`)
- Types: PascalCase (`OrderStatus`, `ActionResult<T>`, `ProductListItem`)

### Zod Validations
- Auth schemas: `features/auth/schema.ts`, `features/auth/otp.schema.ts`
- Product schema: inline in `actions/products.ts` (productSchema)
- Order schema: inline in `actions/orders.ts` (placeOrderSchema, cancelOrderSchema)
- Checkout schemas: `features/checkout/schema.ts`
- Bilingual error messages with ` / ` separator (English / Arabic)

### i18n
- `useTranslations()` in client, `getTranslations()` in server
- `useLocale()` for locale-aware logic (RTL, date formats)
- Locale-specific format: `locale === "ar" ? "Arabic" : "English"` (inline, NOT using translations — intentional for bilingual data display)

## 11. Absolute Rules

### Always Do
- Use `cn()` from `lib/utils.ts` for all class merging
- Validate inputs with Zod in Server Actions before hitting services
- Verify Supabase auth `getUser()` in every Server Action (not `getSession()`)
- Use `revalidatePath()` after mutations that affect cached data
- Handle ZodError, Prisma P2002 (unique constraint), and NEXT_REDIRECT in try/catch
- Use `formatPrice(Number(price), locale === "ar" ? "ar-IQ" : "en-IQ")` for all prices
- Use `import { Link } from "@/i18n/routing"` for all links (never `next/link`)
- Read `params` via `await params` / `await searchParams` (Next.js 16 async API)
- Set `@default(cuid())` for all model IDs (except User.id which maps to Supabase UUID)

### Never Do
- Expose `SUPABASE_SERVICE_ROLE_KEY`, `OTP_PEPPER`, `PAYMENT_SECRET_KEY`, `ULTRAMSG_TOKEN`, `PAYMENT_WEBHOOK_SECRET` to client (all server-only)
- Trust client-side price/total calculations for orders (always recalculate in `placeOrder`)
- Skip Zod validation in Server Actions (the only server-side security boundary)
- Use `getSession()` for auth checks — always use `getUser()` (gets fresh state from Supabase)
- Mix `next/link` with `@/i18n/routing` Link — use the i18n one everywhere
- Hardcode locale strings in server components that could use `getTranslations()`
- Write `cd /path && command` — use the `workdir` parameter instead
## UI Absolute Rules (Every Phase)

### Stack
- Tailwind CSS only — no inline styles
- shadcn/ui for all base components
- ReactBits for animations (already configured)
- Framer Motion for transitions

### Every Page Must Have:
- Proper spacing (p-4 minimum, sections p-8+)
- Visual hierarchy (clear H1 → H2 → body)
- Hover states on all interactive elements
- Loading skeletons (not spinners alone)
- Empty states with icon + message
- Mobile responsive (test at 375px)
- Dark mode support

### Never:
- Raw unstyled HTML elements
- Default browser styles
- Placeholder grey boxes
- Times New Roman / default fonts
- Hardcoded colors (use Tailwind tokens only)
- Buttons without hover/active states
- Forms without proper focus rings
- Tables without row hover states

### Quality Bar:
Every page must look like a $500+ SaaS product.
Not a university project.
## 12. Environment Variables
From `app/.env.example`:

| Variable | Loaded | Used In |
|----------|--------|---------|
| `DATABASE_URL` | ✅ Required | `lib/db.ts` (Prisma pg adapter) |
| `DIRECT_URL` | ✅ Required | `prisma.config.ts` (migrations) |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Required | `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Required | All Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | ❓ Optional | `lib/supabase/server.ts` (service client) |
| `OTP_PEPPER` | ✅ Required | `lib/otp.ts` (OTP hashing) |
| `ULTRAMSG_INSTANCE_ID` | ✅ Required | `lib/ultramsg.ts` |
| `ULTRAMSG_TOKEN` | ✅ Required | `lib/ultramsg.ts` |
| `PAYMENT_SECRET_KEY` | ⚠️ Defined but unused | `services/payment.service.ts` (TODO) |
| `PAYMENT_WEBHOOK_SECRET` | ⚠️ Defined but unused | `app/api/webhooks/payment/route.ts` (TODO) |
| `NEXT_PUBLIC_APP_URL` | ❓ Optional | Not used in code (for reference) |

## 13. Phase Progress
| # | Phase | Status |
|---|-------|--------|
| 1 | Architecture Audit | ✅ Complete (2026-06-17) |
| 2 | Fix Critical Issues | ❌ Pending |
| 3 | Payment Gateway Integration | ❌ Pending |
| 4 | Performance Optimization | ❌ Pending |
| 5 | Testing & QA | ❌ Pending |
| 6 | Production Readiness | ❌ Pending |

## 14. Next Steps (Prioritized)
1. **Create `/admin/orders/[id]/page.tsx`** — broken link, user-facing 404
2. **Implement webhook signature verification** — `src/app/api/webhooks/payment/route.ts` must verify HMAC before processing
3. **Replace in-memory rate limiter** — `lib/rate-limiter.ts` → Redis/Upstash for production
4. **Fix CartItem/OrderItem `onDelete`** — decide cascade vs set-null, update `schema.prisma`, run migration
5. **Add missing Prisma indexes**: `OrderItem(orderId)`, `OrderItem(productId)`, `OrderEvent(actorId)`, `Review(buyerId)`, `Category(parentId)`, `Order(shippingAddressId)`
6. **Centralize duplicated logic**: extract `getDashboardPath` to `lib/navigation.ts`, `STATUS_COLORS` to `lib/status.ts`
7. **Decompose `Navbar.tsx`** (437 lines → sub-components <200 lines each)
8. **Create `not-found.tsx` files** in each route group with i18n
9. **Connect payment gateway** — implement `payment.service.ts` + Stripe/Tap/Moyasar
10. **Fix public layout userProfile** — pass real user from server component to Navbar
11. **Add server-side DB-level filtering to admin orders** — replace in-memory `.filter()`
12. **Remove dead components and empty feature stubs**
13. **Make shipping costs and other hardcoded values configurable**
14. **Fix product slug generation** — replace `Math.random()` with deterministic slugify
15. **Localize error boundary** — remove hardcoded Arabic text, use `useTranslations`

## Test Accounts (seeded)
| Email | Password | Role |
|-------|----------|------|
| admin@matjar.com | Admin123! | ADMIN |
| seller@matjar.com | Seller123! | SELLER |
| buyer@matjar.com | Buyer123! | BUYER |
| support@matjar.com | Support123! | SUPPORT |

