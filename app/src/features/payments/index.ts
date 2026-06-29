/**
 * Payments feature module index.
 *
 * Feature folder structure (to be built):
 * features/payments/
 * ├── components/
 * │   └── PaymentForm.tsx       — Gateway-specific payment UI (Client Component)
 * └── types.ts
 *
 * Note: The actual gateway integration (Stripe / Tap / Moyasar) lives in:
 *   services/payment.service.ts  — server-side only
 *   app/api/webhooks/payment/route.ts  — webhook handler
 */

export {};
