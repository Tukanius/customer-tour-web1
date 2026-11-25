import type { CatalogKind, CatalogResult, CatalogItem } from "@/types/catalog";
import { CatalogBoard, CatalogStatus } from "./CatalogBoard";
import { CatalogSkeletonCard } from "./CatalogCard";

const PREVIEW_COUNT = 3;

const KIND_META = {
  destinations: {
    eyebrow: "Destinations",
    title: "Places the desk has published.",
    hrefBase: "/destinations" as const,
    kind: "destination" as const,
    empty: "No destinations are published in admin yet.",
  },
  tours: {
    eyebrow: "Tours",
    title: "Set routes, when they are live.",
    hrefBase: "/tours" as const,
    kind: "tour" as const,
    empty: "No tours are published in admin yet.",
  },
  vehicles: {
    eyebrow: "Car rent",
    title: "4x4s on the board.",
    hrefBase: "/car-rent" as const,
    kind: "vehicle" as const,
    empty: "No vehicles are published in admin yet.",
  },
};

export function CatalogSection({
  result,
  resource,
  id,
  preview,
}: {
  result: CatalogResult<CatalogItem>;
  resource: CatalogKind;
  id?: string;
  preview?: boolean;
}) {
  const meta = KIND_META[resource];
  return (
    <section
      id={id}
      className="scroll-mt-24 border-b border-line bg-paper py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          {meta.eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {meta.title}
        </h2>
        <div className="mt-10">
          {result.status === "error" ? (
            <CatalogStatus title="The desk is unreachable" body={result.message} />
          ) : result.status === "empty" ? (
            <CatalogStatus title="Nothing published" body={meta.empty} />
          ) : (
            <CatalogBoard
              items={result.items}
              hrefBase={meta.hrefBase}
              kind={meta.kind}
              previewCount={preview ? PREVIEW_COUNT : undefined}
              moreHref={preview ? meta.hrefBase : undefined}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export function CatalogGridSkeleton() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index}>
          <CatalogSkeletonCard />
        </li>
      ))}
    </ul>
  );
}
