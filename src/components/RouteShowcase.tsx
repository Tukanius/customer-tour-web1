"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tours } from "@/data/travelData";
import { RouteDiagram } from "./RouteDiagram";

export function RouteShowcase() {
  const [slug, setSlug] = useState(tours[0].slug);
  const [activeStopId, setActiveStopId] = useState(tours[0].stops[0].id);
  const [playKey, setPlayKey] = useState(0);
  const tour = useMemo(
    () => tours.find((item) => item.slug === slug) ?? tours[0],
    [slug],
  );

  function selectTour(nextSlug: string) {
    const next = tours.find((item) => item.slug === nextSlug) ?? tours[0];
    setSlug(next.slug);
    setActiveStopId(next.stops[0].id);
    setPlayKey((key) => key + 1);
  }

  return (
    <section id="journeys" className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Tours
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            A route drawn as a line across empty country.
          </h2>
          <button
            type="button"
            className="btn-secondary self-start"
            onClick={() => setPlayKey((key) => key + 1)}
          >
            Replay
          </button>
        </div>
        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Tour packages"
        >
          {tours.map((item) => {
            const selected = item.slug === tour.slug;
            return (
              <button
                key={item.slug}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "border-azure bg-azure text-paper"
                    : "border-line bg-sand/50 text-ink hover:bg-sand"
                }`}
                onClick={() => selectTour(item.slug)}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-line bg-sand/40 p-4 sm:p-6">
          <div className="absolute right-4 top-4 z-10 rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">
            {tour.distanceKm.toLocaleString()} km
          </div>
          <RouteDiagram
            key={`${tour.slug}-${playKey}`}
            tour={tour}
            activeStopId={activeStopId}
            onSelect={setActiveStopId}
          />
        </div>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tour.stops.map((stop) => {
            const active = stop.id === activeStopId;
            return (
              <li key={stop.id}>
                <button
                  type="button"
                  aria-label={`Stop ${stop.number}: ${stop.name}`}
                  aria-current={active ? "true" : undefined}
                  onClick={() => setActiveStopId(stop.id)}
                  className={`h-full w-full rounded-2xl border p-4 text-left transition-colors ${
                    active
                      ? "border-azure bg-azure-soft"
                      : "border-line bg-paper hover:bg-sand/60"
                  }`}
                >
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
                      {stop.number}
                    </span>
                    {stop.distanceFromStartKm} km
                  </p>
                  <h3 className="mt-2 font-display text-xl text-ink">
                    {stop.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {stop.description}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
        <Link href={`/tours/${tour.slug}`} className="btn-primary mt-8 inline-flex">
          Open {tour.name}
        </Link>
      </div>
    </section>
  );
}
