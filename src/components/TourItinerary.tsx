"use client";

import { useState } from "react";
import type { TourStop } from "@/types/catalog";
import { uiCopy } from "@/data/uiCopy";
import { useCatalogSheet } from "./CatalogSheet";

export function TourItinerary({ stops }: { stops: TourStop[] }) {
  const { openDestination } = useCatalogSheet();
  const [open, setOpen] = useState<number | null>(0);
  if (stops.length === 0) return null;

  return (
    <ol className="relative space-y-3 border-l border-line pl-6">
      {stops.map((stop, index) => {
        const expanded = open === index;
        const heading = stop.title || `Day ${index + 1}`;
        return (
          <li key={`${stop.id}-${index}`} className="relative">
            <span className="absolute -left-[1.85rem] top-3 h-3 w-3 rounded-full border-2 border-ocean bg-paper" />
            <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : index)}
              >
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
                    {heading}
                    {stop.region ? ` · ${stop.region}` : ""}
                  </span>
                  <span className="mt-1 block font-display text-xl text-ink">
                    {stop.name}
                  </span>
                </span>
                <span className="text-muted">{expanded ? "–" : "+"}</span>
              </button>
              {expanded ? (
                <div className="space-y-3 border-t border-line px-4 py-4">
                  {stop.body ? (
                    <p className="text-sm leading-6 text-muted">{stop.body}</p>
                  ) : null}
                  {stop.id ? (
                    <button
                      type="button"
                      className="text-sm font-semibold text-ocean hover:underline"
                      onClick={() => openDestination(stop.id)}
                    >
                      {uiCopy.tours.viewDestination}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
