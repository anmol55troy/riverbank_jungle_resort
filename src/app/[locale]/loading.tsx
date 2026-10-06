/**
 * Instant navigation feedback.
 *
 * Without a loading boundary the App Router holds the *previous* page on
 * screen until the next one's data resolves, so a click reads as "nothing
 * happened". This paints immediately on navigation.
 */
export default function Loading() {
  return (
    <div className="grain flex min-h-[60vh] items-center justify-center bg-ivory px-4" role="status">
      <div className="w-full max-w-3xl animate-pulse">
        <div className="mx-auto h-2.5 w-28 rounded bg-sage/50" />
        <div className="mx-auto mt-6 h-9 w-3/4 rounded bg-sage/40" />
        <div className="mx-auto mt-3 h-9 w-1/2 rounded bg-sage/30" />
        <div className="mx-auto mt-8 h-px w-40 bg-gold" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  )
}
