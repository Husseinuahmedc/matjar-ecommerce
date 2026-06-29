import { Skeleton } from "@/components/ui/base";

export default function SupportLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 rounded-lg" />
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Skeleton className="h-12 w-full" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 w-full rounded-none" />
        ))}
      </div>
    </div>
  );
}