import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { Metadata } from "next";
import { ProductImage } from "@/components/products/product-image";
import { getFeaturedProducts, getCategories } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "الرئيسية | Home",
  description: "متجر — منصة تسوق إلكتروني متعددة البائعين | Matjar — Multi-seller e-commerce platform",
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const productsT = await getTranslations("products");

  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(6),
    getCategories()
  ]);

  return (
    <main className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden bg-muted">
        <Image
          src="https://picsum.photos/id/20/1920/1080"
          alt="Hero background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="container relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {locale === "ar" ? "تسوق أفضل المنتجات في العراق" : "Shop the Best Products in Iraq"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {locale === "ar" 
              ? "استكشف مجموعة واسعة من المنتجات من أفضل البائعين المحليين." 
              : "Explore a wide range of products from the best local sellers."}
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-bold hover:bg-primary/90 transition-all shadow-lg"
            >
              {productsT("title")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">{locale === "ar" ? "منتجات مميزة" : "Featured Products"}</h2>
            <p className="text-muted-foreground mt-2">
              {locale === "ar" ? "اخترنا لك الأفضل" : "Handpicked for you"}
            </p>
          </div>
          <Link href="/products" className="text-primary font-medium hover:underline">
            {locale === "ar" ? "عرض الكل" : "View All"}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {featuredProducts.map((product) => (
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
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {locale === "ar" ? product.titleAr : product.titleEn}
                </h3>
                <div className="text-lg font-bold text-primary">
                  {formatPrice(Number(product.price), locale === "ar" ? "ar-IQ" : "en-IQ")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{locale === "ar" ? "تسوق حسب الفئات" : "Shop by Categories"}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="relative group h-40 rounded-xl overflow-hidden bg-primary/5 hover:bg-primary/10 transition-colors border border-primary/10 flex flex-col items-center justify-center p-6 text-center"
            >
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {locale === "ar" ? category.nameAr : category.nameEn}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {category._count.products} {locale === "ar" ? "منتج" : "products"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
