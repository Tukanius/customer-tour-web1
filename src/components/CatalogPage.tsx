import type { CatalogKind, CatalogResult, CatalogItem } from "@/types/catalog";
import { CatalogBoard, CatalogStatus } from "./CatalogBoard";
import { CatalogGridSkeleton } from "./CatalogSection";

const COPY = {
  destinations: {
    kind: "destination" as const,
    hrefBase: "/destinations" as const,
    empty: "No destinations are published in admin yet.",
  },
  tours: {
    kind: "tour" as const,
    hrefBase: "/tours" as const,
    empty: "No tours are published in admin yet.",
  },
  vehicles: {
    kind: "vehicle" as const,
    hrefBase: "/car-rent" as const,
    empty: "No vehicles are published in admin yet.",
  },
};

export function CatalogPageBody({
  result,
  resource,
}: {
  result: CatalogResult<CatalogItem>;
  resource: CatalogKind;
}) {
  const meta = COPY[resource];
  if (result.status === "error") {
    return <CatalogStatus title="The desk is unreachable" body={result.message} />;
  }
  if (result.status === "empty") {
    return <CatalogStatus title="Nothing published" body={meta.empty} />;
  }
  return (
    <CatalogBoard
      items={result.items}
      hrefBase={meta.hrefBase}
      kind={meta.kind}
    />
  );
}

export function CatalogPageSkeleton() {
  return <CatalogGridSkeleton />;
}
