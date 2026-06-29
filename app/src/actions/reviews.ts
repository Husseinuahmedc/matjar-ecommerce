"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  orderId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().optional(),
});

export async function createReview(_data: z.infer<typeof createReviewSchema>): Promise<ActionResult> {
  return { success: true, data: undefined };
}
