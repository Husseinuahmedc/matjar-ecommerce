import type { ProductFilters, ProductFormInput, ProductStatus } from "@/types/product";
import type { PaginatedResult } from "@/types";

const mockProduct = {
  id: "mock-prod-1",
  titleAr: "سماعات لاسلكية",
  titleEn: "Wireless Headphones",
  descriptionAr: "سماعات لاسلكية بجودة عالية",
  descriptionEn: "High quality wireless headphones",
  slug: "wireless-headphones",
  price: 75000,
  discountPrice: null,
  stock: 50,
  lowStockThreshold: 5,
  sku: "WH-001",
  status: "PUBLISHED" as ProductStatus,
  isFeatured: true,
  sellerId: "seller-user",
  categoryId: "mock-cat-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  category: { id: "mock-cat-1", nameAr: "إلكترونيات", nameEn: "Electronics", slug: "electronics", parentId: null },
  images: [{ id: "img-1", productId: "mock-prod-1", url: "/placeholder.svg", position: 0, isPrimary: true, createdAt: new Date() }],
  seller: { fullName: "Demo Seller" },
} as any;

export type ProductListItem = typeof mockProduct;
export type ProductFormInitialData = typeof mockProduct;

export async function getProducts(
  _filters: ProductFilters & {
    page?: number;
    limit?: number;
    status?: ProductStatus | ProductStatus[];
    sellerId?: string;
    categorySlug?: string;
  }
): Promise<PaginatedResult<ProductListItem>> {
  return {
    data: [mockProduct],
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function getProductBySlug(_slug: string, _isPublic = true) {
  return mockProduct;
}

export async function getProductById(_id: string) {
  return mockProduct;
}

export async function createProduct(
  _data: ProductFormInput,
  _sellerId: string
) {
  return mockProduct;
}

export async function updateProduct(
  _id: string,
  _data: ProductFormInput,
  _sellerId?: string
) {
  return mockProduct;
}

export async function deleteProduct(_id: string, _sellerId?: string) {}

export async function updateProductStatus(_id: string, _status: ProductStatus) {
  return mockProduct;
}

export async function getCategories() {
  return [
    { id: "mock-cat-1", nameAr: "إلكترونيات", nameEn: "Electronics", slug: "electronics", parentId: null, _count: { products: 10 } },
    { id: "mock-cat-2", nameAr: "ملابس", nameEn: "Clothing", slug: "clothing", parentId: null, _count: { products: 25 } },
    { id: "mock-cat-3", nameAr: "منزل وحديقة", nameEn: "Home & Garden", slug: "home-garden", parentId: null, _count: { products: 15 } },
  ];
}

export async function getFeaturedProducts(limit = 6) {
  return Array.from({ length: limit }, (_, i) => ({
    ...mockProduct,
    id: `mock-prod-${i + 1}`,
    titleEn: `Featured Product ${i + 1}`,
    titleAr: `منتج مميز ${i + 1}`,
    slug: `featured-product-${i + 1}`,
    price: 50000 + i * 10000,
  }));
}
