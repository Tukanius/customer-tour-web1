"use client";

import { useMemo, useState } from "react";
import { destinations, REGION_TABS } from "@/data/travelData";
import type { Region } from "@/types/travel";
import { DestinationCard } from "./DestinationsSection";

export function DestinationCatalog() {
  const [tab, setTab] = useState<Region | "all">("all");
  const visible = useMemo(
    () =>
      tab === "all"
        ? destinations
        : destinations.filter((item) => item.region === tab),
    [tab],
  );

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
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
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((destination) => (
          <li key={destination.slug}>
            <DestinationCard destination={destination} />
          </li>
        ))}
      </ul>
    </div>
  );
}
