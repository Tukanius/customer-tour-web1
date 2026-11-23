import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToTripButton } from "@/components/AddToTripButton";
import { ItineraryList } from "@/components/ItineraryList";
import { PricingTable } from "@/components/PricingTable";
import { TourRoute } from "@/components/TourRoute";
import { getTour, tours } from "@/data/travelData";
import { regionLabels } from "@/lib/format";

export async function generateStaticParams() {
  return tours.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) {
    return { title: "Tour not found" };
  }
  return { title: tour.name, description: tour.summary };
}

export default async function TourDetailPage({
  params,
}: PageProps<"/tours/[slug]">) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        {tour.durationDays} days · {regionLabels[tour.region]}
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {tour.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{tour.summary}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <AddToTripButton kind="tour" slug={tour.slug} />
        <Link href="/#trip-request" className="btn-secondary">
          Plan my trip
        </Link>
      </div>
      <div className="mt-12">
        <TourRoute tour={tour} />
      </div>
      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section>
          <h2 className="font-display text-2xl text-ink">Day by day</h2>
          <div className="mt-4">
            <ItineraryList days={tour.days} />
          </div>
        </section>
        <div className="space-y-8">
          <section>
            <h2 className="font-display text-2xl text-ink">Per-person pricing</h2>
            <p className="mt-2 text-sm text-muted">
              Sample USD prices. Final quotes follow the trip request.
            </p>
            <div className="mt-4">
              <PricingTable tiers={tour.pricing} />
            </div>
          </section>
          <ListCard title="Included" items={tour.included} />
          <ListCard title="Not included" items={tour.notIncluded} />
          <ListCard title="Packing" items={tour.packing} />
        </div>
      </div>
    </article>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-line bg-sand/30 p-4">
      <h2 className="font-display text-lg text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
