"use client";

import { useState } from "react";
import type { Tour } from "@/types/travel";
import { RouteDiagram } from "./RouteDiagram";

export function TourRoute({ tour }: { tour: Tour }) {
  const [activeStopId, setActiveStopId] = useState(tour.stops[0].id);
  const [playKey, setPlayKey] = useState(0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Route</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">
            {tour.distanceKm.toLocaleString()} km
          </span>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPlayKey((key) => key + 1)}
          >
            Replay
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl border border-line bg-sand/40 p-4 sm:p-6">
        <RouteDiagram
          key={`${tour.slug}-${playKey}`}
          tour={tour}
          activeStopId={activeStopId}
          onSelect={setActiveStopId}
        />
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {tour.stops.map((stop) => {
          const active = stop.id === activeStopId;
          return (
            <li key={stop.id}>
              <button
                type="button"
                aria-label={`Stop ${stop.number}: ${stop.name}`}
                aria-current={active ? "true" : undefined}
                onClick={() => setActiveStopId(stop.id)}
                className={`h-full w-full rounded-2xl border p-4 text-left ${
                  active
                    ? "border-azure bg-azure-soft"
                    : "border-line bg-paper hover:bg-sand/60"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                  Stop {stop.number} · {stop.distanceFromStartKm} km
                </p>
                <h3 className="mt-1 font-display text-xl text-ink">{stop.name}</h3>
                <p className="mt-1 text-sm text-muted">{stop.description}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
