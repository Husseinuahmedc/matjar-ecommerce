# Seller Dashboard Architecture

## Purpose
Provides sellers with a complete management experience for their products, orders, and store performance. Sellers can only see and manage their own data — never other sellers' products or revenue.

---

## Folder Structure

```
src/
├── actions/
│   ├── orders.ts                          # + sellerUpdateOrderStatus
│   └── products.ts                        # + submitForReview, toggleProductStatus,
│                                          #   updateProductStock, bulkDeleteProducts
├── services/
│   ├── analytics.service.ts               # getSellerRevenue, getTopSellerProducts,
│   │                                      #   getNewOrderCount
│   ├── inventory.service.ts               # updateStock, decrementStock, restoreStock,
│   │                                      #   checkLowStock
│   └── order.service.ts                   # getOrdersBySeller (existing)
├── components/
│   └── seller/
│       ├── seller-sidebar.tsx             # Responsive sidebar navigation
│       ├── seller-order-status-dropdown.tsx # Status transitions (CONFIRMED→PROCESSING→SHIPPED)
│       ├── seller-products-client.tsx     # Client-side products table with filters/bulk
│       ├── revenue-chart.tsx              # Recharts bar chart (7-day revenue)
│       ├── inventory-alerts.tsx           # Low stock products with inline stock update
│       └── top-products.tsx               # Top 5 best-selling products
├── app/[locale]/(seller)/seller/
│   ├── layout.tsx                         # Sidebar layout + Toaster
│   ├── error.tsx                          # Error boundary
│   ├── dashboard/
│   │   ├── page.tsx                       # Stats, chart, recent orders, inventory, top products
│   │   └── loading.tsx                    # Skeleton loading
│   ├── products/
│   │   ├── page.tsx                       # Server → client products table
│   │   └── loading.tsx                    # Skeleton loading
│   └── orders/
│       ├── page.tsx                       # Orders with status tabs
│       ├── [id]/page.tsx                  # Order detail with timeline
│       └── loading.tsx                    # Skeleton loading
└── components/products/
    └── product-form.tsx                   # Improved with language tabs, drag-drop,
                                           #   SKU auto-gen, low stock threshold
```

---

## Data Flow

### Dashboard Stats
```
SellerDashboardPage (Server Component)
  → getOrdersBySeller(sellerId)         → order service → Prisma → PostgreSQL
  → getProducts({ sellerId })           → product service → Prisma → PostgreSQL
  → getSellerRevenue(sellerId, 7)       → analytics service → Prisma → PostgreSQL
  → getTopSellerProducts(sellerId, 5)   → analytics service → Prisma → PostgreSQL
  → Calculate totalRevenue from seller's own items only
  → Render: stats row, RevenueChart, RecentOrders, InventoryAlerts, TopProducts
```

### Product Management
```
SellerProductsPage (Server Component)
  → getProducts({ sellerId, status: [...] })
  → Pass products to SellerProductsClient (Client Component)
  → Client handles: filtering, search, bulk select, status toggle, delete

Actions (all verified SELLER role):
  → createProduct       → productService.createProduct → Prisma
  → updateProduct       → productService.updateProduct → Prisma (sellerId check)
  → deleteProduct       → productService.deleteProduct → Prisma (sellerId check)
  → submitForReview     → productService.updateProductStatus → DRAFT/REJECTED → PENDING
  → toggleProductStatus → productService.updateProductStatus → DRAFT ↔ PENDING
  → updateProductStock  → inventoryService.updateStock → Prisma
  → bulkDeleteProducts  → loop productService.deleteProduct → Prisma
```

### Order Management
```
SellerOrdersPage (Server Component)
  → getOrdersBySeller(sellerId) → filters by product.sellerId
  → Renders with status tabs (ALL / CONFIRMED / PROCESSING / SHIPPED / DELIVERED)
  → SellerOrderStatusDropdown (Client Component)
    → sellerUpdateOrderStatus(orderId, newStatus)
      → Validates: order contains seller's products
      → Validates: transition is allowed (CONFIRMED→PROCESSING, PROCESSING→SHIPPED)
      → orderService.updateOrderStatus → Prisma transaction
      → Creates OrderEvent audit log
```

### Order Detail
```
SellerOrderDetailPage (Server Component)
  → getOrderById(id, userId, "SELLER")
    → Verifies order contains seller's products
    → Filters items to only seller's items
  → Renders: header, items table, timeline, buyer info, shipping, status update
```

### Product Form
```
ProductForm (Client Component)
  → Language tabs: Arabic | English
  → Each tab shows title + description fields (both required for submit)
  → Pricing section: price (IQD, no decimals), discount price, stock, low stock threshold
  → SKU field: auto-generates SKU-XXXXXX on blur if empty
  → Image upload: drag-drop zone, preview grid, reorder (up/down), delete, max 5
    → Uploads to Supabase Storage → saves URL to ProductImage table
  → Actions: Save as Draft (DRAFT), Submit for Review (PENDING), Update Product
```

---

## Server/Client Boundary

| Component | Type | Reason |
|-----------|------|--------|
| Dashboard page | Server | Data fetching, auth check |
| Products page | Server → Client | Server fetches data, client handles interactions |
| Orders page | Server | Data fetching, auth check |
| Order detail | Server | Data fetching, auth check |
| SellerSidebar | Client | Interactive navigation, mobile menu |
| RevenueChart | Client | Recharts requires browser APIs |
| InventoryAlerts | Client | Inline stock editing, toast feedback |
| SellerProductsClient | Client | Filters, bulk actions, delete, status toggle |
| SellerOrderStatusDropdown | Client | Status update with loading/toast |
| ProductForm | Client | Form state, drag-drop, image upload |
| TopProducts | Server | Pure display, no interaction |

---

## Database Interactions

### Queries
- `getOrdersBySeller`: Orders where `items.some.product.sellerId === sellerId` — only returns seller's items
- `getProducts`: Products where `sellerId === userId` — all statuses for seller view
- `getOrderById`: With role check — seller sees only orders containing their products
- `getSellerRevenue`: Aggregates revenue from seller's order items over last N days
- `getTopSellerProducts`: Groups order items by product, sums revenue, ordered by revenue desc

### Mutations
- `updateProductStock`: Updates `product.stock` where `sellerId` matches
- `submitForReview`: Updates `product.status` to PENDING (only DRAFT/REJECTED allowed)
- `sellerUpdateOrderStatus`: Updates `order.status` + creates `OrderEvent` audit log
- `deleteProduct`: Cascades to ProductImage, CartItem, WishlistItem, etc.

---

## Security Considerations

1. **Seller ID Filtering**: Every query filters by `sellerId` — sellers never see other sellers' data
2. **Role Verification**: All server actions verify `user.user_metadata?.role === "SELLER"` via Supabase `getUser()`
3. **Ownership Checks**: Product mutations verify `product.sellerId === user.id`
4. **Order Access**: `getOrderById` with role "SELLER" filters items to only seller's products
5. **Status Transition Validation**: `sellerUpdateOrderStatus` validates against allowed transitions:
   - CONFIRMED → PROCESSING
   - PROCESSING → SHIPPED
   - Cannot set DELIVERED, CANCELLED, or any other status
6. **Supabase RLS**: Database-level safety net via Row Level Security policies

---

## Future Improvements

- **Real-time Updates**: WebSocket integration for live order status changes
- **Advanced Analytics**: Revenue trends, conversion rates, product performance over time
- **Earnings/Payouts**: Financial dashboard with withdrawal history
- **Product Tags**: Multi-select tags in product form
- **Bulk Actions**: Bulk status change (not just delete)
- **Export**: CSV/PDF export for orders and products
