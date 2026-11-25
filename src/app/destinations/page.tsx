import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageBody, CatalogPageSkeleton } from "@/components/CatalogPage";
import { listDestinations } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Places the Nomad Atlas desk has published — dunes, parks, and grassland, as they stand in admin.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Destinations
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        The map, place by place.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Only published destinations appear here. Add a place to your trip, then
        send a request from the home form.
      </p>
      <div className="mt-10">
        <Suspense fallback={<CatalogPageSkeleton />}>
          <DestinationsBody />
        </Suspense>
      </div>
    </div>
  );
}

async function DestinationsBody() {
  const result = await listDestinations();
  return <CatalogPageBody result={result} resource="destinations" />;
}
