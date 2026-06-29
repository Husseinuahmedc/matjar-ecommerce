import { ProductImage } from "@/components/products/product-image";
import { getProducts, getCategories } from "@/services/product.service";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المنتجات | Products",
  description: "تصفح مجموعة واسعة من المنتجات | Browse a wide range of products",
};

export default async function ProductsPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const sParams = await searchParams;
  const t = await getTranslations("products");
  const common = await getTranslations("common");

  const filters = {
    search: sParams.q as string,
    categorySlug: sParams.category as string,
    minPrice: sParams.min ? Number(sParams.min) : undefined,
    maxPrice: sParams.max ? Number(sParams.max) : undefined,
    page: sParams.page ? Number(sParams.page) : 1,
    status: "PUBLISHED" as const,
  };

  const { data: products, total, totalPages } = await getProducts(filters);
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold border-b pb-2">{locale === "ar" ? "الأقسام" : "Categories"}</h3>
            <div className="space-y-2">
              <Link 
                href="/products" 
                className={`block text-sm hover:text-primary transition-colors ${!filters.categorySlug ? "text-primary font-bold" : "text-muted-foreground"}`}
              >
                {locale === "ar" ? "الكل" : "All"}
              </Link>
              {categories.map((cat) => (
                <Link 
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`block text-sm hover:text-primary transition-colors ${filters.categorySlug === cat.slug ? "text-primary font-bold" : "text-muted-foreground"}`}
                >
                  {locale === "ar" ? cat.nameAr : cat.nameEn}
                </Link>
              ))}
            </div>
          </div>

          <form action="" method="GET" className="space-y-4">
            <h3 className="font-bold border-b pb-2">{locale === "ar" ? "السعر" : "Price"}</h3>
            <div className="grid grid-cols-2 gap-2">
              <input 
                name="min"
                type="number" 
                placeholder="Min" 
                className="w-full px-2 py-1 text-sm border rounded"
                defaultValue={filters.minPrice}
              />
              <input 
                name="max"
                type="number" 
                placeholder="Max" 
                className="w-full px-2 py-1 text-sm border rounded"
                defaultValue={filters.maxPrice}
              />
            </div>
            {filters.categorySlug && <input type="hidden" name="category" value={filters.categorySlug} />}
            {sParams.q && <input type="hidden" name="q" value={sParams.q as string} />}
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {locale === "ar" ? "تصفية" : "Filter"}
            </button>
            {(filters.minPrice || filters.maxPrice) && (
              <Link 
                href={filters.categorySlug ? `/products?category=${filters.categorySlug}` : "/products"}
                className="block text-center text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {locale === "ar" ? "مسح التصفية" : "Clear Filters"}
              </Link>
            )}
          </form>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <p className="text-sm text-muted-foreground">
              {total} {locale === "ar" ? "منتج" : "products"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
              <p className="text-muted-foreground">{common("noResults")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link 
                  key={product.id} 
                  href={`/products/${product.slug}`}
                  className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-muted relative">
                    <ProductImage 
                      src={product.images?.[0]?.url} 
                      alt={locale === "ar" ? product.titleAr : product.titleEn} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded uppercase">
                        {t("outOfStock")}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-xs text-primary font-medium">
                      {locale === "ar" ? product.category.nameAr : product.category.nameEn}
                    </div>
                    <h2 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {locale === "ar" ? product.titleAr : product.titleEn}
                    </h2>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-lg font-bold text-primary">
                        {formatPrice(Number(product.price), locale === "ar" ? "ar-IQ" : "en-IQ")}
                      </div>
                      {product.discountPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          {formatPrice(Number(product.discountPrice), locale === "ar" ? "ar-IQ" : "en-IQ")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination stub */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
               {/* Pagination links would go here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
