"use client";

import React, { useEffect } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "next-intl";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/base";
import { CartItem } from "./cart-item";
import { Link } from "@/i18n/routing";
import { cn, formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const locale = useLocale();

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "relative w-full max-w-md bg-background h-full shadow-xl flex flex-col transition-transform duration-300 ease-in-out",
          locale === "ar" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {locale === "ar" ? "سلة التسوق" : "Shopping Cart"}
            <span className="text-sm font-normal text-muted-foreground">({itemCount})</span>
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">
                {locale === "ar" ? "سلتك فارغة حالياً" : "Your cart is currently empty"}
              </p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/products">
                  {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  titleAr={item.product.titleAr}
                  titleEn={item.product.titleEn}
                  price={item.unitPrice}
                  quantity={item.quantity}
                  image={item.product.images[0]?.url}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-muted/30 space-y-4">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <span>
                {formatPrice(subtotal, locale === "ar" ? "ar-IQ" : "en-IQ")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {locale === "ar" 
                ? "الضرائب وتكاليف الشحن تحسب عند الدفع" 
                : "Shipping and taxes calculated at checkout"}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                <Link href="/cart">
                  {locale === "ar" ? "عرض السلة" : "View Cart"}
                </Link>
              </Button>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/checkout">
                  {locale === "ar" ? "إتمام الشراء" : "Checkout"}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
