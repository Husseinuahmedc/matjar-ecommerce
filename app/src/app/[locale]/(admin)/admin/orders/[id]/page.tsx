import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/order.service";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import OrderStatusDropdown from "@/components/admin/order-status-dropdown";
import { Badge } from "@/components/ui";
import { ArrowLeft, ArrowRight, Package, CreditCard, User, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Details | Admin",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CONFIRMED: "bg-blue-100 text-blue-800 border-blue-200",
  PROCESSING: "bg-purple-100 text-purple-800 border-purple-200",
  SHIPPED: "bg-orange-100 text-orange-800 border-orange-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-gray-100 text-gray-800 border-gray-200",
};

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations("admin");
  const isAr = locale === "ar";

  const order = await getOrderById(id, "demo-user", "ADMIN");

  if (!order) notFound();

  const statusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      PENDING: { ar: "قيد الانتظار", en: "Pending" },
      CONFIRMED: { ar: "مؤكد", en: "Confirmed" },
      PROCESSING: { ar: "قيد المعالجة", en: "Processing" },
      SHIPPED: { ar: "تم الشحن", en: "Shipped" },
      DELIVERED: { ar: "تم التوصيل", en: "Delivered" },
      COMPLETED: { ar: "مكتمل", en: "Completed" },
      CANCELLED: { ar: "ملغي", en: "Cancelled" },
      REFUNDED: { ar: "مسترجع", en: "Refunded" },
    };
    return isAr ? labels[status]?.ar || status : labels[status]?.en || status;
  };

  const paymentStatusLabel = (status: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      PENDING: { ar: "قيد الانتظار", en: "Pending" },
      PAID: { ar: "مدفوع", en: "Paid" },
      FAILED: { ar: "فشل", en: "Failed" },
      REFUNDED: { ar: "مسترجع", en: "Refunded" },
    };
    return isAr ? labels[status]?.ar || status : labels[status]?.en || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/orders`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {isAr ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Link>
            <h1 className="text-2xl font-bold">{t("orderDetails")}</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            #{order.id.slice(-8).toUpperCase()} — {new Date(order.createdAt).toLocaleDateString(isAr ? "ar-IQ" : "en-IQ")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-800"}`}>
            {statusLabel(order.status)}
          </span>
          <OrderStatusDropdown orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold">{isAr ? "عناصر الطلب" : "Order Items"}</h3>
              <Badge variant="secondary" className="ml-auto">{order.items.length} {isAr ? "عنصر" : "items"}</Badge>
            </div>
            <div className="divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{isAr ? item.product.titleAr : item.product.titleEn}</p>
                    <p className="text-sm text-muted-foreground">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantity} × {formatPrice(Number(item.unitPrice), isAr ? "ar-IQ" : "en-IQ")}
                  </div>
                  <div className="font-bold text-sm">
                    {formatPrice(Number(item.unitPrice) * item.quantity, isAr ? "ar-IQ" : "en-IQ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.events && order.events.length > 0 && (
            <div className="rounded-xl border bg-card shadow-sm p-6">
              <h3 className="font-bold mb-4">{t("orderTimeline")}</h3>
              <div className="space-y-4">
                {order.events.map((event, idx) => (
                  <div key={event.id} className="flex gap-3 relative">
                    {idx < order.events.length - 1 && (
                      <div className="absolute start-[11px] top-6 bottom-[-16px] w-0.5 bg-muted" />
                    )}
                    <div className={`h-6 w-6 rounded-full border-2 shrink-0 z-10 bg-background ${idx === 0 ? "border-primary" : "border-muted"}`} />
                    <div>
                      <p className={`font-medium text-sm ${idx === 0 ? "text-primary" : "text-foreground"}`}>
                        {statusLabel(event.status)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString(isAr ? "ar-IQ" : "en-IQ")}
                      </p>
                      {event.note && (
                        <p className="text-sm text-muted-foreground italic mt-1">{event.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              {t("totalAmount")}
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>{formatPrice(Number(order.subtotal), isAr ? "ar-IQ" : "en-IQ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shippingCost")}</span>
                <span>{formatPrice(Number(order.shippingCost), isAr ? "ar-IQ" : "en-IQ")}</span>
              </div>
              {Number(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t("discount")}</span>
                  <span>-{formatPrice(Number(order.discount), isAr ? "ar-IQ" : "en-IQ")}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>{t("totalAmount")}</span>
                <span className="text-primary">{formatPrice(Number(order.total), isAr ? "ar-IQ" : "en-IQ")}</span>
              </div>
            </div>
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t("paymentStatus")}</span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PAYMENT_STATUS_STYLES[order.paymentStatus] || "bg-gray-100 text-gray-800"}`}>
                {paymentStatusLabel(order.paymentStatus)}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              {t("buyer")}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.buyer.fullName}</p>
              <p className="text-muted-foreground">{order.buyer.email}</p>
              {order.buyer.phone && (
                <p className="text-muted-foreground">{order.buyer.phone}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <h3 className="font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              {isAr ? "عنوان الشحن" : "Shipping Address"}
            </h3>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p className="text-muted-foreground pt-1">{order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}