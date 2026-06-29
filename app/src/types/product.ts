// ─── Product Types ────────────────────────────────────────────────────────────

export type ProductStatus = "DRAFT" | "PENDING" | "PUBLISHED" | "REJECTED";

export interface Product {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  sku: string;
  status: ProductStatus;
  sellerId: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  parentId: string | null;
}

// ─── Product Filters ──────────────────────────────────────────────────────────

export interface ProductFormInput {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  sku: string;
  categoryId: string;
  images?: string[];
}

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  search?: string;
}
