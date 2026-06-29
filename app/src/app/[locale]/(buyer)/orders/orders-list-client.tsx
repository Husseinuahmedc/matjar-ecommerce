"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { Link, useRouter } from "@/i18n/routing"
import { formatPrice } from "@/lib/utils"
import { cancelOrder } from "@/actions/orders"
import { ReviewModal } from "@/components/reviews/review-modal"
import { toast } from "sonner"
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
import { Eye, XCircle, Star, Package, SearchX } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400",
  SHIPPED: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
  DELIVERED: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  COMPLETED: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
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

interface Order {
  id: string
  status: string
  total: number
  subtotal: number
  shippingCost: number
  discount: number
  createdAt: string
  items: OrderItem[]
}

interface OrdersListClientProps {
  orders: Order[]
  reviewedProductIds: string[]
  locale: string
  statusFilter: string
}

export function OrdersListClient({ orders, reviewedProductIds, locale, statusFilter }: OrdersListClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [reviewTarget, setReviewTarget] = useState<{
    productId: string
    orderId: string
    productName: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState(statusFilter)

  const tabs = [
    { key: "all", label: locale === "ar" ? "الكل" : "All" },
    { key: "active", label: locale === "ar" ? "النشطة" : "Active" },
    { key: "DELIVERED", label: locale === "ar" ? "تم التوصيل" : "Delivered" },
    { key: "CANCELLED", label: locale === "ar" ? "ملغية" : "Cancelled" },
  ]

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(order.status)
    return order.status === activeTab
  })

  const handleCancel = () => {
    if (!cancelTarget) return
    startTransition(async () => {
      const formData = new FormData()
      formData.set("orderId", cancelTarget)
      const result = await cancelOrder(formData)
      if (result.success) {
        toast.success(locale === "ar" ? "تم إلغاء الطلب" : "Order cancelled")
        setCancelTarget(null)
        router.refresh()
      } else {
        toast.error(result.error || (locale === "ar" ? "فشل الإلغاء" : "Failed to cancel"))
      }
    })
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">{locale === "ar" ? "طلباتي" : "My Orders"}</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ms-1.5 text-xs">
                ({orders.filter((o) => tab.key === "active" ? ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED"].includes(o.status) : o.status === tab.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            {activeTab === "all" ? <Package className="h-10 w-10 text-muted-foreground" /> : <SearchX className="h-10 w-10 text-muted-foreground" />}
          </div>
          <h3 className="text-lg font-semibold">
            {locale === "ar" ? "لا توجد طلبات" : "No orders found"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {activeTab === "all"
              ? (locale === "ar" ? "لم تقم بأي طلب بعد. تصفح المنتجات وابدأ التسوق!" : "You haven't placed any orders yet. Browse products and start shopping!")
              : (locale === "ar" ? "لا توجد طلبات في هذا التصنيف" : "No orders in this category")}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const thumbnails = order.items.slice(0, 3)
            const canCancel = order.status === "PENDING"
            const canReview = order.status === "DELIVERED"

            return (
              <div
                key={order.id}
                className="rounded-xl border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-IQ")}
                      </span>
                      <span className="font-bold">
                        {formatPrice(Number(order.total), locale === "ar" ? "ar-IQ" : "en-IQ")}
                      </span>
                    </div>
                  </div>

                  {/* Product Thumbnails */}
                  <div className="flex items-center gap-2 mb-4">
                    {thumbnails.map((item, idx) => (
                      <div key={idx} className="relative h-12 w-12 rounded-md overflow-hidden bg-muted border">
                        {item.product.images[0]?.url ? (
                          <Image
                            src={item.product.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                            {item.product.titleAr?.charAt(0) || item.product.titleEn?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-muted-foreground">+{order.items.length - 3}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => setCancelTarget(order.id)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-destructive/10 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/20 transition-colors cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        {locale === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                    )}

                    {canReview && order.items.map((item) => {
                      const alreadyReviewed = reviewedProductIds.includes(item.product?.id || "")
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (!alreadyReviewed) {
                              setReviewTarget({
                                productId: item.productId || item.id,
                                orderId: order.id,
                                productName: locale === "ar" ? item.product.titleAr : item.product.titleEn,
                              })
                            }
                          }}
                          disabled={alreadyReviewed}
                          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            alreadyReviewed
                              ? "bg-green-100 text-green-700 cursor-default"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          }`}
                        >
                          <Star className="h-3.5 w-3.5" />
                          {alreadyReviewed
                            ? (locale === "ar" ? "تم التقييم ✓" : "Reviewed ✓")
                            : (locale === "ar" ? "تقييم" : "Review")}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
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
            <AlertDialogCancel onClick={() => setCancelTarget(null)}>
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
