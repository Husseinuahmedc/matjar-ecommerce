import type { Metadata } from "next";
import { getOrdersBySeller } from "@/services/order.service";
import { getProducts } from "@/services/product.service";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ShoppingBag, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { getSellerRevenue, getTopSellerProducts } from "@/services/analytics.service";
import RevenueChart from "@/components/seller/revenue-chart";
import InventoryAlerts from "@/components/seller/inventory-alerts";
import TopProducts from "@/components/seller/top-products";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = { title: "لوحة تحكم التاجر | Seller Dashboard" };

export default async function SellerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const sellerId = "demo-user";

  const [orders, { data: products }, revenueData, topProducts] = await Promise.all([
    getOrdersBySeller(sellerId),
    getProducts({ sellerId, limit: 1000 }),
    getSellerRevenue(sellerId, 7),
    getTopSellerProducts(sellerId, 5),
  ]);

  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum, o) => {
      const sellerItems = o.items.filter(item => item.product.sellerId === sellerId);
      return sum + sellerItems.reduce((s, item) => s + Number(item.unitPrice) * item.quantity, 0);
    }, 0);

  const totalOrders = orders.length;
  const lowStockProducts = products.filter(p => p.stock < (p.lowStockThreshold || 5));

  const stats = [
    { label: locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue", value: formatPrice(totalRevenue, locale === "ar" ? "ar-IQ" : "en-IQ"), icon: TrendingUp, color: "text-green-600" },
    { label: locale === "ar" ? "إجمالي الطلبات" : "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600" },
    { label: locale === "ar" ? "منتجاتك" : "Total Products", value: products.length, icon: Package, color: "text-orange-600" },
    { label: locale === "ar" ? "تنبيهات المخزون" : "Low Stock Alert", value: lowStockProducts.length, icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        {locale === "ar" ? "لوحة تحكم متجرك" : "Store Dashboard"}
      </h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-xl border p-6 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">
            {locale === "ar" ? "إيرادات آخر 7 أيام" : "Revenue - Last 7 Days"}
          </h3>
        </div>
        <RevenueChart data={revenueData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-card rounded-xl border shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold">
              {locale === "ar" ? "أحدث الطلبات" : "Recent Orders"}
            </h3>
            <Link href="/seller/orders" className="text-primary hover:text-primary/80 text-sm">
              {locale === "ar" ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="divide-y">
            {orders.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
              </p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="p-4 flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{order.buyer.fullName}</p>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-sm">{formatPrice(Number(order.total), locale === "ar" ? "ar-IQ" : "en-IQ")}</p>
                    <Badge variant="secondary" className="text-[10px] py-0">{order.status}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        <InventoryAlerts products={JSON.parse(JSON.stringify(lowStockProducts.slice(0, 5)))} locale={locale} />
      </div>

      {/* Top Products */}
      <TopProducts products={JSON.parse(JSON.stringify(topProducts))} locale={locale} />
    </div>
  );
}
