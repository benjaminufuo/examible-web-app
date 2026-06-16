// Invisible fallback - Suspense requires it but user won't see it if chunks are prefetched
export default function InvisibleFallback() {
  return null; // Nothing shown while loading
}
