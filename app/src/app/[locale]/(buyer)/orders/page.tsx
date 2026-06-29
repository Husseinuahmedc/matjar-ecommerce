import type { Metadata } from "next";
import { getOrdersByBuyer } from "@/services/order.service";
import { OrdersListClient } from "./orders-list-client";

export const metadata: Metadata = {
  title: "طلباتي | My Orders",
};

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export default async function BuyerOrdersPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { status } = await searchParams;

  const orders = await getOrdersByBuyer("demo-user");
  const reviewedProductIds: string[] = [];

  return <OrdersListClient
    orders={JSON.parse(JSON.stringify(orders))}
    reviewedProductIds={reviewedProductIds}
    locale={locale}
    statusFilter={status || "all"}
  />;
}
