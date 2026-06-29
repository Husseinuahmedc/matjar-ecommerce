import { Skeleton } from "@/components/ui/base"

export default function WishlistLoading() {
  return (
    <div className="flex">
      <div className="hidden w-64 border-r bg-card md:block" />
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}