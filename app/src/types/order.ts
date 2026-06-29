// ─── Order Types ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  /** Price snapshot at the time the item was added to cart */
  unitPrice: number;
  product: {
    titleAr: string;
    titleEn: string;
    sku: string;
    sellerId: string;
    images: { url: string }[];
  };
}

export interface Order {
  id: string;
  buyerId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string | null;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddressId: string;
  couponCode?: string | null;
  items: OrderItem[];
  events: OrderEvent[];
  shippingAddress: ShippingAddress;
  buyer: { fullName: string; email: string; phone?: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  actorId: string;
  note?: string;
  createdAt: Date;
}

export interface ShippingAddress {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  city: string;
  country: string;
  street: string;
  isDefault: boolean;
}
