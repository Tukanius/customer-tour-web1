import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyCatalog, GridSkeleton, VehicleGrid } from "@/components/CatalogGrids";
import { StatusCard } from "@/components/PhotoCard";
import { listVehicles } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Car Rental",
  description: "Published 4x4s from the Nomad Atlas desk.",
};

export default function CarRentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
        Car rental
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Expedition 4x4s on the board.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Only vehicles marked active in admin are listed.
      </p>
      <div className="mt-10">
        <Suspense fallback={<GridSkeleton count={2} />}>
          <VehiclesBody />
        </Suspense>
      </div>
    </div>
  );
}

async function VehiclesBody() {
  const result = await listVehicles();
  if (result.status === "error") {
    return <StatusCard title="The desk is unreachable" body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="vehicles" />;
  }
  return <VehicleGrid items={result.items} />;
}
