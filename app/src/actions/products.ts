"use server";

import { z } from "zod";
import type { ActionResult } from "@/types";
import type { Product } from "@prisma/client";

const productSchema = z.object({
  titleAr: z.string().min(2),
  titleEn: z.string().min(2),
  descriptionAr: z.string().min(10),
  descriptionEn: z.string().min(10),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).optional(),
  sku: z.string().min(1),
  categoryId: z.string().min(1),
  images: z.array(z.string().url()).optional(),
});

type ProductInput = z.infer<typeof productSchema>;

const mockProduct = {
  id: "mock-prod-1",
  titleAr: "منتج تجريبي",
  titleEn: "Mock Product",
  descriptionAr: "وصف المنتج التجريبي بالعربية",
  descriptionEn: "Mock product description in English",
  slug: "mock-product",
  price: 50000,
  discountPrice: null,
  stock: 100,
  lowStockThreshold: 5,
  sku: "MOCK-001",
  status: "PUBLISHED",
  isFeatured: false,
  sellerId: "demo-user",
  categoryId: "mock-cat-1",
  createdAt: new Date(),
  updatedAt: new Date(),
} as any;

export async function createProduct(_data: ProductInput): Promise<ActionResult<Product>> {
  return { success: true, data: mockProduct };
}

export async function updateProduct(_id: string, _data: ProductInput): Promise<ActionResult<Product>> {
  return { success: true, data: mockProduct };
}

export async function deleteProduct(_id: string): Promise<ActionResult<void>> {
  return { success: true, data: undefined };
}

export async function updateStatus(_id: string, _status: string): Promise<ActionResult<Product>> {
  return { success: true, data: mockProduct };
}

export async function submitForReview(_id: string): Promise<ActionResult<Product>> {
  return { success: true, data: mockProduct };
}

export async function toggleProductStatus(_id: string): Promise<ActionResult<Product>> {
  return { success: true, data: mockProduct };
}

export async function updateProductStock(
  _productId: string,
  _newQuantity: number
): Promise<ActionResult<void>> {
  return { success: true, data: undefined };
}

export async function bulkDeleteProducts(_ids: string[]): Promise<ActionResult<void>> {
  return { success: true, data: undefined };
}
