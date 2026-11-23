import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToTripButton } from "@/components/AddToTripButton";
import { REGION_ART, RegionGraphic } from "@/components/RegionGraphic";
import { destinations, getDestination } from "@/data/travelData";
import { regionLabels } from "@/lib/format";
import type { Destination } from "@/types/travel";

export async function generateStaticParams() {
  return destinations.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) {
    return { title: "Place not found" };
  }
  return {
    title: destination.name,
    description: destination.summary,
  };
}

export default async function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) {
    notFound();
  }
  const nearby = destination.nearby
    .map((item) => getDestination(item))
    .filter((item): item is Destination => item != null);

  return (
    <article>
      <div
        className="relative h-56 overflow-hidden sm:h-72"
        style={{ backgroundColor: REGION_ART[destination.region] }}
      >
        <RegionGraphic region={destination.region} className="h-full w-full" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          {regionLabels[destination.region]} · {destination.season}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {destination.name}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          {destination.overview}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <AddToTripButton kind="destination" slug={destination.slug} />
          <Link href="/#trip-request" className="btn-secondary">
            Plan my trip
          </Link>
        </div>
        <section className="mt-12">
          <h2 className="font-display text-2xl text-ink">Highlights</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {destination.highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-line bg-sand/40 px-4 py-3 text-sm text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
        {nearby.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-ink">Nearby</h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {nearby.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/destinations/${item.slug}`}
                    className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink hover:bg-sand"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
