import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { EmptyCatalog, GridSkeleton, VehicleGrid } from "@/components/CatalogGrids";
import { uiCopy } from "@/data/uiCopy";
import { listVehicles } from "@/lib/catalog";

export const metadata: Metadata = {
  title: uiCopy.cars.title,
  description: uiCopy.cars.lede,
};

export default function CarRentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {uiCopy.cars.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">{uiCopy.cars.lede}</p>
      <div className="mt-10">
        <Suspense fallback={<GridSkeleton />}>
          <VehiclesBody />
        </Suspense>
      </div>
    </div>
  );
}

async function VehiclesBody() {
  const result = await listVehicles();
  if (result.status === "error") {
    return <StatusCard title={uiCopy.status.unreachable} body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="vehicles" />;
  }
  return <VehicleGrid items={result.items} />;
}
