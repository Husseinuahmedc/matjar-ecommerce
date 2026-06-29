import React from "react";
import { getCategories } from "@/services/product.service";
import ProductForm from "@/components/products/product-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إضافة منتج جديد | Add New Product",
};

export default async function NewProductPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const categories = await getCategories();
  const localeText = locale === "ar" ? "إضافة منتج جديد" : "Add New Product";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{localeText}</h1>
        <p className="text-muted-foreground">
          {locale === "ar" 
            ? "املأ النموذج أدناه لإضافة منتج جديد إلى متجرك." 
            : "Fill out the form below to add a new product to your store."}
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
