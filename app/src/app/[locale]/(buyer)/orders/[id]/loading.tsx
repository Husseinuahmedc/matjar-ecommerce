import { Skeleton } from "@/components/ui/base";

export default function OrderDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-lg" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <Skeleton className="h-12 w-full rounded-t-xl" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}