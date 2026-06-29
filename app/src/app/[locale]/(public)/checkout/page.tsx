import { CheckoutStepper } from "@/features/checkout/checkout-stepper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الشراء | Checkout",
  description: "أكمل خطوات الشحن والدفع لإتمام طلبك | Complete your shipping and payment details",
};

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="container mx-auto px-4 py-12 max-w-7xl min-h-[80vh]">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
          {locale === "ar" ? "إتمام الشراء" : "Checkout"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "ar" 
            ? "يرجى إكمال خطوات الشحن والدفع لإتمام طلبك." 
            : "Please complete your shipping and payment details to place your order."}
        </p>
      </div>

      <CheckoutStepper />
    </main>
  );
}
