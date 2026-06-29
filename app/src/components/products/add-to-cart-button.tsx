"use client";

import React, { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/base";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  productData: {
    titleAr: string;
    titleEn: string;
    price: number;
    images: { url: string }[];
  };
}

export function AddToCartButton({ productId, stock, productData }: AddToCartButtonProps) {
  const { addItem, isPending } = useCart();
  const [added, setAdded] = useState(false);
  const locale = useLocale();

  const handleAdd = async () => {
    await addItem(productId, 1, productData);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button 
      size="lg" 
      className="flex-1 text-lg font-bold h-14" 
      disabled={stock <= 0 || isPending}
      onClick={handleAdd}
    >
      {isPending ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : added ? (
        <Check className="mr-2 h-5 w-5" />
      ) : (
        <ShoppingCart className="mr-2 h-5 w-5" />
      )}
      
      {stock <= 0 
        ? (locale === "ar" ? "نفد المخزون" : "Out of Stock")
        : added 
          ? (locale === "ar" ? "تمت الإضافة" : "Added")
          : (locale === "ar" ? "أضف إلى السلة" : "Add to Cart")
      }
    </Button>
  );
}
