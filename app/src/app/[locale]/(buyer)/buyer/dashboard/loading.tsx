import { Skeleton } from "@/components/ui/base";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-64 border-r bg-card md:block" />

      <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-8 w-16 rounded-md" />
                <Skeleton className="h-3 w-28 rounded-md" />
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Orders Skeleton */}
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-48 rounded-md" />
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-4 w-14 rounded-md" />
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-4 w-16 rounded-md ml-auto" />
                      <Skeleton className="h-8 w-10 rounded-md ml-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions + Account Summary Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-8 w-40 rounded-md" />
              <div className="rounded-xl border bg-card shadow-sm p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-28 rounded-md" />
                      <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-card shadow-sm p-6 space-y-3">
                <Skeleton className="h-5 w-32 rounded-md" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-4 w-14 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Wishlist Skeleton */}
          <div className="space-y-4 pt-4 border-t">
            <Skeleton className="h-8 w-24 rounded-md" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden">
                  <Skeleton className="aspect-square w-full rounded-none" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 flex-1 rounded-md" />
                      <Skeleton className="h-9 w-10 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
