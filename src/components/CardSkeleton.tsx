import { uiCopy } from "@/data/uiCopy";

export const catalogGridClass =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>li]:h-full [&>li>article]:h-full";

function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-mist" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-mist" />
        <div className="h-10 animate-pulse rounded bg-mist/70" />
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className={catalogGridClass} aria-busy="true" aria-label={uiCopy.status.loading}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}
