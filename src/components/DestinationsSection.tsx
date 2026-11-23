"use client";

import { useMemo, useState } from "react";
import { MONTHS, REGIONS, TRAVEL_STYLES } from "@/data/tours";
import type { Destination, Region } from "@/data/types";
import { filterDestinations, useTrip } from "./TripProvider";

const TABS: { id: Region | "all"; label: string }[] = REGIONS.filter(
  (region) => region.id !== "anywhere",
).map((region) => ({
  id: region.id as Region | "all",
  label: region.label,
}));

const REGION_ART: Record<Region, string> = {
  gobi: "#e4d2b0",
  altai: "#c5d0d8",
  central: "#c9d6b8",
  north: "#b7c9d4",
  wildlife: "#d7cbb0",
};

export function DestinationsSection() {
  const {
    appliedFilters,
    selectedIds,
    toggleDestination,
    clearFilters,
  } = useTrip();
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
        <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Places we return to, never as a crowd.
        </h2>

        {narrowed ? (
          <div
            className="mt-5 flex flex-wrap items-center gap-2 text-sm"
            aria-live="polite"
          >
            <span className="text-muted">Active search:</span>
            {appliedFilters.where !== "anywhere" ? (
              <Chip>
                {REGIONS.find((item) => item.id === appliedFilters.where)?.label}
              </Chip>
            ) : null}
            {appliedFilters.style !== "any" ? (
              <Chip>
                {
                  TRAVEL_STYLES.find((item) => item.id === appliedFilters.style)
                    ?.label
                }
              </Chip>
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
          {TABS.map((item) => {
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
              <li key={destination.id}>
                <DestinationCard
                  destination={destination}
                  selected={selectedIds.includes(destination.id)}
                  onToggle={() => toggleDestination(destination.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function DestinationCard({
  destination,
  selected,
  onToggle,
}: {
  destination: Destination;
  selected: boolean;
  onToggle: () => void;
}) {
  const regionLabel = REGIONS.find((item) => item.id === destination.region)
    ?.label;
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
          {regionLabel} · {destination.season}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink">
          {destination.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">
          {destination.summary}
        </p>
        <button
          type="button"
          aria-pressed={selected}
          onClick={onToggle}
          className={`mt-4 w-full ${selected ? "btn-primary" : "btn-secondary"}`}
        >
          {selected ? "Added to trip" : "Add to trip"}
        </button>
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

function RegionGraphic({ region }: { region: Region }) {
  if (region === "gobi") {
    return (
      <svg viewBox="0 0 400 160" className="h-full w-full">
        <path d="M0 110 C80 90 140 120 220 100 300 80 340 70 400 86V160H0Z" fill="#d9c196" />
        <path d="M0 132 C90 118 180 140 280 120 340 108 370 122 400 118V160H0Z" fill="#c9ab78" />
      </svg>
    );
  }
  if (region === "altai") {
    return (
      <svg viewBox="0 0 400 160" className="h-full w-full">
        <path d="M20 140 110 40 180 110 250 28 380 140Z" fill="#9aafbd" />
        <path d="M110 40 140 78 180 110 148 86Z" fill="#eef3f6" />
      </svg>
    );
  }
  if (region === "north") {
    return (
      <svg viewBox="0 0 400 160" className="h-full w-full">
        <ellipse cx="200" cy="108" rx="150" ry="34" fill="#7fa0b3" />
        <path d="M0 120 C60 90 90 80 140 95 80 70 40 70 0 90Z" fill="#6f8b78" />
      </svg>
    );
  }
  if (region === "wildlife") {
    return (
      <svg viewBox="0 0 400 160" className="h-full w-full">
        <path d="M0 120 C100 90 160 100 240 80 300 66 340 90 400 84V160H0Z" fill="#b9c49a" />
        <circle cx="250" cy="78" r="10" fill="#6d5a3c" />
        <circle cx="290" cy="92" r="8" fill="#6d5a3c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 160" className="h-full w-full">
      <path d="M0 100 C70 80 120 70 200 88 280 106 330 70 400 90V160H0Z" fill="#a7bf90" />
      <path d="M40 160 C80 110 110 110 130 160" fill="none" stroke="#6f8a5e" strokeWidth="6" />
    </svg>
  );
}
