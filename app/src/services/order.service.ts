import type { Order } from "@/types/order";
import type { OrderStatus } from "@prisma/client";

const mockOrders: Order[] = [
  {
    id: "mock-order-1",
    buyerId: "demo-user",
    status: "PENDING" as OrderStatus,
    paymentStatus: "PENDING" as any,
    paymentIntentId: null,
    subtotal: 125000,
    shippingCost: 25,
    discount: 0,
    total: 125025,
    couponCode: null,
    shippingAddressId: "mock-addr-1",
    createdAt: new Date("2026-06-20"),
    updatedAt: new Date("2026-06-20"),
    items: [],
    shippingAddress: {
      id: "mock-addr-1",
      userId: "demo-user",
      fullName: "Demo User",
      phone: "+964 7XX XXX 456",
      city: "Baghdad",
      country: "Iraq",
      street: "123 Main St",
      isDefault: true,
      createdAt: new Date(),
    },
    events: [],
    buyer: { fullName: "Demo User", email: "demo@example.com" },
  } as any,
  {
    id: "mock-order-2",
    buyerId: "demo-user",
    status: "DELIVERED" as OrderStatus,
    paymentStatus: "PAID" as any,
    paymentIntentId: null,
    subtotal: 89000,
    shippingCost: 25,
    discount: 0,
    total: 89025,
    couponCode: null,
    shippingAddressId: "mock-addr-1",
    createdAt: new Date("2026-06-15"),
    updatedAt: new Date("2026-06-18"),
    items: [],
    shippingAddress: {
      id: "mock-addr-1",
      userId: "demo-user",
      fullName: "Demo User",
      phone: "+964 7XX XXX 456",
      city: "Baghdad",
      country: "Iraq",
      street: "123 Main St",
      isDefault: true,
      createdAt: new Date(),
    },
    events: [],
    buyer: { fullName: "Demo User", email: "demo@example.com" },
  } as any,
];

export async function placeOrder(
  _cartId: string,
  _shippingAddressId: string,
  _buyerId: string,
  _shippingCost: number = 25,
  _couponCode?: string
): Promise<Order> {
  return mockOrders[0];
}

export async function getOrdersByBuyer(_buyerId: string) {
  return mockOrders;
}

export async function getOrdersBySeller(_sellerId: string) {
  return mockOrders;
}

export async function getOrdersByAdmin() {
  return mockOrders;
}

export async function getOrderById(_id: string, _userId?: string, _role?: string) {
  return mockOrders[0];
}

export async function updateOrderStatus(
  _orderId: string,
  _status: OrderStatus,
  _actorId: string,
  _note?: string
) {
  return {};
}

export function isValidStatusTransition(
  _current: Order["status"],
  _next: Order["status"]
): boolean {
  return true;
}
