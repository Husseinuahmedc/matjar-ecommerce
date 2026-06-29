import { Skeleton } from "@/components/ui/base";

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto space-y-6 p-8">
        <div className="space-y-2 text-center">
          <Skeleton className="h-8 w-48 mx-auto rounded-lg" />
          <Skeleton className="h-4 w-32 mx-auto rounded" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}