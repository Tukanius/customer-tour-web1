import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogPageBody, CatalogPageSkeleton } from "@/components/CatalogPage";
import { listTours } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Published tour templates from the Nomad Atlas desk. Empty until admin turns a route on.",
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Tours
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Set routes, when they are live.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Packages appear here after the desk publishes them. Nothing on this
        page is sample copy.
      </p>
      <div className="mt-10">
        <Suspense fallback={<CatalogPageSkeleton />}>
          <ToursBody />
        </Suspense>
      </div>
    </div>
  );
}

async function ToursBody() {
  const result = await listTours();
  return <CatalogPageBody result={result} resource="tours" />;
}
