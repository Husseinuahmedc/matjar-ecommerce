import { Skeleton } from "@/components/ui/base";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-8 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <Skeleton className="h-12 w-full rounded-t-xl" />
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}