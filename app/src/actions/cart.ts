"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";

const addToCartSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1),
});

const updateCartItemSchema = z.object({
  cartItemId: z.string().cuid(),
  quantity: z.number().int().min(0),
});

export async function addToCart(_data: z.infer<typeof addToCartSchema>): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function updateCartItem(_data: z.infer<typeof updateCartItemSchema>): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function removeCartItem(_cartItemId: string): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function clearCart(): Promise<ActionResult> {
  return { success: true, data: undefined };
}

export async function syncCart(
  _guestItems: { productId: string; quantity: number }[]
): Promise<ActionResult> {
  return { success: true, data: undefined };
}
