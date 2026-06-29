import { formatPrice } from "@/lib/utils"

interface TopProductsProps {
  products: Array<{
    productId: string
    titleAr: string
    titleEn: string
    unitsSold: number
    revenue: number
  }>
  locale: string
}

export default function TopProducts({ products, locale }: TopProductsProps) {
  const isAr = locale === "ar"
  const localePrice = isAr ? "ar-IQ" : "en-IQ"

  return (
    <div className="bg-card rounded-xl border shadow-sm">
      <div className="p-6 border-b">
        <h3 className="font-bold">
          {isAr ? "المنتجات الأكثر مبيعاً" : "Top Selling Products"}
        </h3>
      </div>
      <div className="divide-y">
        {products.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {isAr ? "لا توجد بيانات مبيعات بعد" : "No sales data yet"}
          </p>
        ) : (
          products.map((product, index) => (
            <div key={product.productId} className="p-4 flex items-center gap-4">
              <span className="text-sm font-bold text-muted-foreground w-6 text-center">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {isAr ? product.titleAr : product.titleEn}
                </p>
                <p className="text-xs text-muted-foreground">
                  {product.unitsSold} {isAr ? "قطعة" : "units"}
                </p>
              </div>
              <div className="text-end">
                <p className="font-bold text-sm">
                  {formatPrice(product.revenue, localePrice)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
