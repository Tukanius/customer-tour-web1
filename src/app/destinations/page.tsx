import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { DestinationGrid, EmptyCatalog } from "@/components/CatalogGrids";
import { uiCopy } from "@/data/uiCopy";
import { listDestinations } from "@/lib/catalog";

export const metadata: Metadata = {
  title: uiCopy.destinations.title,
  description: uiCopy.destinations.lede,
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {uiCopy.destinations.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">{uiCopy.destinations.lede}</p>
      <div className="mt-10">
        <Suspense fallback={<CardSkeleton />}>
          <DestinationsBody />
        </Suspense>
      </div>
    </div>
  );
}

async function DestinationsBody() {
  const result = await listDestinations();
  if (result.status === "error") {
    return <StatusCard title={uiCopy.status.unreachable} body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="destinations" />;
  }
  return <DestinationGrid items={result.items} />;
}
