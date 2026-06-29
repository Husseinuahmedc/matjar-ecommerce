export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 animate-pulse space-y-8">
      <div className="h-8 bg-muted rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-muted rounded-xl" />
        ))}
      </div>
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
    </div>
  );
}
