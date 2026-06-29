import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getBuyerDashboard } from "@/lib/data/buyer";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { ShoppingBag, Clock, CheckCircle, DollarSign, Package, ArrowLeft, Eye } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { BuyerSidebar } from "@/components/dashboard/BuyerSidebar";
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav";
import { DashboardAnimationWrapper } from "./dashboard-animation-wrapper";

const iconSize = "h-4 w-4 text-muted-foreground";

export const metadata: Metadata = {
  title: "Buyer Dashboard",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
  SHIPPED: "bg-orange-100 text-orange-800 border-orange-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
};

export default async function BuyerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");

  const data = await getBuyerDashboard();

  return (
    <div className="flex">
      <div className="hidden md:block">
        <BuyerSidebar />
      </div>
      <MobileDashboardNav />

      <DashboardAnimationWrapper>
        <div className="container mx-auto px-4 py-8 space-y-8 pb-20 md:pb-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground">
              {t("welcomeBack", { name: data.profile.fullName || "" })}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard
              title={t("totalOrders")}
              value={data.stats.totalOrders}
              icon={<ShoppingBag className={iconSize} />}
              description={t("sinceJoining")}
            />
            <DashboardCard
              title={t("pendingOrders")}
              value={data.stats.pendingOrders}
              icon={<Clock className={iconSize} />}
              description={t("awaitingAction")}
            />
            <DashboardCard
              title={t("deliveredOrders")}
              value={data.stats.deliveredOrders}
              icon={<CheckCircle className={iconSize} />}
              description={t("successfullyReceived")}
            />
            <DashboardCard
              title={locale === "ar" ? "إجمالي الإنفاق" : "Total Spent"}
              value={data.stats.totalSpent}
              icon={<DollarSign className={iconSize} />}
              description={locale === "ar" ? "الإنفاق الكلي" : "Lifetime spending"}
            />
          </div>

          {/* Recent Orders + Quick Actions */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Orders */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold tracking-tight">{t("recentOrders")}</h2>
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {data.recentOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground">{locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}</p>
                    <Link href="/products" className="text-primary hover:underline mt-2 inline-block text-sm">
                      {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-start p-4 font-medium text-muted-foreground">
                            {locale === "ar" ? "رقم الطلب" : "Order ID"}
                          </th>
                          <th className="text-start p-4 font-medium text-muted-foreground">
                            {locale === "ar" ? "المنتجات" : "Items"}
                          </th>
                          <th className="text-start p-4 font-medium text-muted-foreground">
                            {locale === "ar" ? "الإجمالي" : "Total"}
                          </th>
                          <th className="text-start p-4 font-medium text-muted-foreground">
                            {locale === "ar" ? "الحالة" : "Status"}
                          </th>
                          <th className="text-start p-4 font-medium text-muted-foreground">
                            {locale === "ar" ? "التاريخ" : "Date"}
                          </th>
                          <th className="text-end p-4 font-medium text-muted-foreground"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {data.recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-medium">
                              #{order.id.slice(-8).toUpperCase()}
                            </td>
                            <td className="p-4">
                              <span className="text-muted-foreground">
                                {order.items.length} {locale === "ar" ? "منتج" : "item"}{order.items.length !== 1 ? "s" : ""}
                              </span>
                            </td>
                            <td className="p-4 font-medium">
                              {formatPrice(Number(order.total), locale === "ar" ? "ar-IQ" : "en-IQ")}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status] || ""}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">
                              {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-IQ")}
                            </td>
                            <td className="p-4 text-end">
                              <Link
                                href={`/orders/${order.id}`}
                                className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
                              >
                                <Eye className="h-3 w-3" />
                                {locale === "ar" ? "عرض" : "View"}
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {data.recentOrders.length > 0 && (
                  <div className="border-t p-3 text-center">
                    <Link href="/orders" className="text-sm text-primary hover:underline">
                      {locale === "ar" ? "عرض جميع الطلبات" : "View All Orders"}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">
                {locale === "ar" ? "إجراءات سريعة" : "Quick Actions"}
              </h2>
              <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
                <Link
                  href="/products"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{locale === "ar" ? "تصفح المنتجات" : "Browse Products"}</p>
                    <p className="text-xs text-muted-foreground">{locale === "ar" ? "اكتشف منتجات جديدة" : "Discover new products"}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{locale === "ar" ? "جميع الطلبات" : "All Orders"}</p>
                    <p className="text-xs text-muted-foreground">{locale === "ar" ? "عرض تاريخ طلباتك" : "View your order history"}</p>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
                </Link>

                {data.hasShippedOrders && (
                  <Link
                    href="/orders?status=SHIPPED"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{locale === "ar" ? "تتبع الطلب" : "Track Order"}</p>
                      <p className="text-xs text-muted-foreground">{locale === "ar" ? "تتبع حالة الشحن" : "Track shipping status"}</p>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 rtl:rotate-180 transition-transform" />
                  </Link>
                )}
              </div>

              {/* Account Summary */}
              <div className="rounded-xl border bg-card shadow-sm p-6">
                <h3 className="font-bold mb-3">{t("accountSummary")}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("totalSpent")}</span>
                    <span className="font-medium">{formatPrice(data.profile.totalSpent, locale === "ar" ? "ar-IQ" : "en-IQ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("rewardPoints")}</span>
                    <span className="font-medium">{data.profile.rewardPoints} {t("pts")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("memberSince")}</span>
                    <span className="font-medium">
                      {data.profile.memberSince
                        ? new Date(data.profile.memberSince).toLocaleDateString(locale === "ar" ? "ar-IQ" : "en-IQ")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardAnimationWrapper>
    </div>
  );
}
