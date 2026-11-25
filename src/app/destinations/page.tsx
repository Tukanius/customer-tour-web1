import type { Metadata } from "next";
import { Suspense } from "react";
import { DestinationGrid, EmptyCatalog, GridSkeleton } from "@/components/CatalogGrids";
import { StatusCard } from "@/components/PhotoCard";
import { listDestinations } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Published places on the Nomad Atlas map.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
        Destinations
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        The map, place by place.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Open a card for photos and the map. Direct links stay available for search.
      </p>
      <div className="mt-10">
        <Suspense fallback={<GridSkeleton />}>
          <DestinationsBody />
        </Suspense>
      </div>
    </div>
  );
}

async function DestinationsBody() {
  const result = await listDestinations();
  if (result.status === "error") {
    return <StatusCard title="The desk is unreachable" body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="destinations" />;
  }
  return <DestinationGrid items={result.items} />;
}
