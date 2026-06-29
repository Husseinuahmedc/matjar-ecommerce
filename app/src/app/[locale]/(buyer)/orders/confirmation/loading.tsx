import { Skeleton } from "@/components/ui/base";

export default function OrderConfirmationLoading() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center space-y-6">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-10 w-64 rounded-lg" />
      <Skeleton className="h-4 w-96 rounded" />
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36 rounded-lg" />
        <Skeleton className="h-12 w-36 rounded-lg" />
      </div>
    </div>
  );
}