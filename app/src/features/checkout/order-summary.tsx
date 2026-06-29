"use client";

import React, { useTransition } from "react";
import { ShippingAddress, ShippingMethod, PaymentMethod } from "./schema";
import { Button } from "@/components/ui/base";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, MapPin, Truck, CreditCard, ShoppingBag } from "lucide-react";
import { placeOrder } from "@/actions/orders";
import { useRouter } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  address: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  onBack: () => void;
}

export function OrderSummary({ address, shippingMethod, paymentMethod, subtotal, onBack }: OrderSummaryProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const shippingPrice = shippingMethod.method === "EXPRESS" ? 15000 : 5000;
  const total = subtotal + shippingPrice;

  const handlePlaceOrder = () => {
    startTransition(async () => {
      const result = await placeOrder({
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          city: address.city,
          country: address.country,
          street: address.street,
        },
        shippingMethod: shippingMethod.method,
        paymentMethod: paymentMethod.method,
      });

      if (result.success) {
        router.push("/orders/confirmation");
      } else {
        alert(result.error);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Address Review */}
        <div className="space-y-3">
          <h4 className="font-bold flex items-center gap-2 text-primary">
            <MapPin className="h-4 w-4" />
            {locale === "ar" ? "عنوان الشحن" : "Shipping Address"}
          </h4>
          <div className="p-4 rounded-lg bg-muted/30 border text-sm space-y-1">
            <p className="font-bold">{address.fullName}</p>
            <p>{address.phone}</p>
            <p>{address.street}</p>
            <p>{address.city}, {address.country}</p>
          </div>
        </div>

        {/* Shipping & Payment Review */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-bold flex items-center gap-2 text-primary">
              <Truck className="h-4 w-4" />
              {locale === "ar" ? "طريقة الشحن" : "Shipping Method"}
            </h4>
            <div className="p-4 rounded-lg bg-muted/30 border text-sm">
              <p className="font-bold">{shippingMethod.method === "EXPRESS" ? (locale === "ar" ? "شحن سريع" : "Express Shipping") : (locale === "ar" ? "شحن قياسي" : "Standard Shipping")}</p>
              <p className="text-muted-foreground">{formatPrice(shippingPrice, locale === "ar" ? "ar-IQ" : "en-IQ")}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold flex items-center gap-2 text-primary">
              <CreditCard className="h-4 w-4" />
              {locale === "ar" ? "طريقة الدفع" : "Payment Method"}
            </h4>
            <div className="p-4 rounded-lg bg-muted/30 border text-sm">
              <p className="font-bold">{paymentMethod.method}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Totals */}
      <div className="pt-6 border-t space-y-4">
        <div className="space-y-2 max-w-sm ms-auto">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
            <span>{formatPrice(subtotal, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{locale === "ar" ? "رسوم الشحن" : "Shipping"}</span>
            <span>{formatPrice(shippingPrice, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
          </div>
          <div className="flex justify-between font-bold text-xl pt-4 border-t mt-4">
            <span>{locale === "ar" ? "الإجمالي النهائي" : "Grand Total"}</span>
            <span className="text-primary">{formatPrice(total, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isPending} className="flex items-center gap-2">
          {locale === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {locale === "ar" ? "العودة" : "Back"}
        </Button>
        <Button 
          type="button" 
          size="lg" 
          className="flex-1 md:flex-none md:min-w-[250px] gap-2"
          onClick={handlePlaceOrder}
          disabled={isPending}
        >
          {isPending ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <ShoppingBag className="h-5 w-5" />
          )}
          {locale === "ar" ? "إتمام الطلب" : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
