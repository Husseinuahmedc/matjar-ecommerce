"use client";

import React from "react";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/base";
import { Link } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  checkoutPath: string;
}

export function CartSummary({ subtotal, itemCount, checkoutPath }: CartSummaryProps) {
  const locale = useLocale();

  const formattedSubtotal = formatPrice(subtotal, locale === "ar" ? "ar-IQ" : "en-IQ");

  return (
    <div className="bg-muted/50 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">
          {locale === "ar" ? `العناصر (${itemCount})` : `Items (${itemCount})`}
        </span>
        <span>{formattedSubtotal}</span>
      </div>
      
      <div className="flex justify-between items-center font-bold text-lg border-t pt-4">
        <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
        <span>{formattedSubtotal}</span>
      </div>

      <p className="text-xs text-muted-foreground">
        {locale === "ar" 
          ? "الضرائب وتكاليف الشحن تحسب عند الدفع" 
          : "Shipping and taxes calculated at checkout"}
      </p>

      <Button asChild className="w-full py-6 text-lg font-bold" size="lg">
        <Link href={checkoutPath}>
          {locale === "ar" ? "إتمام الشراء" : "Proceed to Checkout"}
        </Link>
      </Button>
    </div>
  );
}
