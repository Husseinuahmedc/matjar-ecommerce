"use client";

import React, { useState } from "react";
import { PaymentMethod } from "./schema";
import { Button } from "@/components/ui/base";
import { useLocale } from "next-intl";
import { CreditCard, Wallet, Banknote, ChevronLeft, ChevronRight } from "lucide-react";

interface PaymentMethodSelectProps {
  initialData: PaymentMethod | null;
  onSubmit: (data: PaymentMethod) => void;
  onBack: () => void;
}

export function PaymentMethodSelect({ initialData, onSubmit, onBack }: PaymentMethodSelectProps) {
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(initialData?.method || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError(locale === "ar" ? "يرجى اختيار طريقة الدفع" : "Please select a payment method");
      return;
    }
    onSubmit({ method: selected as PaymentMethod["method"] });
  };

  const methods = [
    {
      id: "STRIPE",
      label: "Stripe",
      description: locale === "ar" ? "الدفع عبر بطاقة الائتمان" : "Pay with credit card",
      icon: CreditCard,
    },
    {
      id: "TAP",
      label: "Tap Payments",
      description: locale === "ar" ? "دفع آمن وسريع" : "Secure and fast payment",
      icon: Wallet,
    },
    {
      id: "MOYASAR",
      label: "Moyasar",
      description: locale === "ar" ? "دعم مدى والبطاقات المحلية" : "Supports Mada and local cards",
      icon: CreditCard,
    },
    {
      id: "CASH_ON_DELIVERY",
      label: locale === "ar" ? "الدفع عند الاستلام" : "Cash on Delivery",
      description: locale === "ar" ? "ادفع نقداً عند وصول طلبك" : "Pay cash when your order arrives",
      icon: Banknote,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => {
          const Icon = m.icon;
          const isActive = selected === m.id;
          return (
            <div
              key={m.id}
              onClick={() => {
                setSelected(m.id);
                setError(null);
              }}
              className={`relative flex flex-col gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-border-hover hover:bg-muted/50"
              }`}
            >
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className={`font-bold ${isActive ? "text-primary" : ""}`}>{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.description}</p>
              </div>
              {isActive && (
                <div className="absolute top-2 end-2">
                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="pt-6 border-t flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex items-center gap-2">
          {locale === "ar" ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {locale === "ar" ? "العودة" : "Back"}
        </Button>
        <Button type="submit" size="lg" className="flex-1 md:flex-none md:min-w-[200px]">
          {locale === "ar" ? "مراجعة الطلب" : "Review Order"}
        </Button>
      </div>
    </form>
  );
}
