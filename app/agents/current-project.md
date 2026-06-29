# Matjar (متجر) - Project Status

## Overview
A modern bilingual (Arabic/English) e-commerce platform tailored for the Iraqi market, featuring IQD currency and Supabase authentication.

## Project Status
- **Authentication**: ✅ Fully implemented using Supabase Auth with custom roles.
- **Product Catalog**: ✅ Browse products with bilingual support (AR/EN).
- **Shopping Cart**: ✅ Persistent cart using local storage and server-side sync.
- **Checkout**: ✅ Multi-step checkout process with shipping and payment selection.
- **Database Seeded**: ✅ Comprehensive seed script for reproducible testing.
- **IQD Currency**: ✅ Centralized formatting for Iraqi Dinar.
- **Bilingual AR/EN**: ✅ Full i18n support with `next-intl`.
- **Seller Dashboard**: ✅ Complete seller experience with sidebar, stats, revenue chart, inventory alerts, top products.
- **Seller Products**: ✅ Full product management with filters, bulk actions, status toggle, drag-drop image upload.
- **Seller Orders**: ✅ Order management with status tabs, seller-specific status updates (CONFIRMED → PROCESSING → SHIPPED).
- **Seller Order Detail**: ✅ Order detail view with timeline, buyer info, shipping address, status update.
- **Product Form**: ✅ Improved with language tabs, drag-drop images, SKU auto-gen, low stock threshold, save as draft.

## Active Feature
- **Payment Gateway Integration**: 🚧 (Next phase)

## Key Decisions
| Decision | Details |
|----------|---------|
| **Auth Seeding** | Seed uses `supabase.auth.admin.createUser()` to ensure real auth accounts exist in Supabase. |
| **Currency** | IQD (Iraqi Dinar) using `ar-IQ` locale with 0 decimal places. |
| **Product Images** | Sourced from `cdn.dummyjson.com` for realistic product photography. |
| **Price Formatting** | Centralized in `src/lib/utils.ts` via `formatPrice()`. |
| **Seller Layout** | Dedicated sidebar layout with responsive mobile support, same pattern as admin. |
| **Seller Status Updates** | Sellers can only transition: CONFIRMED → PROCESSING → SHIPPED (no DELIVERED/CANCELLED). |

## Test Accounts
| Email | Password | Role |
|-------|----------|------|
| `admin@matjar.com` | `Admin123!` | `ADMIN` |
| `seller@matjar.com` | `Seller123!` | `SELLER` |
| `buyer@matjar.com` | `Buyer123!` | `BUYER` |
| `support@matjar.com` | `Support123!` | `SUPPORT` |

## Routes
| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home Page | Public |
| `/login` | Authentication | Public |
| `/register` | User Registration | Public |
| `/products` | Product Listing | Public |
| `/products/[slug]` | Product Details | Public |
| `/cart` | Shopping Cart | Public |
| `/checkout` | Checkout Process | Buyer |
| `/orders` | Order History | Buyer |
| `/orders/[id]` | Order Details | Buyer |
| `/orders/confirmation` | Post-checkout Confirmation | Buyer |
| `/admin/dashboard` | Admin Overview | Admin |
| `/admin/products` | Global Product Management | Admin |
| `/admin/orders` | Global Order Management | Admin |
| `/admin/users` | User Management | Admin |
| `/seller/dashboard` | Seller Overview (stats, revenue chart, recent orders, inventory, top products) | Seller |
| `/seller/products` | Seller's Product List (filters, bulk actions, status toggle, search) | Seller |
| `/seller/products/new` | Add New Product (language tabs, drag-drop images, SKU auto-gen) | Seller |
| `/seller/products/[id]/edit` | Edit Product | Seller |
| `/seller/orders` | Seller's Orders (status tabs, seller status updates) | Seller |
| `/seller/orders/[id]` | Seller's Order Detail (timeline, buyer info, status update) | Seller |
| `/support/orders` | Support Ticket Management | Support |

## Architecture — Seller Dashboard

### Files Created/Modified
```
src/
├── actions/
│   ├── orders.ts              # + sellerUpdateOrderStatus (seller-specific transitions)
│   └── products.ts            # + submitForReview, toggleProductStatus, updateProductStock, bulkDeleteProducts
├── services/
│   ├── analytics.service.ts   # getSellerRevenue, getTopSellerProducts, getNewOrderCount
│   └── inventory.service.ts   # updateStock, decrementStock, restoreStock, checkLowStock
├── components/
│   └── seller/
│       ├── seller-sidebar.tsx              # Responsive sidebar for seller section
│       ├── seller-order-status-dropdown.tsx # Seller-specific status transitions
│       ├── seller-products-client.tsx       # Client-side products table with filters/bulk
│       ├── revenue-chart.tsx               # Recharts bar chart for 7-day revenue
│       ├── inventory-alerts.tsx            # Low stock products with inline stock update
│       └── top-products.tsx                # Top 5 best-selling products
├── app/[locale]/(seller)/seller/
│   ├── layout.tsx             # Seller layout with sidebar + Toaster
│   ├── error.tsx              # Error boundary for seller section
│   ├── dashboard/
│   │   ├── page.tsx           # Full dashboard: stats, chart, recent orders, inventory, top products
│   │   └── loading.tsx        # Skeleton loading state
│   ├── products/
│   │   ├── page.tsx           # Server component wrapping client-side table
│   │   └── loading.tsx        # Skeleton loading state
│   └── orders/
│       ├── page.tsx           # Orders with status tabs, seller status dropdown
│       ├── [id]/page.tsx      # Order detail with timeline, buyer info, status update
│       └── loading.tsx        # Skeleton loading state
├── components/products/
│   └── product-form.tsx       # Improved: language tabs, drag-drop, SKU auto-gen, low stock threshold
├── components/shared/
│   └── Navbar.tsx             # Updated: seller-specific nav links + orders badge
└── i18n/messages/
    ├── en.json                # + seller translations
    └── ar.json                # + seller translations
```

### Server/Client Boundary
- **Server Components**: Dashboard, Products page (data fetch), Orders page (data fetch), Order detail
- **Client Components**: Sidebar, RevenueChart, InventoryAlerts, SellerProductsClient, SellerOrderStatusDropdown, ProductForm

### Security
- All server actions verify SELLER role via Supabase `getUser()`
- All queries filter by `sellerId` — sellers can only see their own data
- Seller status transitions validated against allowed state machine
- Order detail checks `product.sellerId === userId` before returning data
- Product delete/update checks `sellerId` ownership

## Out of Scope (v1)
- Advanced Analytics Dashboard
- Native Mobile App (PWA only for now)
- Third-party Vendor API Integrations
