"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { updateOrderStatus } from "@/actions/orders"
import { toast } from "sonner"

const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const

type OrderStatus = (typeof ORDER_STATUSES)[number]

interface OrderStatusDropdownProps {
  orderId: string
  currentStatus: string
}

export default function OrderStatusDropdown({
  orderId,
  currentStatus,
}: OrderStatusDropdownProps) {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const isAr = locale === "ar"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus
    if (newStatus === currentStatus) return

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus)
      if (result.success) {
        toast.success(isAr ? "تم تحديث حالة الطلب" : "Order status updated")
      } else {
        toast.error(result.error || (isAr ? "فشل تحديث الحالة" : "Failed to update status"))
      }
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 ${
        currentStatus === "DELIVERED"
          ? "border-green-200 bg-green-50 text-green-700"
          : currentStatus === "CANCELLED"
          ? "border-red-200 bg-red-50 text-red-700"
          : currentStatus === "PENDING"
          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
          : currentStatus === "SHIPPED"
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      {ORDER_STATUSES.map((status) => (
        <option key={status} value={status}>
          {isAr
            ? ({
                PENDING: "قيد الانتظار",
                CONFIRMED: "مؤكد",
                PROCESSING: "قيد المعالجة",
                SHIPPED: "تم الشحن",
                DELIVERED: "تم التوصيل",
                CANCELLED: "ملغي",
              }[status] || status)
            : status.charAt(0) + status.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  )
}
