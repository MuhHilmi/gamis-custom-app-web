function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-lg bg-putih shadow-sm ring-1 ring-garis">
      <div className="aspect-[4/5] w-full animate-pulse bg-krem-tua" />
      <div className="space-y-2 p-3">
        <div className="h-4 animate-pulse rounded bg-krem-tua" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-krem-tua" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-krem-tua" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-5 flex gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-11 w-24 animate-pulse rounded-full bg-krem-tua" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </section>
  );
}