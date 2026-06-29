# Matjar (متجر) — Single Source of Truth

## 1. Project Overview
Bilingual (Arabic/English) multi-seller e-commerce platform for the Iraqi market (IQD currency). Uses Next.js App Router with Supabase Auth for authentication, Prisma ORM over PostgreSQL for data, `next-intl` for i18n (ar/en, default ar). WhatsApp OTP login via UltraMsg. Payments scaffolded but not connected to a real gateway. ~80% complete — auth fully rebuilt, payment + polish remain.

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
│       ├── error.tsx            # Global error boundary (i18n — useTranslations)
│       ├── loading.tsx          # Generic skeleton
│       ├── not-found.tsx        # 404 page (bilingual Ar/En)
│       ├── (auth)/              # Unauthenticated route group
│       │   ├── error.tsx          # Auth error boundary (i18n)
│       │   ├── loading.tsx         # Auth form skeleton
│       │   ├── layout.tsx         # Centered auth form wrapper
│       │   ├── login/page.tsx     # Email/password login form (remember me, forgot-password)
│       │   ├── register/page.tsx  # Email/password registration form → verify-email
│       │   ├── forgot-password/page.tsx  # Request password reset email
│       │   ├── reset-password/page.tsx   # Set new password from reset link
│       │   ├── verify-email/page.tsx     # Email verification prompt + resend
│       │   ├── phone-login/page.tsx    # WhatsApp OTP login entry
│       │   ├── phone-register/page.tsx # WhatsApp OTP registration entry
│       │   ├── verify-otp/page.tsx     # 6-digit OTP code entry
│       │   ├── create-password/page.tsx # Set password after OTP verification
│       │   └── enter-password/page.tsx  # Enter password after OTP (returning user)
│       ├── (public)/            # No auth required
│       │   ├── error.tsx          # Public error boundary (i18n)
│       │   ├── loading.tsx        # Public page skeleton
│       │   ├── layout.tsx         # Navbar(real user profile) + Footer
│       │   ├── page.tsx           # Homepage: hero, featured products, categories
│       │   ├── cart/page.tsx      # Shopping cart (client, uses useCart hook)
│       │   ├── checkout/page.tsx  # Multi-step checkout stepper
│       │   └── products/          # Product catalog
│       │       ├── page.tsx         # Product grid with filters (category, price, search)
│       │       └── [slug]/page.tsx  # Product detail + reviews + add-to-cart
│       ├── (admin)/             # Admin panel (must have ADMIN role)
│       │   └── admin/
│       │       ├── error.tsx        # Admin error boundary (i18n)
│       │       ├── loading.tsx      # Admin skeleton
│       │       ├── layout.tsx       # Sidebar + Toaster (double-protection: middleware + DB role check)
│       │       ├── dashboard/page.tsx  # Stats cards, recent orders, pending products
│       │       ├── orders/page.tsx     # All orders with status/date filters (client-side filtered — scales poorly)
│       │       ├── orders/[id]/page.tsx # Admin order detail + timeline + payment/shipping info
│       │       ├── orders/[id]/loading.tsx # Order detail skeleton
│       │       ├── products/page.tsx   # Product approval (PUBLISH/REJECT), tabs by status, limit 50 no pagination
│       │       └── users/page.tsx      # User list filtered by role
│       ├── (buyer)/              # Buyer dashboard (BUYER role required)
│       │   ├── error.tsx          # Buyer error boundary (i18n)
│       │   ├── layout.tsx         # Buyer layout wrapper (double-protection)
│       │   ├── buyer/dashboard/page.tsx  # Stats, recent orders table, wishlist, account summary
│       │   ├── buyer/dashboard/loading.tsx # Skeleton
│       │   ├── buyer/dashboard/dashboard-animation-wrapper.tsx # Motion wrapper
│       │   ├── buyer/wishlist/page.tsx    # Buyer wishlist
│       │   ├── buyer/wishlist/loading.tsx # Wishlist skeleton
│       │   ├── buyer/addresses/page.tsx   # Buyer shipping addresses
│       │   ├── buyer/addresses/loading.tsx # Addresses skeleton
│       │   ├── buyer/settings/page.tsx    # Buyer account settings (read-only)
│       │   ├── buyer/settings/loading.tsx # Settings skeleton
│       │   ├── orders/page.tsx         # Order list with review modal
│       │   ├── orders/loading.tsx
│       │   ├── orders/[id]/page.tsx      # Order detail (client, with review)
│       │   ├── orders/[id]/loading.tsx   # Order detail skeleton
│       │   ├── orders/confirmation/page.tsx  # Post-checkout confirmation page
│       │   └── orders/confirmation/loading.tsx # Confirmation skeleton
│       ├── (seller)/             # Seller dashboard (SELLER role required)
│       │   └── seller/
│       │       ├── layout.tsx       # SellerSidebar + Toaster (double-protection)
│       │       ├── error.tsx        # Seller error boundary (i18n)
│       │       ├── dashboard/page.tsx   # Revenue chart, inventory alerts, top products
│       │       ├── dashboard/loading.tsx
│       │       ├── products/page.tsx    # Product table (client: filters, bulk actions, status toggle)
│       │       ├── products/loading.tsx
│       │       ├── products/new/page.tsx   # ProductForm (create)
│       │       ├── products/new/loading.tsx # New product skeleton
│       │       ├── products/[id]/edit/page.tsx # ProductForm (edit)
│       │       ├── products/[id]/edit/loading.tsx # Edit product skeleton
│       │       ├── orders/page.tsx        # Orders with status tabs, seller-specific transitions
│       │       ├── orders/loading.tsx
│       │       ├── orders/[id]/page.tsx   # Order detail + timeline + status update
│       │       └── orders/[id]/loading.tsx  # Order detail skeleton
│       └── (support)/            # Support staff (SUPPORT role)
│           └── support/
│               ├── layout.tsx       # SupportSidebar + Toaster (double-protection)
│               ├── error.tsx        # Support error boundary (i18n)
│               ├── loading.tsx      # Support skeleton
│               ├── orders/page.tsx  # Customer orders (read-only)
│               └── orders/[id]/page.tsx # Support order detail (read-only)
├── actions/                  # Server Actions ("use server" files)
│   ├── auth.ts                # signIn, signUp, signOut, resendVerificationEmail, requestPasswordReset, resetPassword
│   ├── otp.ts                 # sendPhoneOtp, verifyPhoneOtp, completeRegistration, completeLogin
│   ├── products.ts            # createProduct, updateProduct, deleteProduct, submitForReview, toggleProductStatus, updateProductStock, bulkDeleteProducts, updateStatus
│   ├── orders.ts              # placeOrder, updateOrderStatus (admin), sellerUpdateOrderStatus, cancelOrder (buyer)
│   ├── cart.ts                # addToCart, updateCartItem, removeCartItem, clearCart, syncCart
│   ├── payments.ts            # TODO stub — createPaymentIntent returns placeholder
│   └── reviews.ts             # createReview
├── components/               # React components
│   ├── admin/                 # admin-sidebar.tsx, order-status-dropdown.tsx, pending-product-actions.tsx
│   ├── auth/                  # login-form.tsx, register-form.tsx, forgot-password-form.tsx, reset-password-form.tsx, verify-email-prompt.tsx, phone-login-form.tsx, phone-register-form.tsx, verify-otp-form.tsx, create-password-form.tsx, enter-password-form.tsx, otp-input.tsx, password-strength.tsx, phone-input.tsx, logout-button.tsx
│   ├── cart/                  # cart-drawer.tsx, cart-item.tsx, cart-summary.tsx
│   ├── dashboard/             # DashboardCard.tsx, BuyerSidebar.tsx, MobileDashboardNav.tsx + 5 DEAD components
│   ├── products/              # product-image.tsx, add-to-cart-button.tsx, product-form.tsx, status-button.tsx
│   ├── reviews/               # review-modal.tsx
│   ├── seller/                # seller-sidebar.tsx, seller-products-client.tsx, seller-order-status-dropdown.tsx, revenue-chart.tsx, inventory-alerts.tsx, top-products.tsx
│   ├── support/               # support-sidebar.tsx
│   ├── shared/                # Navbar.tsx (437 lines — needs decomposition), Footer.tsx, index.ts (empty)
│   └── ui/                    # base.tsx, select.tsx, sonner.tsx, alert-dialog.tsx, dropdown-menu.tsx, avatar.tsx, reactbits/
├── features/                 # Feature modules
│   ├── auth/                  # schema.ts (signIn/signUp zod), otp.schema.ts (phone/otp/password zod)
│   ├── checkout/              # checkout-stepper.tsx, order-summary.tsx, payment-method-select.tsx, shipping-address-form.tsx, shipping-method-select.tsx, schema.ts
│   └── 6 empty stubs: analytics/, cart/, inventory/, orders/, payments/, products/ (all just empty index.ts)
├── hooks/                    # use-cart.tsx (CartContext + CartProvider), index.ts (empty stub)
├── i18n/                     # request.ts, routing.ts (locales: ar/en, default ar), messages/{ar,en}.json
├── lib/                      # db.ts, utils.ts, otp.ts, ultramsg.ts, supabase/{client,server}.ts, data/buyer.ts
│   ├── auth/                  # guards.ts (requireAuth, requireRole, getServerSession, unauthorized, forbidden)
│   │                          # rate-limit.ts (DB-backed rate limiter — 5 login/15min, 3 OTP/hr, etc.)
│   │                          # audit.ts (logAuditEvent — all auth events → audit_logs table)
│   ├── navigation.ts          # getDashboardPath, PROTECTED_ROLE_ROUTES, AUTH_ONLY_PATHS (single source of truth)
│   └── rate-limiter.ts        # DEPRECATED in-memory Map — kept for OTP service compat, use lib/auth/rate-limit.ts
├── services/                 # product.service.ts, order.service.ts, cart.service.ts, inventory.service.ts, analytics.service.ts, otp.service.ts, payment.service.ts (stub)
├── types/                    # index.ts (UserRole inc. SUPER_ADMIN, ActionResult, Pagination, Locale), order.ts, product.ts
├── utils/                    # index.ts (empty stub)
└── middleware.ts             # next-intl + Supabase auth + role-based redirects using lib/navigation.ts
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
| `/[locale]/forgot-password` | `app/[locale]/(auth)/forgot-password/page.tsx` | No | — | ✅ |
| `/[locale]/reset-password` | `app/[locale]/(auth)/reset-password/page.tsx` | No | — | ✅ |
| `/[locale]/verify-email` | `app/[locale]/(auth)/verify-email/page.tsx` | No | — | ✅ |
| `/[locale]/phone-login` | `app/[locale]/(auth)/phone-login/page.tsx` | No | — | ✅ |
| `/[locale]/phone-register` | `app/[locale]/(auth)/phone-register/page.tsx` | No | — | ✅ |
| `/[locale]/verify-otp` | `app/[locale]/(auth)/verify-otp/page.tsx` | No | — | ✅ |
| `/[locale]/create-password` | `app/[locale]/(auth)/create-password/page.tsx` | No | — | ✅ |
| `/[locale]/enter-password` | `app/[locale]/(auth)/enter-password/page.tsx` | No | — | ✅ |
| `/[locale]/buyer/dashboard` | `app/[locale]/(buyer)/buyer/dashboard/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders` | `app/[locale]/(buyer)/orders/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders/[id]` | `app/[locale]/(buyer)/orders/[id]/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/orders/confirmation` | `app/[locale]/(buyer)/orders/confirmation/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/buyer/wishlist` | `app/[locale]/(buyer)/buyer/wishlist/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/buyer/addresses` | `app/[locale]/(buyer)/buyer/addresses/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/buyer/settings` | `app/[locale]/(buyer)/buyer/settings/page.tsx` | Yes | BUYER | ✅ |
| `/[locale]/admin/dashboard` | `app/[locale]/(admin)/admin/dashboard/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/orders` | `app/[locale]/(admin)/admin/orders/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/products` | `app/[locale]/(admin)/admin/products/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/users` | `app/[locale]/(admin)/admin/users/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/admin/orders/[id]` | `app/[locale]/(admin)/admin/orders/[id]/page.tsx` | Yes | ADMIN | ✅ |
| `/[locale]/seller/dashboard` | `app/[locale]/(seller)/seller/dashboard/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products` | `app/[locale]/(seller)/seller/products/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products/new` | `app/[locale]/(seller)/seller/products/new/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/products/[id]/edit` | `app/[locale]/(seller)/seller/products/[id]/edit/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/orders` | `app/[locale]/(seller)/seller/orders/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/seller/orders/[id]` | `app/[locale]/(seller)/seller/orders/[id]/page.tsx` | Yes | SELLER | ✅ |
| `/[locale]/support/orders` | `app/[locale]/(support)/support/orders/page.tsx` | Yes | SUPPORT | ✅ |
| `/[locale]/support/orders/[id]` | `app/[locale]/(support)/support/orders/[id]/page.tsx` | Yes | SUPPORT | ✅ |

**`not-found.tsx` exists at `[locale]/not-found.tsx` with bilingual 404 page.**

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

### RateLimit (`rate_limits`)
`id`, `key String` (e.g. "login:ip:1.2.3.4"), `action String` (e.g. "login", "otp_send"), `count Int`, `windowStart DateTime`, `blockedUntil DateTime?`. `@@unique([key, action])`. Indexes: `[key]`, `[windowStart]`.
**Replaces the in-memory `lib/rate-limiter.ts` Map.**

### AuditLog (`audit_logs`)
`id`, `userId String?`, `action String`, `ip String?`, `userAgent String?`, `metadata Json?`. Indexes: `[userId]`, `[action]`, `[createdAt]`.
**Immutable append-only auth event trail.**

### Category (`categories`)
`id`, `nameAr`, `nameEn`, `slug @unique`, `parentId?`. Relations: children[], products[], parent?.

### Product (`products`)
`id`, `titleAr`, `titleEn`, `descriptionAr`, `descriptionEn`, `slug @unique`, `price Decimal(10,2)`, `discountPrice?`, `stock Int`, `lowStockThreshold Int`, `sku @unique`, `status ProductStatus`, `isFeatured Boolean`, `sellerId`, `categoryId`. Indexes: `[sellerId]`, `[categoryId]`, `[status]`.

### ProductImage, Tag, Cart, CartItem, ShippingAddress, Order, OrderItem, OrderEvent, Review, Wishlist, WishlistItem, PhoneOtp
(Unchanged from previous — see prior schema documentation.)

### Enums
`UserRole`: SUPER_ADMIN, ADMIN, SELLER, BUYER, SUPPORT
`ProductStatus`: DRAFT, PENDING, PUBLISHED, REJECTED
`OrderStatus`: PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED → COMPLETED (or CANCELLED/REFUNDED)
`PaymentStatus`: PENDING, PAID, FAILED, REFUNDED
`ReviewStatus`: PENDING, APPROVED, REJECTED

## 6. What's Done ✅
- Email/password auth (Supabase, signUp/signIn/signOut)
- **Email verification enforcement** — unverified accounts cannot log in; redirected to verify-email page
- **Forgot password / reset password flow** — Supabase email link → reset-password page
- **Resend verification email** — from verify-email page with rate limiting
- **Remember me** — extends session cookies to 30 days
- **DB-backed rate limiting** — `rate_limits` table (5 login/15min, 3 OTP/hr, 3 reset/hr)
- **Auth audit log** — every login/logout/register/reset/OTP event → `audit_logs` table
- **lib/navigation.ts** — single source of truth for getDashboardPath (no more 3 duplicate definitions)
- **lib/auth/guards.ts** — requireAuth(), requireRole(), getServerSession(), unauthorized(), forbidden()
- **SUPER_ADMIN role** — in DB enum and all RBAC checks
- **RBAC double-protection** — middleware + layout-level DB role check on buyer/seller/admin/support layouts
- **All server actions use requireAuth** — products, orders, cart, reviews use DB role (not user_metadata)
- **Middleware redirect param** — unauthorized access → `/login?redirect=[path]` for post-login redirect
- WhatsApp OTP auth flow (ultramsg.com → OTP → verify → set password)
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
- Admin order detail page with timeline, payment status, shipping info
- Bilingual AR/EN with i18n messages, RTL layout, Cairo font
- IQD currency formatting

## 7. What's In Progress 🚧
- **Payment gateway integration**: `services/payment.service.ts` and `actions/payments.ts` are TODO stubs.
- **Webhook signature verification**: `POST /api/webhooks/payment` has no HMAC check.

## 8. What's Missing ❌
- Real payment gateway connection (Stripe/Tap/Moyasar)
- Webhook signature verification (`PAYMENT_WEBHOOK_SECRET` defined but unused)
- Full-text product search (uses slow `contains` with `mode: "insensitive"`)
- Admin delete product functionality (blocked by CartItem/OrderItem Restrict cascade)
- Production-grade slug generation (uses `Math.random()`, no uniqueness check)
- Shipping cost configuration (hardcoded 25/50)
- Newsletter/contact form functionality (Footer has non-functional placeholder)
- OTP service still uses in-memory IP rate limiter (`lib/rate-limiter.ts` checkIpRateLimit) — should migrate to DB-backed

## 9. Known Issues 🔴
1. **Webhook stub**: `POST /api/webhooks/payment` has no signature verification.
2. **OTP service still uses in-memory IP rate limit**: `services/otp.service.ts` calls `checkIpRateLimit` from the old `lib/rate-limiter.ts`. The phone-level rate limit was migrated to DB via `otp.service.ts` internal logic, but the IP check still uses in-memory Map. Migrate `checkIpRateLimit` to call `checkRateLimit("ip:${ip}", "otp_send")` from `lib/auth/rate-limit.ts`.
3. **CartItem/OrderItem product foreign key**: No `onDelete` → defaults to `Restrict`. Seller cannot delete a product in any cart or order.
4. **OrderItem missing indexes**: No indexes on `orderId` or `productId`.
5. **Admin orders filter client-side**: `getOrdersByAdmin()` fetches ALL orders, then `.filter()`s in memory.
6. **5 dead components**: `AccountSummary`, `EmptyState`, `RecentOrdersTable`, `RecommendationsGrid`, `WishlistGrid` in `components/dashboard/` — never imported.
7. **6 empty `features/*/index.ts` files**: analytics, cart, inventory, orders, payments, products.
8. **Navbar.tsx 437 lines** — needs decomposition into sub-components.
9. **lib/rate-limiter.ts** still exists with the old in-memory Map — only kept because `otp.service.ts` imports `checkPhoneRateLimit` from it. Can be removed once OTP service is updated.
10. **Redirect after login not implemented in UI** — middleware sets `?redirect=` param but LoginForm doesn't read it to redirect after successful login.

## 10. Coding Standards
### Architecture Pattern
- **Server Components** (default) → fetch data directly, render static content
- **Client Components** (`"use client"`) → interactive UI, use `useState`/`useEffect`
- **Server Actions** (`"use server"`) → form submissions, mutations, called from client components
- **Services** → pure business logic, no React dependencies, imported only by actions
- **Data flow**: Page → Service (server component) OR Client Component → Server Action → Service → Prisma

### Auth Pattern (Phase 4+5)
Every Server Action must start with:
```ts
const session = await requireAuth(["BUYER"]); // specify allowed roles
// session.userId, session.role, session.email, session.fullName
```
Every layout must have:
```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect(`/${locale}/login`);
const dbUser = await db.user.findUnique({ where: { id: user.id }, select: { role: true } });
if (!dbUser || dbUser.role !== "EXPECTED_ROLE") redirect(`/${locale}/login`);
```

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
- Product schema: inline in `actions/products.ts`
- Order schema: inline in `actions/orders.ts`
- Checkout schemas: `features/checkout/schema.ts`
- Bilingual error messages with ` / ` separator (English / Arabic)

### i18n
- `useTranslations()` in client, `getTranslations()` in server
- `useLocale()` for locale-aware logic (RTL, date formats)

## 11. Absolute Rules

### Always Do
- Use `cn()` from `lib/utils.ts` for all class merging
- Validate inputs with Zod in Server Actions before hitting services
- Call `await requireAuth(["ROLE"])` at the top of every Server Action
- Verify role from DB (via `requireAuth` / `getServerSession`) — never from `user_metadata`
- Use `revalidatePath()` after mutations that affect cached data
- Handle ZodError, Prisma P2002 (unique constraint), and NEXT_REDIRECT in try/catch
- Use `formatPrice(Number(price), locale === "ar" ? "ar-IQ" : "en-IQ")` for all prices
- Use `import { Link } from "@/i18n/routing"` for all links (never `next/link`)
- Read `params` via `await params` / `await searchParams` (Next.js 16 async API)
- Set `@default(cuid())` for all model IDs (except User.id which maps to Supabase UUID)
- Log all auth events via `logAuditEvent()` in `lib/auth/audit.ts`
- Use `checkRateLimit()` from `lib/auth/rate-limit.ts` for all rate limiting (DB-backed)

### Never Do
- Expose `SUPABASE_SERVICE_ROLE_KEY`, `OTP_PEPPER`, `PAYMENT_SECRET_KEY`, `ULTRAMSG_TOKEN`, `PAYMENT_WEBHOOK_SECRET` to client (all server-only)
- Trust client-side price/total calculations for orders (always recalculate in `placeOrder`)
- Skip Zod validation in Server Actions (the only server-side security boundary)
- Use `getSession()` for auth checks — always use `getUser()` (gets fresh state from Supabase)
- Read role from `user_metadata` — always read from DB (user_metadata can be stale)
- Mix `next/link` with `@/i18n/routing` Link — use the i18n one everywhere
- Hardcode locale strings in server components that could use `getTranslations()`
- Write `cd /path && command` — use the `workdir` parameter instead
- Use in-memory rate limiting (lib/rate-limiter.ts) — use DB-backed lib/auth/rate-limit.ts

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
| `NEXT_PUBLIC_APP_URL` | ✅ Required | `actions/auth.ts` (password reset redirect URL) |
| `PAYMENT_SECRET_KEY` | ⚠️ Defined but unused | `services/payment.service.ts` (TODO) |
| `PAYMENT_WEBHOOK_SECRET` | ⚠️ Defined but unused | `app/api/webhooks/payment/route.ts` (TODO) |

## 13. Phase Progress
| # | Phase | Status |
|---|-------|--------|
| 1 | Architecture Audit | ✅ Complete (2026-06-17) |
| 2 | Route Verification | ✅ Complete (2026-06-17) |
| 3 | Navigation Integrity | ✅ Complete (2026-06-17) |
| 4 | Authentication System | ✅ Complete (2026-06-17) |
| 5 | Authorization (RBAC) | ✅ Complete (2026-06-17) |
| 6 | Payment Gateway Integration | ❌ Pending |
| 7 | Production Readiness | ❌ Pending |

## 14. Next Steps (Prioritized)
1. **Implement webhook signature verification** — `src/app/api/webhooks/payment/route.ts` must verify HMAC
2. **Connect payment gateway** — implement `payment.service.ts` + Stripe/Tap/Moyasar
3. **Migrate OTP IP rate limit** — replace `checkIpRateLimit` in `otp.service.ts` with `checkRateLimit("ip:${ip}", "otp_send")` from `lib/auth/rate-limit.ts`, then delete old `lib/rate-limiter.ts`
4. **Implement redirect-after-login** — LoginForm should read `?redirect=` searchParam and navigate there after successful login
5. **Fix CartItem/OrderItem `onDelete`** — decide cascade vs set-null, update `schema.prisma`, run migration
6. **Add missing Prisma indexes**: `OrderItem(orderId)`, `OrderItem(productId)`, `OrderEvent(actorId)`, `Review(buyerId)`, `Category(parentId)`, `Order(shippingAddressId)`
7. **Decompose `Navbar.tsx`** (437 lines → sub-components <200 lines each)
8. **Add server-side DB-level filtering to admin orders** — replace in-memory `.filter()`
9. **Remove dead components** — `AccountSummary`, `EmptyState`, `RecentOrdersTable`, `RecommendationsGrid`, `WishlistGrid`
10. **Remove empty feature stubs** — analytics, cart, inventory, orders, payments, products index.ts
11. **Make shipping costs configurable** — replace hardcoded 25/50
12. **Fix product slug generation** — replace `Math.random()` with deterministic slugify + uniqueness check

## Test Accounts (seeded)
| Email | Password | Role |
|-------|----------|------|
| admin@matjar.com | Admin123! | ADMIN |
| seller@matjar.com | Seller123! | SELLER |
| buyer@matjar.com | Buyer123! | BUYER |
| support@matjar.com | Support123! | SUPPORT |
