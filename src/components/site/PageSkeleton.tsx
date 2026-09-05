import { Skeleton } from "@/components/ui/States";

/**
 * Shared public-page loading shape.
 *
 * Deliberately NOT placed at the (site) route-group root: a loading.tsx there
 * wraps every child page in a Suspense boundary, which flushes the response
 * shell with HTTP 200 before a page body can call notFound(). That turned
 * /services/<unknown-slug> into a soft 404. Boundaries live on leaf segments
 * that never call notFound() instead.
 */
export function PageSkeleton() {
  return (
    <div className="container-page py-16 md:py-24" aria-busy="true">
      <span className="sr-only">Loading page</span>
      <Skeleton className="h-3 w-32 rounded-pill" />
      <Skeleton className="mt-5 h-12 w-3/4" />
      <Skeleton className="mt-3 h-5 w-1/2" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
