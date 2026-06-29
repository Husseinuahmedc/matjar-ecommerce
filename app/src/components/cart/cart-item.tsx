"use client";

import React from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/base";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  id: string;
  titleAr: string;
  titleEn: string;
  price: number;
  quantity: number;
  image?: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isReadOnly?: boolean;
}

export function CartItem({
  id,
  titleAr,
  titleEn,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
  isReadOnly = false
}: CartItemProps) {
  const locale = useLocale();
  const title = locale === "ar" ? titleAr : titleEn;

  return (
    <div className="flex gap-4 py-4 border-b last:border-0 items-start">
      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {locale === "ar" ? "لا توجد صورة" : "No Image"}
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{title}</h4>
        <p className="text-sm font-semibold text-primary">
          {formatPrice(price, locale === "ar" ? "ar-IQ" : "en-IQ")}
        </p>

        {!isReadOnly && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => onUpdateQuantity(id, quantity + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onRemove(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        {isReadOnly && (
          <p className="text-sm text-muted-foreground mt-1">
            {locale === "ar" ? `الكمية: ${quantity}` : `Qty: ${quantity}`}
          </p>
        )}
      </div>
    </div>
  );
}
