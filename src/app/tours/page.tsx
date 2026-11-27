import type { Metadata } from "next";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { CardSkeleton } from "@/components/CardSkeleton";
import { EmptyCatalog, TourGrid } from "@/components/CatalogGrids";
import { uiCopy } from "@/data/uiCopy";
import { listTours } from "@/lib/catalog";

export const metadata: Metadata = {
  title: uiCopy.tours.title,
  description: uiCopy.tours.lede,
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {uiCopy.tours.title}
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">{uiCopy.tours.lede}</p>
      <div className="mt-10">
        <Suspense fallback={<CardSkeleton />}>
          <ToursBody />
        </Suspense>
      </div>
    </div>
  );
}

async function ToursBody() {
  const result = await listTours();
  if (result.status === "error") {
    return <StatusCard title={uiCopy.status.unreachable} body={result.message} />;
  }
  if (result.status === "empty") {
    return <EmptyCatalog kind="tours" />;
  }
  return <TourGrid items={result.items} />;
}
