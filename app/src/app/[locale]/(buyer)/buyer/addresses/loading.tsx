import { Skeleton } from "@/components/ui/base"

export default function AddressesLoading() {
  return (
    <div className="flex">
      <div className="hidden w-64 border-r bg-card md:block" />
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}