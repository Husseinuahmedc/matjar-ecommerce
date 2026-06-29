"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { sellerUpdateOrderStatus } from "@/actions/orders"
import { toast } from "sonner"

type OrderStatus = "CONFIRMED" | "PROCESSING" | "SHIPPED"

interface SellerOrderStatusDropdownProps {
  orderId: string
  currentStatus: string
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; labelAr: string; labelEn: string }> = [
  { value: "CONFIRMED", labelAr: "مؤكد", labelEn: "Confirmed" },
  { value: "PROCESSING", labelAr: "قيد المعالجة", labelEn: "Processing" },
  { value: "SHIPPED", labelAr: "تم الشحن", labelEn: "Shipped" },
]

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
  PROCESSING: "border-yellow-200 bg-yellow-50 text-yellow-700",
  SHIPPED: "border-purple-200 bg-purple-50 text-purple-700",
}

export default function SellerOrderStatusDropdown({
  orderId,
  currentStatus,
}: SellerOrderStatusDropdownProps) {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const isAr = locale === "ar"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus
    if (newStatus === currentStatus) return

    startTransition(async () => {
      const result = await sellerUpdateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success(isAr ? "تم تحديث حالة الطلب" : "Order status updated")
      } else {
        toast.error(result.error || (isAr ? "فشل تحديث الحالة" : "Failed to update status"))
      }
    })
  }

  const nextOptions = STATUS_OPTIONS.filter((opt) => {
    if (currentStatus === "CONFIRMED") return opt.value === "PROCESSING"
    if (currentStatus === "PROCESSING") return opt.value === "SHIPPED"
    return false
  })

  if (nextOptions.length === 0) return null

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${
        STATUS_COLORS[currentStatus] || "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      {STATUS_OPTIONS.map((status) => {
        const isCurrent = status.value === currentStatus
        const isAvailable = nextOptions.some((n) => n.value === status.value)
        return (
          <option
            key={status.value}
            value={status.value}
            disabled={!isCurrent && !isAvailable}
          >
            {isAr ? status.labelAr : status.labelEn}
            {isCurrent ? ` (${isAr ? "الحالية" : "Current"})` : ""}
          </option>
        )
      })}
    </select>
  )
}
