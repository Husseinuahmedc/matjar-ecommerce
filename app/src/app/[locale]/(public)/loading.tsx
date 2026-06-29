import { Skeleton } from "@/components/ui/base";

export default function PublicLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse space-y-8">
      <Skeleton className="h-10 w-48 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}