import React from "react";
import { getProductById, getCategories } from "@/services/product.service";
import ProductForm from "@/components/products/product-form";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تعديل المنتج | Edit Product",
};

export default async function EditProductPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;

  const product = await getProductById(id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  const localeText = locale === "ar" ? "تعديل المنتج" : "Edit Product";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{localeText}</h1>
        <p className="text-muted-foreground">
          {locale === "ar" 
            ? "قم بتحديث بيانات المنتج أدناه." 
            : "Update the product details below."}
        </p>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
