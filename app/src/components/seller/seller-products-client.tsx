"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { Button } from "@/components/ui"
import { formatPrice } from "@/lib/utils"
import { deleteProduct, submitForReview, toggleProductStatus, bulkDeleteProducts } from "@/actions/products"
import { toast } from "sonner"
import { Trash2, Edit, RotateCcw, Send, CheckSquare, Square, Trash } from "lucide-react"
import type { ProductListItem } from "@/services/product.service"

interface SellerProductsPageClientProps {
  products: ProductListItem[]
  locale: string
}

type StatusFilter = "ALL" | "PUBLISHED" | "PENDING" | "DRAFT" | "REJECTED"

const STATUS_TABS: Array<{ value: StatusFilter; labelAr: string; labelEn: string }> = [
  { value: "ALL", labelAr: "الكل", labelEn: "All" },
  { value: "PUBLISHED", labelAr: "منشور", labelEn: "Published" },
  { value: "PENDING", labelAr: "قيد الانتظار", labelEn: "Pending" },
  { value: "DRAFT", labelAr: "مسودة", labelEn: "Draft" },
  { value: "REJECTED", labelAr: "مرفوض", labelEn: "Rejected" },
]

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
  DRAFT: "bg-gray-100 text-gray-800",
}

export default function SellerProductsPageClient({ products, locale }: SellerProductsPageClientProps) {
  const isAr = locale === "ar"
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<StatusFilter>("ALL")
  const [search, setSearch] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredProducts = products.filter((p) => {
    if (activeTab !== "ALL" && p.status !== activeTab) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        p.titleAr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleDelete = (id: string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) return
    startTransition(async () => {
      const result = await deleteProduct(id)
      if (result.success) {
        toast.success(isAr ? "تم حذف المنتج" : "Product deleted")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleBulkDelete = () => {
    const count = selectedIds.size
    if (count === 0) return
    if (!confirm(isAr ? `هل أنت متأكد من حذف ${count} منتج(منتجات)؟` : `Are you sure you want to delete ${count} product(s)?`)) return
    startTransition(async () => {
      const result = await bulkDeleteProducts(Array.from(selectedIds))
      if (result.success) {
        toast.success(isAr ? `تم حذف ${count} منتج(منتجات)` : `${count} product(s) deleted`)
        setSelectedIds(new Set())
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleSubmitForReview = (id: string) => {
    startTransition(async () => {
      const result = await submitForReview(id)
      if (result.success) {
        toast.success(isAr ? "تم إرسال المنتج للمراجعة" : "Product submitted for review")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleToggleStatus = (id: string) => {
    startTransition(async () => {
      const result = await toggleProductStatus(id)
      if (result.success) {
        toast.success(isAr ? "تم تحديث الحالة" : "Status updated")
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {isAr ? "إدارة المنتجات" : "Product Management"}
        </h1>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isPending}
            >
              <Trash className="h-4 w-4 me-1" />
              {isAr ? `حذف (${selectedIds.size})` : `Delete (${selectedIds.size})`}
            </Button>
          )}
          <Link href="/seller/products/new">
            <Button>{isAr ? "إضافة منتج جديد" : "Add New Product"}</Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            {isAr ? tab.labelAr : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isAr ? "بحث بالعنوان أو الرمز..." : "Search by title or SKU..."}
          className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start w-10">
                <button onClick={toggleSelectAll} className="cursor-pointer" aria-label="Select all">
                  {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare className="h-5 w-5 text-primary" />
                  ) : (
                    <Square className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "المنتج" : "Product"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "القسم" : "Category"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "السعر" : "Price"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "المخزون" : "Stock"}
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
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  {isAr ? "لا توجد منتجات" : "No products found"}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleSelect(product.id)} className="cursor-pointer" aria-label="Select">
                      {selectedIds.has(product.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                        {product.images?.[0]?.url && (
                          <Image src={product.images[0].url} alt="" fill className="object-cover" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">
                          {isAr ? product.titleAr : product.titleEn}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {isAr ? product.category?.nameAr : product.category?.nameEn}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(product.price), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 5 ? "text-red-600" : ""}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[product.status] || ""}`}>
                      {isAr
                        ? (({ PUBLISHED: "منشور", PENDING: "قيد الانتظار", REJECTED: "مرفوض", DRAFT: "مسودة" } as Record<string, string>)[product.status] || product.status)
                        : product.status}
                    </span>
                    {product.status === "REJECTED" && (
                      <p className="text-[10px] text-red-500 mt-0.5">
                        {isAr ? "يمكنك إعادة الإرسال" : "You can resubmit"}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1">
                      {(product.status === "DRAFT" || product.status === "REJECTED") && (
                        <button
                          onClick={() => handleSubmitForReview(product.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                          title={isAr ? "إرسال للمراجعة" : "Submit for review"}
                        >
                          <Send className="h-3 w-3" />
                          <span className="hidden sm:inline">
                            {isAr ? "إرسال" : "Submit"}
                          </span>
                        </button>
                      )}
                      {product.status === "PUBLISHED" && (
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                          title={isAr ? "تحويل إلى مسودة" : "Move to draft"}
                        >
                          <RotateCcw className="h-3 w-3" />
                          <span className="hidden sm:inline">
                            {isAr ? "إيقاف" : "Unpublish"}
                          </span>
                        </button>
                      )}
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="hidden sm:inline">{isAr ? "تعديل" : "Edit"}</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                        title={isAr ? "حذف" : "Delete"}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
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
