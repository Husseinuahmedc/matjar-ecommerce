import type { Metadata } from "next"
import { getOrdersBySeller } from "@/services/order.service"
import { formatPrice } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import SellerOrderStatusDropdown from "@/components/seller/seller-order-status-dropdown"

export const metadata: Metadata = {
  title: "طلبات المتجر | Seller Orders",
}

const STATUS_TABS = [
  { value: "", labelAr: "الكل", labelEn: "All" },
  { value: "CONFIRMED", labelAr: "مؤكدة", labelEn: "Confirmed" },
  { value: "PROCESSING", labelAr: "قيد المعالجة", labelEn: "Processing" },
  { value: "SHIPPED", labelAr: "تم الشحن", labelEn: "Shipped" },
  { value: "DELIVERED", labelAr: "تم التوصيل", labelEn: "Delivered" },
]

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

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string }>
}

export default async function SellerOrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { status: filterStatus } = await searchParams
  const isAr = locale === "ar"

  const allOrders = await getOrdersBySeller("demo-user")

  const orders = filterStatus
    ? allOrders.filter((o) => o.status === filterStatus)
    : allOrders

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isAr ? "إدارة الطلبات" : "Order Management"}
      </h1>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-1 rounded-lg border bg-card p-1">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab.value}
            href={`/${locale}/seller/orders${tab.value ? `?status=${tab.value}` : ""}`}
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

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "رقم الطلب" : "Order ID"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "العميل" : "Buyer"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "المنتجات" : "Items"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "المجموع" : "Total"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الحالة" : "Status"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "التاريخ" : "Date"}
              </th>
              <th className="px-4 py-3 text-end text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  {isAr ? "لا توجد طلبات" : "No orders found"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {order.buyer.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {order.items.length} {isAr ? "منتج" : "items"}
                  </td>
                  <td className="px-4 py-3 text-sm font-bold">
                    {formatPrice(Number(order.total), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status] || ""}`}>
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
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <SellerOrderStatusDropdown
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                      <Link
                        href={`/seller/orders/${order.id}`}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        {isAr ? "عرض" : "View"}
                      </Link>
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
