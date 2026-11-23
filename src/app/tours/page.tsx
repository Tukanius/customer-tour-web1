import type { Metadata } from "next";
import Link from "next/link";
import { AddToTripButton } from "@/components/AddToTripButton";
import { tours } from "@/data/travelData";
import { regionLabels, usd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Private Gobi, Orkhon, Khuvsgul, and combined packages with starting prices per person.",
};

export default function ToursPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Tours
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Packages with room to change a day.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Duration, region, and a starting price. The road still belongs to your
        group.
      </p>
      <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tours.map((tour) => (
          <li key={tour.slug}>
            <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {tour.durationDays} days · {regionLabels[tour.region]} ·{" "}
                {tour.distanceKm.toLocaleString()} km
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink">{tour.name}</h2>
              <p className="mt-3 flex-1 text-muted leading-7">{tour.summary}</p>
              <p className="mt-4 text-ink">
                From {usd.format(tour.startingPriceUsd)} per person
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <AddToTripButton kind="tour" slug={tour.slug} className="flex-1" />
                <Link href={`/tours/${tour.slug}`} className="btn-secondary flex-1">
                  View details
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
