export type DateRange = "daily" | "weekly" | "monthly" | "yearly";

export interface RevenueData {
  period: string;
  total: number;
}

export interface TopSellerProduct {
  productId: string;
  titleAr: string;
  titleEn: string;
  unitsSold: number;
  revenue: number;
}

export async function getRevenue(_range: DateRange): Promise<RevenueData[]> {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    return {
      period: d.toISOString().split("T")[0],
      total: Math.floor(Math.random() * 500000) + 100000,
    };
  });
}

export async function getTopProducts(
  limit = 10
): Promise<Array<{ productId: string; title: string; revenue: number }>> {
  return Array.from({ length: limit }, (_, i) => ({
    productId: `mock-prod-${i + 1}`,
    title: `Product ${i + 1}`,
    revenue: Math.floor(Math.random() * 300000) + 50000,
  }));
}

export async function getSellerRevenue(
  _sellerId: string,
  days = 7
): Promise<RevenueData[]> {
  const now = new Date();
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getTime() - (days - 1 - i) * 24 * 60 * 60 * 1000);
    return {
      period: d.toISOString().split("T")[0],
      total: Math.floor(Math.random() * 200000) + 50000,
    };
  });
}

export async function getTopSellerProducts(
  _sellerId: string,
  limit = 5
): Promise<TopSellerProduct[]> {
  return Array.from({ length: limit }, (_, i) => ({
    productId: `mock-prod-${i + 1}`,
    titleAr: `منتج ${i + 1}`,
    titleEn: `Product ${i + 1}`,
    unitsSold: Math.floor(Math.random() * 50) + 5,
    revenue: Math.floor(Math.random() * 200000) + 30000,
  }));
}

export async function getNewOrderCount(_sellerId: string): Promise<number> {
  return 3;
}
