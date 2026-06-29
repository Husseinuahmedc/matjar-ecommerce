import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderById } from "@/services/order.service";
import { OrderDetailClient } from "./order-detail-client";

export const metadata: Metadata = {
  title: "تفاصيل الطلب | Order Details",
};

const STATUS_ORDER = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function BuyerOrderDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  const order = await getOrderById(id, "demo-user", "BUYER");

  if (!order) notFound();

  const reviewedProductIds: string[] = [];
  const currentStepIndex = STATUS_ORDER.indexOf(order.status);

  return (
    <OrderDetailClient
      order={JSON.parse(JSON.stringify(order))}
      reviewedProductIds={reviewedProductIds}
      locale={locale}
      currentStepIndex={currentStepIndex}
      statusOrder={STATUS_ORDER}
    />
  );
}
