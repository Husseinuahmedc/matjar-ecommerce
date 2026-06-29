"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";

/**
 * Payment Server Actions
 *
 * Security rules:
 * - Payment intent is ALWAYS created server-side — never client-side
 * - The client receives only a client secret (needed for the payment UI)
 * - Actual payment verification happens via webhook, not from the client
 */

const createPaymentIntentSchema = z.object({
  orderId: z.string().cuid("Invalid order ID"),
});

export async function createPaymentIntent(
  data: z.infer<typeof createPaymentIntentSchema>
): Promise<ActionResult<{ clientSecret: string }>> {
  try {
    createPaymentIntentSchema.parse(data);

    // TODO: Verify buyer auth + order ownership server-side
    // TODO: const intent = await paymentService.createIntent(validated.orderId);
    // TODO: return { success: true, data: { clientSecret: intent.client_secret } };

    return { success: true, data: { clientSecret: "placeholder_client_secret" } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        issues: error.issues.map((i) => i.message),
      };
    }
    console.error("[createPaymentIntent]", error);
    return { success: false, error: "Something went wrong" };
  }
}
