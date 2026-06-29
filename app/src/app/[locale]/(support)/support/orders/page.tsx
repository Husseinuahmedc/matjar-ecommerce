import type { Metadata } from "next";
import { getOrdersByAdmin } from "@/services/order.service";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "دعم العملاء | Support Dashboard",
};

export default async function SupportOrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // Support sees all orders (same as admin but read-only in UI)
  const orders = await getOrdersByAdmin();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {locale === "ar" ? "طلبات العملاء (للعرض فقط)" : "Customer Orders (Read-Only)"}
      </h1>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <table className="w-full text-start">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-3 text-start text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {locale === "ar" ? "رقم الطلب" : "Order ID"}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {locale === "ar" ? "العميل" : "Customer"}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {locale === "ar" ? "الحالة" : "Status"}
              </th>
              <th className="px-6 py-3 text-start text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {locale === "ar" ? "المجموع" : "Total"}
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {locale === "ar" ? "الإجراءات" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  {locale === "ar" ? "لا توجد طلبات بعد" : "No orders found yet"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.buyer.fullName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{order.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {formatPrice(Number(order.total), locale === "ar" ? "ar-IQ" : "en-IQ")}
                  </td>
                  <td className="px-6 py-4 text-end text-sm font-medium">
                    <Link href={`/support/orders/${order.id}`} className="text-primary hover:underline">
                      {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
