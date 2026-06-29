"use client";

import React from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "next-intl";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/base";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { Link } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default function CartPage() {
  const { items, subtotal, itemCount, updateQuantity, removeItem } = useCart();
  const locale = useLocale();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/products" className="flex items-center gap-2">
            {locale === "ar" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <ShoppingBag className="h-8 w-8" />
        {locale === "ar" ? "سلة التسوق" : "Shopping Cart"}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
          <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground opacity-20 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {locale === "ar" 
              ? "يبدو أنك لم تضف أي منتجات إلى سلتك بعد." 
              : "Looks like you haven't added any products to your cart yet."}
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              {locale === "ar" ? "ابدأ التسوق" : "Start Shopping"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border shadow-sm divide-y">
              {items.map((item) => (
                <div key={item.id} className="px-6">
                  <CartItem
                    id={item.id}
                    titleAr={item.product.titleAr}
                    titleEn={item.product.titleEn}
                    price={item.unitPrice}
                    quantity={item.quantity}
                    image={item.product.images[0]?.url}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
              <p>
                {locale === "ar" 
                  ? `لديك ${itemCount} عناصر في سلتك` 
                  : `You have ${itemCount} items in your cart`}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <CartSummary 
              subtotal={subtotal} 
              itemCount={itemCount} 
              checkoutPath="/checkout" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
