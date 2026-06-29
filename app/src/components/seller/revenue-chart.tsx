"use client"

import { useLocale } from "next-intl"
import { formatPrice } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface RevenueChartProps {
  data: Array<{ period: string; total: number }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const locale = useLocale()
  const isAr = locale === "ar"
  const localePrice = isAr ? "ar-IQ" : "en-IQ"

  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.period).toLocaleDateString(isAr ? "ar-IQ" : "en-IQ", {
      month: "short",
      day: "numeric",
    }),
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        {isAr ? "لا توجد بيانات مبيعات بعد" : "No sales data yet"}
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-muted-foreground"
            tickFormatter={(value: number) =>
              new Intl.NumberFormat(isAr ? "ar-IQ" : "en-IQ", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            formatter={(value) => [formatPrice(Number(value) || 0, localePrice), isAr ? "المبيعات" : "Revenue"]}
            labelFormatter={() => isAr ? "التاريخ" : "Date"}
          />
          <Bar
            dataKey="total"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
