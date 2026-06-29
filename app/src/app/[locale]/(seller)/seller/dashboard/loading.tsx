import { Skeleton } from "@/components/ui"

export default function SellerDashboardLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl border p-6 space-y-3">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      <Skeleton className="h-80 w-full rounded-xl" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  )
}
