export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/60 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <div className="h-6 w-32 rounded bg-muted" />
            <div className="hidden gap-5 sm:flex">
              <div className="h-4 w-16 rounded bg-muted" />
              <div className="h-4 w-20 rounded bg-muted" />
              <div className="h-4 w-14 rounded bg-muted" />
              <div className="h-4 w-18 rounded bg-muted" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 rounded bg-muted" />
              <div className="h-9 w-9 rounded bg-muted" />
            </div>
          </div>
        </header>

        {/* Hero skeleton */}
        <section className="border-b">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2">
            <div className="space-y-4">
              <div className="h-10 w-3/4 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="mt-6 flex gap-3">
                <div className="h-10 w-32 rounded bg-muted" />
                <div className="h-10 w-40 rounded bg-muted" />
              </div>
            </div>
            <div className="aspect-square w-full rounded-lg bg-muted" />
          </div>
        </section>

        {/* Content skeleton */}
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="space-y-6">
            <div className="rounded-lg border p-6">
              <div className="mb-4 h-6 w-32 rounded bg-muted" />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-32 rounded bg-muted" />
                <div className="h-32 rounded bg-muted" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
