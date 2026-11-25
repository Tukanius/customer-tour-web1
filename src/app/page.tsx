import { Suspense } from "react";
import { CatalogGridSkeleton, CatalogSection } from "@/components/CatalogSection";
import { Hero } from "@/components/Hero";
import { TripRequestForm } from "@/components/TripRequestForm";
import { listDestinations, listTours, listVehicles } from "@/lib/catalog";
import type { CatalogItem } from "@/types/catalog";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<HomeSectionSkeleton eyebrow="Destinations" title="Places the desk has published." />}>
        <HomeDestinations />
      </Suspense>
      <Suspense fallback={<HomeSectionSkeleton eyebrow="Tours" title="Set routes, when they are live." />}>
        <HomeTours />
      </Suspense>
      <Suspense fallback={<HomeSectionSkeleton eyebrow="Car rent" title="4x4s on the board." />}>
        <HomeVehicles />
      </Suspense>
      <Suspense
        fallback={
          <section className="bg-sand/35 py-16">
            <div className="mx-auto h-72 max-w-6xl animate-pulse rounded-3xl bg-sand/80" />
          </section>
        }
      >
        <HomeTripRequest />
      </Suspense>
    </>
  );
}

async function HomeDestinations() {
  const result = await listDestinations();
  return <CatalogSection result={result} resource="destinations" id="destinations" preview />;
}

async function HomeTours() {
  const result = await listTours();
  return <CatalogSection result={result} resource="tours" id="tours" preview />;
}

async function HomeVehicles() {
  const result = await listVehicles();
  return <CatalogSection result={result} resource="vehicles" id="car-rent" />;
}

async function HomeTripRequest() {
  const [destinations, tours, vehicles] = await Promise.all([
    listDestinations(),
    listTours(),
    listVehicles(),
  ]);
  return (
    <TripRequestForm
      destinations={itemsOf(destinations)}
      tours={itemsOf(tours)}
      vehicles={itemsOf(vehicles)}
    />
  );
}

function itemsOf(result: Awaited<ReturnType<typeof listDestinations>>): CatalogItem[] {
  return result.status === "ok" ? result.items : [];
}

function HomeSectionSkeleton({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="border-b border-line bg-paper py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          {eyebrow}
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10">
          <CatalogGridSkeleton />
        </div>
      </div>
    </section>
  );
}
