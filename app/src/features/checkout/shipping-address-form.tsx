"use client";

import React, { useState } from "react";
import { shippingAddressSchema, ShippingAddress } from "./schema";
import { Button, Input, Label } from "@/components/ui/base";
import { useLocale } from "next-intl";

interface ShippingAddressFormProps {
  initialData: ShippingAddress | null;
  onSubmit: (data: ShippingAddress) => void;
}

export function ShippingAddressForm({ initialData, onSubmit }: ShippingAddressFormProps) {
  const locale = useLocale();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get("fullName") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
      street: formData.get("street") as string,
    };

    const result = shippingAddressSchema.safeParse(data);
    if (result.success) {
      setErrors({});
      onSubmit(result.data);
    } else {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") {
          newErrors[path] = issue.message;
        }
      });
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">{locale === "ar" ? "الاسم الكامل" : "Full Name"}</Label>
          <Input id="fullName" name="fullName" defaultValue={initialData?.fullName} placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{locale === "ar" ? "رقم الجوال" : "Phone Number"}</Label>
          <Input id="phone" name="phone" defaultValue={initialData?.phone} placeholder="05XXXXXXXX" />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">{locale === "ar" ? "الدولة" : "Country"}</Label>
          <Input id="country" name="country" defaultValue={initialData?.country} placeholder={locale === "ar" ? "السعودية" : "Saudi Arabia"} />
          {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">{locale === "ar" ? "المدينة" : "City"}</Label>
          <Input id="city" name="city" defaultValue={initialData?.city} placeholder={locale === "ar" ? "الرياض" : "Riyadh"} />
          {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="street">{locale === "ar" ? "العنوان بالتفصيل" : "Street Address"}</Label>
          <Input id="street" name="street" defaultValue={initialData?.street} placeholder={locale === "ar" ? "اسم الشارع، رقم المبنى" : "Street name, building number"} />
          {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
        </div>
      </div>

      <div className="pt-6 border-t flex justify-end">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          {locale === "ar" ? "المتابعة للشحن" : "Continue to Shipping"}
        </Button>
      </div>
    </form>
  );
}
