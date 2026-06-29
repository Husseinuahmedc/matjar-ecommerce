import type { Metadata } from "next"
import { getProducts } from "@/services/product.service"
import SellerProductsPageClient from "@/components/seller/seller-products-client"

export const metadata: Metadata = {
  title: "إدارة المنتجات | Product Management",
}

export default async function SellerProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  const { data: products } = await getProducts({
    sellerId: "demo-user",
    status: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
    limit: 1000,
  })

  return <SellerProductsPageClient products={products} locale={locale} />
}
