"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { REGION_TABS } from "@/data/travelData";
import { MONTHS, regionLabels, styleLabels } from "@/lib/format";
import type { Destination, Region } from "@/types/travel";
import { AddToTripButton } from "./AddToTripButton";
import { REGION_ART, RegionGraphic } from "./RegionGraphic";
import { filterDestinations, useTrip } from "./TripProvider";

export function DestinationsSection() {
  const { appliedFilters, clearFilters } = useTrip();
  const [tab, setTab] = useState<Region | "all">("all");
  const searched = useMemo(
    () => filterDestinations(appliedFilters),
    [appliedFilters],
  );
  const visible = useMemo(
    () =>
      tab === "all" ? searched : searched.filter((item) => item.region === tab),
    [searched, tab],
  );
  const narrowed =
    appliedFilters.where !== "anywhere" ||
    appliedFilters.style !== "any" ||
    appliedFilters.when !== "any";

  return (
    <section
      id="destinations"
      className="scroll-mt-24 border-b border-line bg-sand/35"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Destinations
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Places we return to, never as a crowd.
          </h2>
          <Link href="/destinations" className="btn-secondary self-start">
            All destinations
          </Link>
        </div>
        {narrowed ? (
          <div
            className="mt-5 flex flex-wrap items-center gap-2 text-sm"
            aria-live="polite"
          >
            <span className="text-muted">Active search:</span>
            {appliedFilters.where !== "anywhere" ? (
              <Chip>{regionLabels[appliedFilters.where]}</Chip>
            ) : null}
            {appliedFilters.style !== "any" ? (
              <Chip>{styleLabels[appliedFilters.style]}</Chip>
            ) : null}
            {appliedFilters.when !== "any" ? (
              <Chip>{MONTHS[appliedFilters.when - 1]}</Chip>
            ) : null}
            <button
              type="button"
              className="text-sm font-medium text-azure underline-offset-2 hover:underline"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        ) : null}
        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Destination regions"
        >
          {REGION_TABS.map((item) => {
            const selected = item.id === tab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                  selected
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-paper text-ink hover:bg-sand"
                }`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        {visible.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-line bg-paper px-5 py-10 text-center text-muted">
            No places match this search. Widen the month or travel style, or
            clear filters.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((destination) => (
              <li key={destination.slug}>
                <DestinationCard destination={destination} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div
        className="relative h-36 overflow-hidden"
        style={{ backgroundColor: REGION_ART[destination.region] }}
        aria-hidden="true"
      >
        <RegionGraphic region={destination.region} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {regionLabels[destination.region]} · {destination.season}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink">
          {destination.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">
          {destination.summary}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <AddToTripButton
            kind="destination"
            slug={destination.slug}
            className="flex-1"
          />
          <Link
            href={`/destinations/${destination.slug}`}
            className="btn-secondary flex-1"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-ink">
      {children}
    </span>
  );
}
