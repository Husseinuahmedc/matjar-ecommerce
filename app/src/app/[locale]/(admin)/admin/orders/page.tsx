import type { Metadata } from "next"
import { getOrdersByAdmin } from "@/services/order.service"
import { formatPrice } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import OrderStatusDropdown from "@/components/admin/order-status-dropdown"

export const metadata: Metadata = {
  title: "Admin Orders",
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string; from?: string; to?: string }>
}

export default async function AdminOrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { status, from, to } = await searchParams
  const isAr = locale === "ar"

  let orders = await getOrdersByAdmin()

  if (status) {
    orders = orders.filter((o) => o.status === status)
  }
  if (from) {
    const fromDate = new Date(from)
    orders = orders.filter((o) => new Date(o.createdAt) >= fromDate)
  }
  if (to) {
    const toDate = new Date(to)
    toDate.setHours(23, 59, 59, 999)
    orders = orders.filter((o) => new Date(o.createdAt) <= toDate)
  }

  const statuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ] as const

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{isAr ? "إدارة الطلبات" : "Orders Management"}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {isAr ? "الحالة:" : "Status:"}
          </span>
          <div className="flex flex-wrap gap-1">
            <Link
              href={`/${locale}/admin/orders`}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                !status ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {isAr ? "الكل" : "All"}
            </Link>
            {statuses.map((s) => (
              <Link
                key={s}
                href={`/${locale}/admin/orders?status=${s}`}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  status === s ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {isAr
                  ? ({
                      PENDING: "قيد الانتظار",
                      CONFIRMED: "مؤكد",
                      PROCESSING: "قيد المعالجة",
                      SHIPPED: "تم الشحن",
                      DELIVERED: "تم التوصيل",
                      CANCELLED: "ملغي",
                    }[s] || s)
                  : s.charAt(0) + s.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
        </div>
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
                {isAr ? "المشتري" : "Buyer"}
              </th>
              <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                {isAr ? "العناصر" : "Items"}
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
                  <td className="px-4 py-3 font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{order.buyer.fullName}</p>
                      <p className="text-xs text-muted-foreground">{order.buyer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {order.items.length} {isAr ? "عنصر" : "item"}
                    {order.items.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(order.total), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusDropdown
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={`/${locale}/admin/orders/${order.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {isAr ? "عرض" : "View"}
                    </Link>
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
