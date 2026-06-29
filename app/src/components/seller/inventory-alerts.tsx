"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { formatPrice } from "@/lib/utils"
import { updateProductStock } from "@/actions/products"
import { toast } from "sonner"
import { Pencil, Check, X } from "lucide-react"

interface InventoryAlertsProps {
  products: Array<{
    id: string
    titleAr: string
    titleEn: string
    stock: number
    price: number
    lowStockThreshold: number
    images: Array<{ url: string }>
    sku: string
  }>
  locale: string
}

export default function InventoryAlerts({ products, locale }: InventoryAlertsProps) {
  const isAr = locale === "ar"
  const [editingId, setEditingId] = useState<string | null>(null)
  const [stockValue, setStockValue] = useState<number>(0)
  const [isPending, startTransition] = useTransition()

  const handleUpdateStock = (productId: string) => {
    startTransition(async () => {
      const result = await updateProductStock(productId, stockValue)
      if (result.success) {
        toast.success(isAr ? "تم تحديث المخزون" : "Stock updated")
        setEditingId(null)
      } else {
        toast.error(result.error || (isAr ? "فشل تحديث المخزون" : "Failed to update stock"))
      }
    })
  }

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h3 className="font-bold">
          {isAr ? "تنبيهات المخزون" : "Inventory Alerts"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isAr ? "منتجات بمخزون أقل من 5" : "Products with stock less than 5"}
        </p>
      </div>
      <div className="divide-y">
        {products.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {isAr ? "جميع المنتجات متوفرة" : "All products are well stocked"}
          </p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 flex items-center gap-4">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                {product.images?.[0]?.url && (
                  <Image src={product.images[0].url} alt="" fill className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {isAr ? product.titleAr : product.titleEn}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(Number(product.price), isAr ? "ar-IQ" : "en-IQ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {editingId === product.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(Number(e.target.value))}
                      className="w-20 rounded-md border px-2 py-1 text-sm"
                      min={0}
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateStock(product.id)}
                      disabled={isPending}
                      className="p-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-red-600 font-bold text-sm">{product.stock}</span>
                    <button
                      onClick={() => {
                        setEditingId(product.id)
                        setStockValue(product.stock)
                      }}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                      aria-label={isAr ? "تحديث المخزون" : "Update stock"}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
              <Link
                href={`/seller/products/${product.id}/edit`}
                className="text-primary hover:text-primary/80 text-sm"
              >
                {isAr ? "تعديل" : "Edit"}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
