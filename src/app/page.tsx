import Link from "next/link";
import { Suspense } from "react";
import { DestinationGrid, EmptyCatalog, GridSkeleton, TourGrid, VehicleGrid } from "@/components/CatalogGrids";
import { Hero } from "@/components/Hero";
import { StatusCard } from "@/components/PhotoCard";
import { listDestinations, listTours, listVehicles } from "@/lib/catalog";
import type { CatalogItem, CatalogResult } from "@/types/catalog";

export default function Home() {
  return (
    <>
      <Suspense fallback={<Hero />}>
        <HomeHero />
      </Suspense>
      <Suspense fallback={<HomeBlockSkeleton eyebrow="Tours" title="Set routes, when they are live." />}>
        <HomeTours />
      </Suspense>
      <Suspense fallback={<HomeBlockSkeleton eyebrow="Destinations" title="Places on the published map." />}>
        <HomeDestinations />
      </Suspense>
      <Suspense fallback={<HomeBlockSkeleton eyebrow="Car rental" title="4x4s on the board." />}>
        <HomeVehicles />
      </Suspense>
    </>
  );
}

async function HomeHero() {
  const destinations = await listDestinations();
  const imageUrl =
    destinations.status === "ok"
      ? destinations.items.find((item) => item.imageUrl)?.imageUrl
      : undefined;
  return <Hero imageUrl={imageUrl} />;
}

async function HomeTours() {
  const result = await listTours();
  return (
    <HomeBlock
      id="tours"
      eyebrow="Tours"
      title="Featured routes from the desk."
      moreHref="/tours"
      moreLabel="Show More Tours"
      result={result}
      kind="tours"
    />
  );
}

async function HomeDestinations() {
  const result = await listDestinations();
  return (
    <HomeBlock
      id="destinations"
      eyebrow="Destinations"
      title="Places worth the kilometres."
      moreHref="/destinations"
      moreLabel="Show More Destinations"
      result={result}
      kind="destinations"
    />
  );
}

async function HomeVehicles() {
  const result = await listVehicles();
  return (
    <section id="car-rental" className="border-t border-line bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
          Car rental
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Expedition 4x4s on the board.
          </h2>
          <Link href="/car-rent" className="btn-secondary">
            Explore Car Rental
          </Link>
        </div>
        <div className="mt-10">
          <CatalogSlice result={result} kind="vehicles" preview={3} />
        </div>
      </div>
    </section>
  );
}

function HomeBlock({
  id,
  eyebrow,
  title,
  moreHref,
  moreLabel,
  result,
  kind,
}: {
  id: string;
  eyebrow: string;
  title: string;
  moreHref: string;
  moreLabel: string;
  result: CatalogResult<CatalogItem>;
  kind: "tours" | "destinations";
}) {
  return (
    <section id={id} className="border-t border-line bg-canvas py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
          {eyebrow}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <Link href={moreHref} className="btn-secondary">
            {moreLabel}
          </Link>
        </div>
        <div className="mt-10">
          <CatalogSlice result={result} kind={kind} preview={4} />
        </div>
      </div>
    </section>
  );
}

function CatalogSlice({
  result,
  kind,
  preview,
}: {
  result: CatalogResult<CatalogItem>;
  kind: "tours" | "destinations" | "vehicles";
  preview: number;
}) {
  if (result.status === "error") {
    return <StatusCard title="The desk is unreachable" body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind={kind} />;
  }
  const items = result.items.slice(0, preview);
  if (kind === "tours") return <TourGrid items={items} />;
  if (kind === "vehicles") return <VehicleGrid items={items} />;
  return <DestinationGrid items={items} />;
}

function HomeBlockSkeleton({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <section className="border-t border-line bg-canvas py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-display text-3xl text-ink">{title}</h2>
        <div className="mt-10">
          <GridSkeleton />
        </div>
      </div>
    </section>
  );
}
