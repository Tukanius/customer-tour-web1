import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyCatalog, GridSkeleton, TourGrid } from "@/components/CatalogGrids";
import { StatusCard } from "@/components/PhotoCard";
import { listTours } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tours",
  description: "Published tour templates from the Nomad Atlas desk.",
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
        Tours
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Set routes, when they are live.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Full itineraries live on each tour page. Destinations inside a route open
        as a sheet.
      </p>
      <div className="mt-10">
        <Suspense fallback={<GridSkeleton />}>
          <ToursBody />
        </Suspense>
      </div>
    </div>
  );
}

async function ToursBody() {
  const result = await listTours();
  if (result.status === "error") {
    return <StatusCard title="The desk is unreachable" body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="tours" />;
  }
  return <TourGrid items={result.items} />;
}
