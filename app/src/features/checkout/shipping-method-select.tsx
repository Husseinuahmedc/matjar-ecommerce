"use client";

import React, { useState } from "react";
import { ShippingMethod } from "./schema";
import { Button } from "@/components/ui/base";
import { useLocale } from "next-intl";
import { Truck, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ShippingMethodSelectProps {
  initialData: ShippingMethod | null;
  onSubmit: (data: ShippingMethod) => void;
  onBack: () => void;
}

export function ShippingMethodSelect({ initialData, onSubmit, onBack }: ShippingMethodSelectProps) {
  const locale = useLocale();
  const [selected, setSelected] = useState<string | null>(initialData?.method || null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      setError(locale === "ar" ? "يرجى اختيار طريقة الشحن" : "Please select a shipping method");
      return;
    }
    onSubmit({ method: selected as ShippingMethod["method"] });
  };

  const methods = [
    {
      id: "STANDARD",
      label: locale === "ar" ? "شحن قياسي" : "Standard Shipping",
      description: locale === "ar" ? "من 3 إلى 5 أيام عمل" : "3-5 business days",
      price: 5000,
      icon: Truck,
    },
    {
      id: "EXPRESS",
      label: locale === "ar" ? "شحن سريع" : "Express Shipping",
      description: locale === "ar" ? "من 1 إلى 2 أيام عمل" : "1-2 business days",
      price: 15000,
      icon: Zap,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
              className={`relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-border-hover hover:bg-muted/50"
              }`}
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className={`font-bold ${isActive ? "text-primary" : ""}`}>{m.label}</p>
                <p className="text-sm text-muted-foreground">{m.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(m.price, locale === "ar" ? "ar-IQ" : "en-IQ")}</p>
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
          {locale === "ar" ? "المتابعة للدفع" : "Continue to Payment"}
        </Button>
      </div>
    </form>
  );
}
