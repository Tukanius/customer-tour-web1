import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageBody, CatalogPageSkeleton } from "@/components/CatalogPage";
import { listVehicles } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Car Rent",
  description:
    "Published 4x4s from the Nomad Atlas desk. Seat counts and notes come from admin.",
};

export default function CarRentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Car rent
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Expedition 4x4s on the board.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Only vehicles marked active in admin are listed. Add one to a trip
        request if it fits the road.
      </p>
      <div className="mt-10">
        <Suspense fallback={<CatalogPageSkeleton />}>
          <VehiclesBody />
        </Suspense>
      </div>
    </div>
  );
}

async function VehiclesBody() {
  const result = await listVehicles();
  return <CatalogPageBody result={result} resource="vehicles" />;
}
