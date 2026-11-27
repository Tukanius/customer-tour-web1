"use client";

import { uiCopy } from "@/data/uiCopy";
import type { CatalogItem, CatalogKind } from "@/types/catalog";
import { CardSkeleton, CatalogCard, StatusCard } from "./CatalogCard";

const GRID =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>li]:h-full [&>li>article]:h-full";

export function CatalogGrid({
  items,
  kind,
}: {
  items: CatalogItem[];
  kind: CatalogKind;
}) {
  return (
    <ul className={GRID}>
      {items.map((item) => (
        <li key={item.id}>
          <CatalogCard item={item} kind={kind} />
        </li>
      ))}
    </ul>
  );
}

export function DestinationGrid({ items }: { items: CatalogItem[] }) {
  return <CatalogGrid items={items} kind="destinations" />;
}

export function TourGrid({ items }: { items: CatalogItem[] }) {
  return <CatalogGrid items={items} kind="tours" />;
}

export function VehicleGrid({ items }: { items: CatalogItem[] }) {
  return <CatalogGrid items={items} kind="vehicles" />;
}

export function EmptyCatalog({ kind }: { kind: CatalogKind }) {
  const body =
    kind === "tours"
      ? uiCopy.tours.empty
      : kind === "vehicles"
        ? uiCopy.cars.empty
        : uiCopy.destinations.empty;
  return <StatusCard title={uiCopy.status.emptyTitle} body={body} />;
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className={GRID}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CardSkeleton />
        </li>
      ))}
    </ul>
  );
}
