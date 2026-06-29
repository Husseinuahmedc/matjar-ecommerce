import type { Metadata } from "next"
import { formatPrice } from "@/lib/utils"
import { BuyerSidebar } from "@/components/dashboard/BuyerSidebar"
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav"
import { DashboardAnimationWrapper } from "../dashboard/dashboard-animation-wrapper"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Heart, ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "قائمة المفضلة | Wishlist",
}

const mockWishlistItems: Array<{
  id: string;
  product: {
    id: string;
    titleAr: string;
    titleEn: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: { url: string }[];
  };
}> = []

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <div className="flex">
      <div className="hidden md:block">
        <BuyerSidebar />
      </div>
      <MobileDashboardNav />

      <DashboardAnimationWrapper>
        <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">
                {locale === "ar" ? "قائمة المفضلة" : "Wishlist"}
              </h1>
            </div>
            <span className="text-sm text-muted-foreground">
              {locale === "ar" ? `${mockWishlistItems.length} منتج` : `${mockWishlistItems.length} items`}
            </span>
          </div>

          {mockWishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {locale === "ar" ? "قائمة المفضلة فارغة" : "Your wishlist is empty"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {locale === "ar" ? "ابدأ بإضافة المنتجات التي تعجبك" : "Start adding products you like"}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockWishlistItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.product.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={locale === "ar" ? item.product.titleAr : item.product.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {locale === "ar" ? item.product.titleAr : item.product.titleEn}
                    </h3>
                    <p className="font-bold text-primary">
                      {formatPrice(Number(item.product.discountPrice || item.product.price), locale === "ar" ? "ar-IQ" : "en-IQ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DashboardAnimationWrapper>
    </div>
  )
}
