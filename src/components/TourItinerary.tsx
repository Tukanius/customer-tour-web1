"use client";

import { useState } from "react";
import { uiCopy } from "@/data/uiCopy";
import type { TourDay } from "@/types/catalog";
import { useCatalogSheet } from "./CatalogSheet";

export function TourItinerary({ days }: { days: TourDay[] }) {
  const { openDestination } = useCatalogSheet();
  const [open, setOpen] = useState<number | null>(0);
  if (days.length === 0) return null;

  return (
    <ol className="relative space-y-3 border-l border-line pl-6">
      {days.map((day, index) => {
        const expanded = open === index;
        const dayLabel = uiCopy.tours.day(day.day);
        const showName = day.name && day.name.toLowerCase() !== dayLabel.toLowerCase();
        return (
          <li key={`${day.day}-${day.name || index}`} className="relative">
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
                    {dayLabel}
                  </span>
                  {showName ? (
                    <span className="mt-1 block font-display text-xl text-ink">{day.name}</span>
                  ) : null}
                </span>
                <span className="text-muted">{expanded ? "–" : "+"}</span>
              </button>
              {expanded ? (
                <div className="space-y-3 border-t border-line px-4 py-4">
                  {day.description ? (
                    <p className="text-sm leading-6 text-muted">{day.description}</p>
                  ) : null}
                  {day.travelDistance ? (
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{uiCopy.tours.distance}: </span>
                      {day.travelDistance}
                    </p>
                  ) : null}
                  {day.travelTime ? (
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{uiCopy.tours.time}: </span>
                      {day.travelTime}
                    </p>
                  ) : null}
                  {day.activities.length > 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-ink">{uiCopy.tours.activities}</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                        {day.activities.map((activity) => (
                          <li key={`${activity.id}-${activity.name}`}>{activity.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {day.destinations.length > 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {uiCopy.tours.destinationsLabel}
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {day.destinations.map((destination) =>
                          destination.id ? (
                            <li key={destination.id}>
                              <button
                                type="button"
                                className="rounded-full border border-line bg-mist/70 px-3 py-1 text-sm font-semibold text-ocean hover:underline"
                                onClick={() => openDestination(destination.id)}
                              >
                                {destination.name}
                              </button>
                            </li>
                          ) : (
                            <li
                              key={destination.name}
                              className="rounded-full border border-line bg-mist/70 px-3 py-1 text-sm text-ink"
                            >
                              {destination.name}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  ) : null}
                  {day.meals.length > 0 ? (
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{uiCopy.tours.meals}: </span>
                      {day.meals.join(", ")}
                    </p>
                  ) : null}
                  {day.overnight ? (
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{uiCopy.tours.overnight}: </span>
                      {day.overnight}
                    </p>
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
