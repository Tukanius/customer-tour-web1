"use client";

import { uiCopy } from "@/data/uiCopy";
import type { CatalogItem, CatalogKind } from "@/types/catalog";
import { catalogGridClass } from "./CardSkeleton";
import { CatalogCard, StatusCard } from "./CatalogCard";

export function CatalogGrid({
  items,
  kind,
}: {
  items: CatalogItem[];
  kind: CatalogKind;
}) {
  return (
    <ul className={catalogGridClass}>
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
