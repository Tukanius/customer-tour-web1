import Link from "next/link";
import { tours } from "@/data/travelData";
import { regionLabels, usd } from "@/lib/format";
import { AddToTripButton } from "./AddToTripButton";

export function FeaturedTours() {
  const featured = tours.slice(0, 3);
  return (
    <section className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Packages
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Set routes, still private.
          </h2>
          <Link href="/tours" className="btn-secondary self-start">
            All tours
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {featured.map((tour) => (
            <li key={tour.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-sand/30 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {tour.durationDays} days · {regionLabels[tour.region]}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">
                  {tour.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {tour.summary}
                </p>
                <p className="mt-4 text-sm text-ink">
                  From {usd.format(tour.startingPriceUsd)} per person
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <AddToTripButton
                    kind="tour"
                    slug={tour.slug}
                    className="flex-1"
                  />
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="btn-secondary flex-1"
                  >
                    View details
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
