import type { Metadata } from "next"
import { getOrdersByAdmin } from "@/services/order.service"
import { formatPrice } from "@/lib/utils"
import { Link } from "@/i18n/routing"
import {
  ShoppingBag,
  Users,
  Package,
  CreditCard,
  AlertTriangle,
  Clock,
  UserPlus,
} from "lucide-react"
import OrderStatusDropdown from "@/components/admin/order-status-dropdown"
import PendingProductActions from "@/components/admin/pending-product-actions"
import Image from "next/image"

export const metadata: Metadata = { title: "Admin Dashboard" }

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function AdminDashboardPage({ params }: PageProps) {
  const { locale } = await params
  const isAr = locale === "ar"

  const orders = await getOrdersByAdmin();
  const productsCount = 45;
  const usersCount = 120;
  const totalRevenue = { _sum: { total: 2500000 } };
  const pendingProducts = [
    {
      id: "mock-pending-1",
      titleAr: "منتج بانتظار الموافقة",
      titleEn: "Pending Product",
      price: 50000,
      images: [{ url: "/placeholder.svg" }],
      seller: { fullName: "Demo Seller" },
    },
  ];
  const lowStockProducts = 3;
  const newUsersThisWeek = 8;

  const statsCards = [
    {
      label: isAr ? "إجمالي الإيرادات" : "Total Revenue",
      value: formatPrice(Number(totalRevenue._sum.total || 0), isAr ? "ar-IQ" : "en-IQ"),
      icon: CreditCard,
      color: "text-green-600",
      bg: "bg-green-50",
      href: `/${locale}/admin/orders`,
    },
    {
      label: isAr ? "إجمالي الطلبات" : "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: `/${locale}/admin/orders`,
    },
    {
      label: isAr ? "المنتجات" : "Products",
      value: productsCount,
      icon: Package,
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: `/${locale}/admin/products`,
    },
    {
      label: isAr ? "المستخدمين" : "Users",
      value: usersCount,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: `/${locale}/admin/users`,
    },
  ]

  const quickStats = [
    {
      label: isAr ? "منتجات pending" : "Pending Products",
      value: pendingProducts.length,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      href: `/${locale}/admin/products`,
    },
    {
      label: isAr ? "مخزون منخفض" : "Low Stock",
      value: lowStockProducts,
      icon: AlertTriangle,
      color: "text-red-600",
      bg: "bg-red-50",
      href: `/${locale}/admin/products`,
    },
    {
      label: isAr ? "مستخدمين جدد (أسبوع)" : "New Users (Week)",
      value: newUsersThisWeek,
      icon: UserPlus,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      href: `/${locale}/admin/users`,
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{isAr ? "نظرة عامة على المنصة" : "Platform Overview"}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{String(stat.value)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`rounded-lg p-2 ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-bold">{isAr ? "أحدث الطلبات" : "Recent Orders"}</h3>
          <Link
            href={`/${locale}/admin/orders`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isAr ? "عرض الكل" : "View All"}
          </Link>
        </div>
        <div className="overflow-x-auto">
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
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">{order.buyer.fullName}</td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(order.total), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusDropdown
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
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
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    {isAr ? "لا توجد طلبات" : "No orders yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Products */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="font-bold">
            {isAr ? "منتجات بانتظار الموافقة" : "Pending Products"}
            {pendingProducts.length > 0 && (
              <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                {pendingProducts.length}
              </span>
            )}
          </h3>
          <Link
            href={`/${locale}/admin/products`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {isAr ? "عرض الكل" : "View All"}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                  {isAr ? "الصورة" : "Image"}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                  {isAr ? "المنتج" : "Product"}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                  {isAr ? "البائع" : "Seller"}
                </th>
                <th className="px-4 py-3 text-start text-xs font-medium text-muted-foreground uppercase">
                  {isAr ? "السعر" : "Price"}
                </th>
                <th className="px-4 py-3 text-end text-xs font-medium text-muted-foreground uppercase">
                  {isAr ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pendingProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                      {product.images[0]?.url && (
                        <Image
                          src={product.images[0].url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {isAr ? product.titleAr : product.titleEn}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {product.seller.fullName}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(Number(product.price), isAr ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <PendingProductActions productId={product.id} />
                  </td>
                </tr>
              ))}
              {pendingProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    {isAr
                      ? "لا توجد منتجات بانتظار الموافقة"
                      : "No pending products to review"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
