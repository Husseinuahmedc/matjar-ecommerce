"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { formatPrice } from "@/lib/utils"
import { cancelOrder } from "@/actions/orders"
import { ReviewModal } from "@/components/reviews/review-modal"
import { toast } from "sonner"
import { Check, XCircle, Star, ArrowLeft, Package } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
  SHIPPED: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  DELIVERED: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
}

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  productId?: string
  product: {
    id: string
    titleAr: string
    titleEn: string
    images: { url: string }[]
  }
}

interface OrderEvent {
  id: string
  status: string
  note?: string
  createdAt: string
}

interface ShippingAddress {
  fullName: string
  phone: string
  city: string
  country: string
  street: string
}

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  couponCode?: string
  createdAt: string
  items: OrderItem[]
  events: OrderEvent[]
  shippingAddress: ShippingAddress
}

interface OrderDetailClientProps {
  order: Order
  reviewedProductIds: string[]
  locale: string
  currentStepIndex: number
  statusOrder: string[]
}

export function OrderDetailClient({
  order,
  reviewedProductIds,
  locale,
  currentStepIndex,
  statusOrder,
}: OrderDetailClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [reviewTarget, setReviewTarget] = useState<{
    productId: string
    orderId: string
    productName: string
  } | null>(null)

  const isCancelled = order.status === "CANCELLED" || order.status === "REFUNDED"

  const handleCancel = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.set("orderId", order.id)
      const result = await cancelOrder(formData)
      if (result.success) {
        toast.success(locale === "ar" ? "تم إلغاء الطلب" : "Order cancelled")
        setShowCancelDialog(false)
        router.refresh()
      } else {
        toast.error(result.error || (locale === "ar" ? "فشل الإلغاء" : "Failed to cancel"))
      }
    })
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Back Button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {locale === "ar" ? "العودة للطلبات" : "Back to Orders"}
      </Link>

      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {locale === "ar" ? "تفاصيل الطلب" : "Order Details"}
            <span className="text-base text-muted-foreground">#{order.id.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar-IQ" : "en-IQ")}
          </p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${STATUS_COLORS[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Status Timeline */}
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-bold mb-6">
              {locale === "ar" ? "حالة الطلب" : "Order Status"}
            </h3>
            {isCancelled ? (
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-red-600">
                    {locale === "ar" ? "تم الإلغاء" : "Cancelled"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.events.find((e) => e.status === "CANCELLED" || e.status === "REFUNDED")?.note || ""}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {statusOrder.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex
                  const isCurrent = idx === currentStepIndex
                  return (
                    <div key={step} className="flex gap-4 relative">
                      {idx < statusOrder.length - 1 && (
                        <div
                          className={`absolute start-[15px] top-8 bottom-[-16px] w-0.5 ${
                            isCompleted && !isCurrent ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 z-10 ${
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted bg-background text-muted-foreground"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <div className={`pb-8 ${isCompleted ? "opacity-100" : "opacity-40"}`}>
                        <p className={`font-medium text-sm ${isCurrent ? "text-primary" : ""}`}>
                          {step}
                        </p>
                        {isCurrent && order.events.find((e) => e.status === step) && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              order.events.find((e) => e.status === step)!.createdAt
                            ).toLocaleString(locale === "ar" ? "ar-IQ" : "en-IQ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-bold">
                {locale === "ar" ? "المنتجات" : "Items"}
              </h3>
            </div>
            <div className="divide-y">
              {order.items.map((item) => {
                const alreadyReviewed = reviewedProductIds.includes(item.product?.id || "")
                return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    <div className="relative h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                      {item.product.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {locale === "ar" ? item.product.titleAr : item.product.titleEn}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.quantity} x {formatPrice(Number(item.unitPrice), locale === "ar" ? "ar-IQ" : "en-IQ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold whitespace-nowrap">
                        {formatPrice(Number(item.unitPrice) * item.quantity, locale === "ar" ? "ar-IQ" : "en-IQ")}
                      </p>
                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() => {
                            if (!alreadyReviewed) {
                              setReviewTarget({
                                productId: item.product?.id || item.productId || item.id,
                                orderId: order.id,
                                productName: locale === "ar" ? item.product.titleAr : item.product.titleEn,
                              })
                            }
                          }}
                          disabled={alreadyReviewed}
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer ${
                            alreadyReviewed
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          <Star className="h-3 w-3" />
                          {alreadyReviewed
                            ? (locale === "ar" ? "تم التقييم ✓" : "Reviewed ✓")
                            : (locale === "ar" ? "تقييم" : "Review")}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-bold mb-4">
              {locale === "ar" ? "ملخص الدفع" : "Payment Summary"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "المجموع الفرعي" : "Subtotal"}
                </span>
                <span>{formatPrice(Number(order.subtotal), locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "الشحن" : "Shipping"}
                </span>
                <span>
                  {Number(order.shippingCost) === 0
                    ? (locale === "ar" ? "مجاني" : "Free")
                    : formatPrice(Number(order.shippingCost), locale === "ar" ? "ar-IQ" : "en-IQ")}
                </span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    {locale === "ar" ? "الخصم" : "Discount"}
                    {order.couponCode && <span className="text-xs ms-1">({order.couponCode})</span>}
                  </span>
                  <span>-{formatPrice(Number(order.discount), locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">
                  {formatPrice(Number(order.total), locale === "ar" ? "ar-IQ" : "en-IQ")}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border bg-card shadow-sm p-6">
            <h3 className="font-bold mb-4">
              {locale === "ar" ? "عنوان الشحن" : "Shipping Address"}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="pt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Actions */}
          {order.status === "PENDING" && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-destructive/30 text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive/5 transition-colors cursor-pointer"
            >
              <XCircle className="h-4 w-4" />
              {locale === "ar" ? "إلغاء الطلب" : "Cancel Order"}
            </button>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={(open) => !open && setShowCancelDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {locale === "ar" ? "تأكيد إلغاء الطلب" : "Confirm Order Cancellation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {locale === "ar"
                ? "هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء."
                : "Are you sure you want to cancel this order? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              {locale === "ar" ? "رجوع" : "Go Back"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={isPending}>
              {isPending
                ? (locale === "ar" ? "جاري الإلغاء..." : "Cancelling...")
                : (locale === "ar" ? "تأكيد الإلغاء" : "Confirm Cancel")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          open={!!reviewTarget}
          onOpenChange={(open) => {
            if (!open) {
              setReviewTarget(null)
              router.refresh()
            }
          }}
          productId={reviewTarget.productId}
          orderId={reviewTarget.orderId}
          productName={reviewTarget.productName}
        />
      )}
    </main>
  )
}
