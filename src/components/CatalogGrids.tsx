"use client";

import type { CatalogItem } from "@/types/catalog";
import { DestinationCard, TourCard, VehicleCard, StatusCard, CardSkeleton } from "./PhotoCard";

export function DestinationGrid({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <DestinationCard item={item} />
        </li>
      ))}
    </ul>
  );
}

export function TourGrid({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <TourCard item={item} />
        </li>
      ))}
    </ul>
  );
}

export function VehicleGrid({ items }: { items: CatalogItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <VehicleCard item={item} />
        </li>
      ))}
    </ul>
  );
}

export function EmptyCatalog({ kind }: { kind: "tours" | "destinations" | "vehicles" }) {
  const copy = {
    tours: "No tours are published yet.",
    destinations: "No destinations are published yet.",
    vehicles: "No vehicles are published yet.",
  };
  return <StatusCard title="Nothing published" body={copy[kind]} />;
}

export function GridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          <CardSkeleton />
        </li>
      ))}
    </ul>
  );
}
