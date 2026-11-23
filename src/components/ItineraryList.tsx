"use client";

import { useState } from "react";
import type { ItineraryDay } from "@/types/travel";

export function ItineraryList({ days }: { days: ItineraryDay[] }) {
  const [openDays, setOpenDays] = useState<number[]>([1]);

  function toggleDay(day: number) {
    setOpenDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : [...current, day],
    );
  }

  return (
    <ul className="space-y-3">
      {days.map((day) => {
        const open = openDays.includes(day.day);
        const panelId = `day-panel-${day.day}`;
        return (
          <li
            key={day.day}
            className="overflow-hidden rounded-2xl border border-line bg-sand/30"
          >
            <button
              type="button"
              className="flex w-full items-start gap-3 px-4 py-4 text-left sm:px-5"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggleDay(day.day)}
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                {day.day}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg text-ink sm:text-xl">
                  {day.title}
                </span>
                <span className="mt-0.5 block text-sm text-muted">
                  {day.route}
                </span>
              </span>
              <span className="mt-1 text-muted" aria-hidden="true">
                {open ? "–" : "+"}
              </span>
            </button>
            {open ? (
              <div
                id={panelId}
                className="border-t border-line px-4 pb-5 pt-3 text-sm leading-6 text-muted sm:px-5"
              >
                <p>{day.description}</p>
                <p className="mt-3 text-ink">Overnight: {day.overnight}</p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {day.meals.map((meal) => (
                    <span
                      key={meal}
                      className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink"
                    >
                      {meal}
                    </span>
                  ))}
                </p>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
