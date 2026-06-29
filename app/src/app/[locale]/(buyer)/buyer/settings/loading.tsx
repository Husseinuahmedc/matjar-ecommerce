import { Skeleton } from "@/components/ui/base"

export default function SettingsLoading() {
  return (
    <div className="flex">
      <div className="hidden w-64 border-r bg-card md:block" />
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        <div className="container mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-48 rounded-lg" />
          </div>
          <div className="rounded-xl border bg-card shadow-sm divide-y">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-20 rounded-md" />
                  <Skeleton className="h-5 w-40 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}