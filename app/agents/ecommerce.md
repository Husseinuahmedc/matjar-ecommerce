# E-commerce Roadmap & Features

## Core Features Status

### 1. User Authentication ✅
- [x] Login and Registration
- [x] Role-based Access Control (Buyer, Seller, Admin, Support)
- [x] Supabase Auth integration
- [x] Protected routes middleware

### 2. Product Management ✅
- [x] Product listing and details
- [x] Category filtering
- [x] Seller dashboard for product management
- [x] Image handling (using CDN)
- [x] Bilingual support (AR/EN)

### 3. Shopping Cart ✅
- [x] Add/Remove items
- [x] Quantity updates
- [x] Local storage persistence
- [x] Real-time subtotal calculation

### 4. Checkout & Orders ✅
- [x] Multi-step checkout
- [x] Shipping address management
- [x] Order history for buyers
- [x] Order status tracking for sellers/admins

### 5. Payments 🚧
- [ ] Real-world Payment Gateway integration
- [ ] Payment status webhooks
- [x] **Current State**: Payment methods are scaffolded (Stripe, Tap, Moyasar, Cash on Delivery). Logic is in place for selection, but real gateway APIs are not yet integrated.

## Current Active Feature
- **Payment Gateway Integration**: Focus on connecting the scaffolded payment methods to real providers and handling transaction callbacks.

## Technical Notes
- **Currency**: All transactions are processed in IQD.
- **Localization**: UI and data support both Arabic (RTL) and English (LTR).
- **Backend**: Next.js Server Actions with Prisma ORM and Supabase Database.
