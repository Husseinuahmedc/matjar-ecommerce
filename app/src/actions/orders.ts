"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";
import type { Order } from "@/types/order";
import type { OrderStatus } from "@prisma/client";

const placeOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    street: z.string().min(5),
  }),
  shippingMethod: z.enum(["STANDARD", "EXPRESS"]),
  paymentMethod: z.string(),
  couponCode: z.string().optional(),
});

type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

const mockOrder: Order = {
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
  createdAt: new Date(),
  updatedAt: new Date(),
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
} as any;

export async function placeOrder(_data: PlaceOrderInput): Promise<ActionResult<Order>> {
  return { success: true, data: mockOrder };
}

export async function updateOrderStatus(
  _orderId: string,
  _status: OrderStatus
): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function sellerUpdateOrderStatus(
  _orderId: string,
  _status: OrderStatus
): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function cancelOrder(_formData: FormData): Promise<ActionResult> {
  return { success: true, data: undefined };
}
