"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useCart } from "@/hooks/use-cart";
import { ShippingAddressForm } from "./shipping-address-form";
import { ShippingMethodSelect } from "./shipping-method-select";
import { PaymentMethodSelect } from "./payment-method-select";
import { OrderSummary } from "./order-summary";
import { ShippingAddress, ShippingMethod, PaymentMethod } from "./schema";
import { Check, CreditCard, Truck, MapPin, Receipt, type LucideIcon } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type CheckoutStep = "ADDRESS" | "SHIPPING" | "PAYMENT" | "SUMMARY";

export function CheckoutStepper() {
  const locale = useLocale();
  const { items, subtotal } = useCart();
  
  const [step, setStep] = useState<CheckoutStep>("ADDRESS");
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

  const steps: { key: CheckoutStep; label: string; icon: LucideIcon }[] = [
    { key: "ADDRESS", label: locale === "ar" ? "العنوان" : "Address", icon: MapPin },
    { key: "SHIPPING", label: locale === "ar" ? "الشحن" : "Shipping", icon: Truck },
    { key: "PAYMENT", label: locale === "ar" ? "الدفع" : "Payment", icon: CreditCard },
    { key: "SUMMARY", label: locale === "ar" ? "الملخص" : "Summary", icon: Receipt },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleAddressSubmit = (data: ShippingAddress) => {
    setAddress(data);
    setStep("SHIPPING");
  };

  const handleShippingSubmit = (data: ShippingMethod) => {
    setShippingMethod(data);
    setStep("PAYMENT");
  };

  const handlePaymentSubmit = (data: PaymentMethod) => {
    setPaymentMethod(data);
    setStep("SUMMARY");
  };

  const handleBack = () => {
    if (step === "SHIPPING") setStep("ADDRESS");
    if (step === "PAYMENT") setStep("SHIPPING");
    if (step === "SUMMARY") setStep("PAYMENT");
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p>{locale === "ar" ? "سلتك فارغة حالياً" : "Your cart is empty"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        {/* Progress Header */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-[600px] px-2">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : isActive
                          ? "border-primary text-primary bg-background"
                          : "border-muted text-muted-foreground bg-background"
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${
                        idx < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-xl border shadow-sm p-6 md:p-8">
          {step === "ADDRESS" && (
            <ShippingAddressForm 
              initialData={address} 
              onSubmit={handleAddressSubmit} 
            />
          )}
          {step === "SHIPPING" && (
            <ShippingMethodSelect
              initialData={shippingMethod}
              onSubmit={handleShippingSubmit}
              onBack={handleBack}
            />
          )}
          {step === "PAYMENT" && (
            <PaymentMethodSelect
              initialData={paymentMethod}
              onSubmit={handlePaymentSubmit}
              onBack={handleBack}
            />
          )}
          {step === "SUMMARY" && (
            <OrderSummary
              address={address!}
              shippingMethod={shippingMethod!}
              paymentMethod={paymentMethod!}
              subtotal={subtotal}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      <div className="lg:col-span-4">
        {/* Mini Cart Summary always visible on desktop */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              {locale === "ar" ? "ملخص السلة" : "Order Review"}
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {item.product.images[0]?.url && (
                      <Image src={item.product.images[0].url} alt="" fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">
                      {locale === "ar" ? item.product.titleAr : item.product.titleEn}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.quantity} x {formatPrice(item.unitPrice, locale === "ar" ? "ar-IQ" : "en-IQ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>{formatPrice(subtotal, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">{formatPrice(subtotal, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                * {locale === "ar" ? "سيتم احتساب الشحن في الخطوة التالية" : "Shipping will be calculated in the next step"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
