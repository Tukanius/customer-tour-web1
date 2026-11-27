import Link from "next/link";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/CardSkeleton";
import { CatalogGrid, EmptyCatalog } from "@/components/CatalogGrids";
import { StatusCard } from "@/components/CatalogCard";
import { Hero } from "@/components/Hero";
import { uiCopy } from "@/data/uiCopy";
import { listDestinations, listTours, listVehicles, pickFeatured } from "@/lib/catalog";
import type { CatalogItem, CatalogKind, CatalogResult } from "@/types/catalog";

export default function Home() {
  return (
    <>
      <Suspense fallback={<Hero />}>
        <HomeHero />
      </Suspense>
      <Suspense fallback={<HomeBlockSkeleton title={uiCopy.tours.title} lede={uiCopy.tours.lede} />}>
        <HomeTours />
      </Suspense>
      <Suspense
        fallback={<HomeBlockSkeleton title={uiCopy.destinations.title} lede={uiCopy.destinations.lede} />}
      >
        <HomeDestinations />
      </Suspense>
      <Suspense fallback={<HomeBlockSkeleton title={uiCopy.cars.title} lede={uiCopy.cars.lede} />}>
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
      title={uiCopy.tours.title}
      lede={uiCopy.tours.lede}
      moreHref="/tours"
      moreLabel={uiCopy.tours.more}
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
      title={uiCopy.destinations.title}
      lede={uiCopy.destinations.lede}
      moreHref="/destinations"
      moreLabel={uiCopy.destinations.more}
      result={result}
      kind="destinations"
    />
  );
}

async function HomeVehicles() {
  const result = await listVehicles();
  return (
    <HomeBlock
      id="car-rental"
      title={uiCopy.cars.title}
      lede={uiCopy.cars.lede}
      moreHref="/car-rent"
      moreLabel={uiCopy.cars.more}
      result={result}
      kind="vehicles"
    />
  );
}

function HomeBlock({
  id,
  title,
  lede,
  moreHref,
  moreLabel,
  result,
  kind,
}: {
  id: string;
  title: string;
  lede: string;
  moreHref: string;
  moreLabel: string;
  result: CatalogResult<CatalogItem>;
  kind: CatalogKind;
}) {
  return (
    <section id={id} className="border-t border-line bg-canvas py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{title}</h2>
            <p className="mt-2 max-w-xl text-muted">{lede}</p>
          </div>
          <Link href={moreHref} className="btn-secondary">
            {moreLabel}
          </Link>
        </div>
        <div className="mt-10">
          <CatalogSlice result={result} kind={kind} />
        </div>
      </div>
    </section>
  );
}

function CatalogSlice({
  result,
  kind,
}: {
  result: CatalogResult<CatalogItem>;
  kind: CatalogKind;
}) {
  if (result.status === "error") {
    return <StatusCard title={uiCopy.status.unreachable} body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind={kind} />;
  }
  return <CatalogGrid items={pickFeatured(result.items, 3)} kind={kind} />;
}

function HomeBlockSkeleton({ title, lede }: { title: string; lede: string }) {
  return (
    <section className="border-t border-line bg-canvas py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-ink">{title}</h2>
        <p className="mt-2 text-muted">{lede}</p>
        <div className="mt-10">
          <CardSkeleton />
        </div>
      </div>
    </section>
  );
}
