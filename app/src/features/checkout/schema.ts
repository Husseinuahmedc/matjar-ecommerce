import { z } from "zod";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  street: z.string().min(5, "Street address is required"),
});

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export const shippingMethodSchema = z.object({
  method: z.enum(["STANDARD", "EXPRESS"]),
});

export type ShippingMethod = z.infer<typeof shippingMethodSchema>;

export const paymentMethodSchema = z.object({
  method: z.enum(["STRIPE", "TAP", "MOYASAR", "CASH_ON_DELIVERY"]),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
