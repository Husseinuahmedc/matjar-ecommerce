import { Skeleton } from "@/components/ui/base";

export default function OrdersLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </main>
  );
}
