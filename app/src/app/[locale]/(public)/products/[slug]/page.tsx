import React from "react";
import { ProductImage } from "@/components/products/product-image";
import { getProductBySlug } from "@/services/product.service";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تفاصيل المنتج | Product Details",
  description: "عرض تفاصيل المنتج | View product details",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  const t = await getTranslations("products");

  if (!product) {
    notFound();
  }

  const title = locale === "ar" ? product.titleAr : product.titleEn;
  const description = locale === "ar" ? product.descriptionAr : product.descriptionEn;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border/50">
            <ProductImage src={product.images?.[0]?.url} alt={title} fill className="object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img: { url: string }, idx: number) => (
              <div key={idx} className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border/30 cursor-pointer hover:border-primary transition-colors">
                <ProductImage src={img.url} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-primary">
              {locale === "ar" ? product.category.nameAr : product.category.nameEn}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(Number(product.price), locale === "ar" ? "ar-IQ" : "en-IQ")}
              </div>
              {product.discountPrice && (
                <div className="text-lg text-muted-foreground line-through">
                  {formatPrice(Number(product.discountPrice), locale === "ar" ? "ar-IQ" : "en-IQ")}
                </div>
              )}
            </div>
          </div>

          <div className="border-y py-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
              {locale === "ar" ? "الوصف" : "Description"}
            </h3>
            <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed">
              {description}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-destructive"}`} />
              <span className="text-sm font-medium">
                {product.stock > 0 ? t("inStock") : t("outOfStock")}
                {product.stock > 0 && product.stock <= 5 && ` (${product.stock} ${locale === "ar" ? "قطع متبقية" : "left"})`}
              </span>
            </div>

            <div className="flex gap-4">
              <AddToCartButton 
                productId={product.id} 
                stock={product.stock}
                productData={{
                  titleAr: product.titleAr,
                  titleEn: product.titleEn,
                  price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
                  images: product.images.map((img: { url: string }) => ({ url: img.url }))
                }}
              />
            </div>
          </div>

          <div className="pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              {locale === "ar" ? "البائع:" : "Seller:"} <span className="font-bold text-foreground">{product.seller.fullName}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {locale === "ar" ? "رمز المنتج:" : "SKU:"} <span className="font-mono">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
