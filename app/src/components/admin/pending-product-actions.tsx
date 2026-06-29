"use client"

import { useTransition } from "react"
import { useLocale } from "next-intl"
import { updateStatus } from "@/actions/products"
import { Button } from "@/components/ui"
import { toast } from "sonner"
import { Check, X } from "lucide-react"

interface PendingProductActionsProps {
  productId: string
}

export default function PendingProductActions({
  productId,
}: PendingProductActionsProps) {
  const [isPendingApproving, startApprove] = useTransition()
  const [isPendingRejecting, startReject] = useTransition()
  const locale = useLocale()
  const isAr = locale === "ar"

  const handleApprove = () => {
    startApprove(async () => {
      const result = await updateStatus(productId, "PUBLISHED")
      if (result.success) {
        toast.success(isAr ? "تم اعتماد المنتج" : "Product approved")
      } else {
        toast.error(result.error || (isAr ? "فشل الاعتماد" : "Failed to approve"))
      }
    })
  }

  const handleReject = () => {
    startReject(async () => {
      const result = await updateStatus(productId, "REJECTED")
      if (result.success) {
        toast.success(isAr ? "تم رفض المنتج" : "Product rejected")
      } else {
        toast.error(result.error || (isAr ? "فشل الرفض" : "Failed to reject"))
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        onClick={handleApprove}
        disabled={isPendingApproving}
        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
        aria-label={isAr ? "اعتماد" : "Approve"}
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleReject}
        disabled={isPendingRejecting}
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        aria-label={isAr ? "رفض" : "Reject"}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
