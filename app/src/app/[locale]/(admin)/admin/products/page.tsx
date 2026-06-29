import React from "react"
import Image from "next/image"
import { getProducts } from "@/services/product.service"
import { Link } from "@/i18n/routing"
import { formatPrice } from "@/lib/utils"
import PendingProductActions from "@/components/admin/pending-product-actions"
import StatusButton from "@/components/products/status-button"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "إدارة المنتجات | Product Management",
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string }>
}

export default async function AdminProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { status: filterStatus } = await searchParams
  const isAr = locale === "ar"

  const { data: products } = await getProducts({
    status: filterStatus as any,
    limit: 50,
  })

  const tabs = [
    { value: "", labelAr: "الكل", labelEn: "All" },
    { value: "PENDING", labelAr: "قيد الانتظار", labelEn: "Pending" },
    { value: "PUBLISHED", labelAr: "منشور", labelEn: "Published" },
    { value: "REJECTED", labelAr: "مرفوض", labelEn: "Rejected" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{isAr ? "إدارة المنتجات" : "Product Management"}</h1>
        <p className="text-muted-foreground">
          {isAr
            ? "مراجعة واعتماد المنتجات الجديدة المضافة من قبل التجار."
            : "Review and approve new products added by sellers."}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/${locale}/admin/products${tab.value ? `?status=${tab.value}` : ""}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              (tab.value === "" && !filterStatus) || filterStatus === tab.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            {isAr ? tab.labelAr : tab.labelEn}
          </Link>
        ))}
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "المنتج" : "Product"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "البائع" : "Seller"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "السعر" : "Price"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الحالة" : "Status"}
              </th>
              <th className="px-4 py-3 text-end text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  {isAr ? "لا توجد منتجات" : "No products found"}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.images[0]?.url && (
                          <Image src={product.images[0].url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div className="font-medium">
                        {isAr ? product.titleAr : product.titleEn}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.seller.fullName}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(product.price), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        product.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : product.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : product.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isAr
                        ? (({
                            PUBLISHED: "منشور",
                            PENDING: "قيد الانتظار",
                            REJECTED: "مرفوض",
                            DRAFT: "مسودة",
                          } as Record<string, string>)[product.status] || product.status)
                        : product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    {product.status === "PENDING" && (
                      <PendingProductActions productId={product.id} />
                    )}
                    {product.status === "PUBLISHED" && (
                      <StatusButton id={product.id} status="REJECTED" variant="outline">
                        {isAr ? "إلغاء النشر" : "Unpublish"}
                      </StatusButton>
                    )}
                    {product.status === "REJECTED" && (
                      <StatusButton id={product.id} status="PUBLISHED" variant="default">
                        {isAr ? "نشر" : "Publish"}
                      </StatusButton>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
