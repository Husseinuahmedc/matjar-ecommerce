import { Skeleton } from "@/components/ui/base"

export default function SupportOrderDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-8 w-48 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-24 rounded" />
            </div>
            <div className="divide-y">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-48 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-6 w-32 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}