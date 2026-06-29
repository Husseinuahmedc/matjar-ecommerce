"use client";

import React, { useState, useTransition, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Button, Input, Textarea, Label, Select } from "@/components/ui";
import { createProduct, updateProduct } from "@/actions/products";
import { toast } from "sonner";
import { Upload, X, ArrowUp, ArrowDown } from "lucide-react";
import type { Category } from "@/types/product";
import type { ProductFormInitialData } from "@/services/product.service";

interface ProductFormProps {
  initialData?: ProductFormInitialData;
  categories: Category[];
}

const MAX_IMAGES = 5;

function generateSKU(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "SKU-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

type LanguageTab = "ar" | "en";

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const common = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<LanguageTab>("ar");
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    titleAr: initialData?.titleAr || "",
    titleEn: initialData?.titleEn || "",
    descriptionAr: initialData?.descriptionAr || "",
    descriptionEn: initialData?.descriptionEn || "",
    price: initialData?.price ? Number(initialData.price) : 0,
    discountPrice: initialData?.discountPrice ? Number(initialData.discountPrice) : null,
    stock: initialData?.stock || 0,
    lowStockThreshold: initialData?.lowStockThreshold || 5,
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    images: initialData?.images?.map((img) => img.url) || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSKUBlur = () => {
    if (!formData.sku) {
      setFormData((prev) => ({ ...prev, sku: generateSKU() }));
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    // Mock upload — return a placeholder URL
    return `/placeholder.svg`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (remainingSlots <= 0) {
      toast.error(locale === "ar" ? `الحد الأقصى ${MAX_IMAGES} صور` : `Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast.success(
        locale === "ar"
          ? `تم رفع ${uploadedUrls.length} صورة`
          : `${uploadedUrls.length} image(s) uploaded`
      );
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );

    if (files.length === 0) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (remainingSlots <= 0) {
      toast.error(locale === "ar" ? `الحد الأقصى ${MAX_IMAGES} صور` : `Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    if (uploadedUrls.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
      toast.success(
        locale === "ar"
          ? `تم رفع ${uploadedUrls.length} صورة`
          : `${uploadedUrls.length} image(s) uploaded`
      );
    }
  }, [formData.images.length, locale]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.images.length) return;

    const newImages = [...formData.images];
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    setError(null);

    if (!asDraft) {
      if (!formData.titleAr || !formData.titleEn || !formData.descriptionAr || !formData.descriptionEn) {
        setError(locale === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill in all required fields");
        return;
      }
    }

    startTransition(async () => {
      const action = initialData ? updateProduct.bind(null, initialData.id) : createProduct;
      const result = await action(formData);

      if (result.success) {
        toast.success(
          locale === "ar"
            ? asDraft ? "تم حفظ المسودة" : "تم حفظ المنتج"
            : asDraft ? "Draft saved" : "Product saved"
        );
        router.push("/seller/products");
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8 max-w-4xl mx-auto p-6 bg-card rounded-lg border border-border shadow-sm">
      {/* Language Tabs */}
      <div className="flex gap-1 rounded-lg border bg-muted p-1">
        <button
          type="button"
          onClick={() => setActiveLang("ar")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeLang === "ar"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          العربية
        </button>
        <button
          type="button"
          onClick={() => setActiveLang("en")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            activeLang === "en"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          English
        </button>
      </div>

      {/* Arabic Fields */}
      {activeLang === "ar" && (
        <div className="space-y-4 border-e-2 border-primary/20 pe-6">
          <h3 className="text-lg font-bold border-b pb-2">بيانات المنتج (العربية)</h3>
          <div className="space-y-2">
            <Label htmlFor="titleAr">العنوان بالعربية *</Label>
            <Input
              id="titleAr"
              name="titleAr"
              value={formData.titleAr}
              onChange={handleChange}
              required
              dir="rtl"
              placeholder="أدخل عنوان المنتج بالعربية"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionAr">الوصف بالعربية *</Label>
            <Textarea
              id="descriptionAr"
              name="descriptionAr"
              value={formData.descriptionAr}
              onChange={handleChange}
              required
              dir="rtl"
              rows={5}
              placeholder="أدخل وصف المنتج بالعربية"
            />
          </div>
        </div>
      )}

      {/* English Fields */}
      {activeLang === "en" && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Product Details (English)</h3>
          <div className="space-y-2">
            <Label htmlFor="titleEn">Title in English *</Label>
            <Input
              id="titleEn"
              name="titleEn"
              value={formData.titleEn}
              onChange={handleChange}
              required
              placeholder="Enter product title in English"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionEn">Description in English *</Label>
            <Textarea
              id="descriptionEn"
              name="descriptionEn"
              value={formData.descriptionEn}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Enter product description in English"
            />
          </div>
        </div>
      )}

      {/* Stock & Pricing */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-bold">
          {locale === "ar" ? "التسعير والمخزون" : "Pricing & Stock"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">{locale === "ar" ? "السعر (د.ع)" : "Price (IQD)"} *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              value={formData.price || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountPrice">{locale === "ar" ? "سعر الخصم (اختياري)" : "Discount Price (optional)"}</Label>
            <Input
              id="discountPrice"
              name="discountPrice"
              type="number"
              min="0"
              step="1"
              value={formData.discountPrice || ""}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">{locale === "ar" ? "المخزون" : "Stock"} *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              value={formData.stock || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">{locale === "ar" ? "حد المخزون المنخفض" : "Low Stock Threshold"}</Label>
            <Input
              id="lowStockThreshold"
              name="lowStockThreshold"
              type="number"
              min="0"
              step="1"
              value={formData.lowStockThreshold}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* SKU & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            onBlur={handleSKUBlur}
            placeholder={locale === "ar" ? "اتركه فارغاً للتوليد التلقائي" : "Leave empty to auto-generate"}
          />
          {!formData.sku && (
            <p className="text-xs text-muted-foreground">
              {locale === "ar" ? "سيتم توليد SKU تلقائياً عند المغادرة" : "SKU will be auto-generated on blur"}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">{locale === "ar" ? "القسم" : "Category"} *</Label>
          <Select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
            <option value="">{locale === "ar" ? "اختر قسماً" : "Select a category"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {locale === "ar" ? cat.nameAr : cat.nameEn}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4 pt-6 border-t">
        <div className="flex items-center justify-between">
          <Label>{locale === "ar" ? "صور المنتج" : "Product Images"}</Label>
          <span className="text-sm text-muted-foreground">
            {formData.images.length}/{MAX_IMAGES}
          </span>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50"
          } ${formData.images.length >= MAX_IMAGES ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            {locale === "ar"
              ? "اسحب الصور هنا أو انقر للرفع"
              : "Drag images here or click to upload"}
          </p>
          <label className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 cursor-pointer transition-colors">
            {locale === "ar" ? "اختيار صور" : "Choose Files"}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={formData.images.length >= MAX_IMAGES}
            />
          </label>
          <p className="text-xs text-muted-foreground mt-2">
            {locale === "ar" ? `الحد الأقصى ${MAX_IMAGES} صور` : `Max ${MAX_IMAGES} images`}
          </p>
        </div>

        {/* Image Preview Grid */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.images.map((url: string, index: number) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-md overflow-hidden border">
                  <Image src={url} alt={`Product ${index + 1}`} fill className="object-cover" />
                  {index === 0 && (
                    <span className="absolute top-1 start-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                      {locale === "ar" ? "أساسي" : "Primary"}
                    </span>
                  )}
                </div>
                <div className="absolute top-1 end-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={index === 0}
                    className="bg-background/90 p-1 rounded text-foreground hover:bg-background disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={index === formData.images.length - 1}
                    className="bg-background/90 p-1 rounded text-foreground hover:bg-background disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="bg-destructive/90 p-1 rounded text-destructive-foreground hover:bg-destructive"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          {common("cancel")}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
          disabled={isPending}
        >
          {isPending ? common("loading") : (locale === "ar" ? "حفظ كمسودة" : "Save as Draft")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? common("loading")
            : initialData
              ? (locale === "ar" ? "تحديث المنتج" : "Update Product")
              : (locale === "ar" ? "إرسال للمراجعة" : "Submit for Review")}
        </Button>
      </div>
    </form>
  );
}
