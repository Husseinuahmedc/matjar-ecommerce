import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { getOrderById } from "@/services/order.service"
import { formatPrice } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import SellerOrderStatusDropdown from "@/components/seller/seller-order-status-dropdown"

export const metadata: Metadata = {
  title: "تفاصيل الطلب | Order Details",
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "border-yellow-200 bg-yellow-50 text-yellow-700",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
  PROCESSING: "border-purple-200 bg-purple-50 text-purple-700",
  SHIPPED: "border-indigo-200 bg-indigo-50 text-indigo-700",
  DELIVERED: "border-green-200 bg-green-50 text-green-700",
  COMPLETED: "border-green-200 bg-green-50 text-green-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
  REFUNDED: "border-orange-200 bg-orange-50 text-orange-700",
}

export default async function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const isAr = locale === "ar"
  const localePrice = isAr ? "ar-IQ" : "en-IQ"

  const order = await getOrderById(id, "demo-user", "SELLER")

  if (!order) notFound()

  // Calculate seller's total from their items only
  const sellerTotal = order.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  )

  return (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isAr ? "تفاصيل الطلب" : "Order Details"} #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-muted-foreground">
            {new Date(order.createdAt).toLocaleString(localePrice)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATUS_STYLES[order.status] || ""}`}>
            {isAr
              ? ({
                  PENDING: "قيد الانتظار",
                  CONFIRMED: "مؤكد",
                  PROCESSING: "قيد المعالجة",
                  SHIPPED: "تم الشحن",
                  DELIVERED: "تم التوصيل",
                  COMPLETED: "مكتمل",
                  CANCELLED: "ملغي",
                  REFUNDED: "مسترجع",
                }[order.status] || order.status)
              : order.status}
          </span>
          <SellerOrderStatusDropdown orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Seller's Items */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-bold">
                {isAr ? "منتجاتك في هذا الطلب" : "Your Items in This Order"}
              </h3>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 rounded-md bg-muted overflow-hidden">
                    {item.product.images?.[0]?.url && (
                      <Image
                        src={item.product.images[0].url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {isAr ? item.product.titleAr : item.product.titleEn}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.quantity} x {formatPrice(Number(item.unitPrice), localePrice)}
                    </p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold">
                      {formatPrice(Number(item.unitPrice) * item.quantity, localePrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold mb-6">
              {isAr ? "تتبع الطلب" : "Order Timeline"}
            </h3>
            <div className="space-y-6">
              {order.events.map((event, idx) => (
                <div key={event.id} className="flex gap-4 relative">
                  {idx < order.events.length - 1 && (
                    <div className="absolute start-[11px] top-6 bottom-[-24px] w-0.5 bg-muted" />
                  )}
                  <div
                    className={`h-6 w-6 rounded-full border-2 shrink-0 z-10 bg-background ${
                      idx === 0 ? "border-primary" : "border-muted"
                    }`}
                  />
                  <div>
                    <p className={`font-medium ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                      {isAr
                        ? ({
                            PENDING: "قيد الانتظار",
                            CONFIRMED: "مؤكد",
                            PROCESSING: "قيد المعالجة",
                            SHIPPED: "تم الشحن",
                            DELIVERED: "تم التوصيل",
                            COMPLETED: "مكتمل",
                            CANCELLED: "ملغي",
                            REFUNDED: "مسترجع",
                          }[event.status] || event.status)
                        : event.status}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString(localePrice)}
                    </p>
                    {event.note && (
                      <p className="text-sm mt-1 text-muted-foreground italic">
                        {event.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Summary (Seller's portion) */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold mb-4">
              {isAr ? "ملخص طلبك" : "Your Order Summary"}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>{isAr ? "إجمالي منتجاتك" : "Your Items Total"}</span>
                <span className="text-primary">{formatPrice(sellerTotal, localePrice)}</span>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold mb-4">
              {isAr ? "معلومات المشتري" : "Buyer Information"}
            </h3>
            <div className="text-sm space-y-2">
              <p className="font-medium">{order.buyer.fullName}</p>
              {order.buyer.phone && (
                <p className="text-muted-foreground">{order.buyer.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="font-bold mb-4">
              {isAr ? "عنوان الشحن" : "Shipping Address"}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="pt-2 text-muted-foreground">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
