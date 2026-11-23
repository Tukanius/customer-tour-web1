"use client";

import { MONTHS, REGIONS, TRAVEL_STYLES } from "@/data/tours";
import type { Region, TravelStyle } from "@/data/types";
import {
  filterDestinations,
  useTrip,
  type SearchFilters,
  type TravellerCount,
} from "./TripProvider";

const TRAVELLER_OPTIONS: TravellerCount[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

export function HeroSearch() {
  const { filters, setFilters, applySearch, appliedFilters } = useTrip();
  const matchCount = filterDestinations(filters).length;

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <section
      id="top"
      className="relative overflow-x-clip border-b border-line bg-hero"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      >
        <HeroBackdrop />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Private travel · Mongolia
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.15rem] leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
          Quiet roads, open sky, and a journey written for your group alone.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
          Azure Skyland designs small private expeditions across the Gobi, Altai,
          Khangai, and the northern lakes. No bus groups — one itinerary, written
          for the people on it.
        </p>

        <form
          className="mt-10 rounded-3xl border border-line bg-paper/95 p-3 shadow-[0_18px_50px_-28px_rgba(31,46,38,0.45)] sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            applySearch();
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Where">
              <select
                id="where"
                className="field-select"
                value={filters.where}
                onChange={(event) =>
                  update("where", event.target.value as Region | "anywhere")
                }
              >
                {REGIONS.filter((region) => region.id !== "all").map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Travel style">
              <select
                id="style"
                className="field-select"
                value={filters.style}
                onChange={(event) =>
                  update("style", event.target.value as TravelStyle | "any")
                }
              >
                {TRAVEL_STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="When">
              <select
                id="when"
                className="field-select"
                value={filters.when}
                onChange={(event) =>
                  update(
                    "when",
                    event.target.value === "any"
                      ? "any"
                      : Number(event.target.value),
                  )
                }
              >
                <option value="any">Any time</option>
                {MONTHS.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Travellers">
              <select
                id="travellers"
                className="field-select"
                value={filters.travellers}
                onChange={(event) =>
                  update(
                    "travellers",
                    Number(event.target.value) as TravellerCount,
                  )
                }
              >
                {TRAVELLER_OPTIONS.map((count) => (
                  <option key={count} value={count}>
                    {count === 12 ? "12+" : String(count)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="px-1 text-sm text-muted" aria-live="polite">
              {matchCount} matching {matchCount === 1 ? "place" : "places"}
            </p>
            <button type="submit" className="btn-primary sm:min-w-44">
              Search journeys
            </button>
          </div>
        </form>

        <ActiveFilters applied={appliedFilters} />
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5 rounded-2xl bg-sand/70 px-3 py-2.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function ActiveFilters({ applied }: { applied: SearchFilters }) {
  const chips: string[] = [];
  if (applied.where !== "anywhere") {
    const region = REGIONS.find((item) => item.id === applied.where);
    if (region) {
      chips.push(region.label);
    }
  }
  if (applied.style !== "any") {
    const style = TRAVEL_STYLES.find((item) => item.id === applied.style);
    if (style) {
      chips.push(style.label);
    }
  }
  if (applied.when !== "any") {
    chips.push(MONTHS[applied.when - 1]);
  }
  chips.push(
    applied.travellers === 12
      ? "12+ travellers"
      : `${applied.travellers} travellers`,
  );

  const narrowed =
    applied.where !== "anywhere" ||
    applied.style !== "any" ||
    applied.when !== "any";

  if (!narrowed) {
    return null;
  }

  return (
    <p
      className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted"
      aria-live="polite"
    >
      <span>Showing journeys for</span>
      {chips.map((chip) => (
        <span
          key={chip}
          className="rounded-full border border-line bg-paper px-2.5 py-1 text-ink"
        >
          {chip}
        </span>
      ))}
    </p>
  );
}

function HeroBackdrop() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1200 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="1200" height="640" fill="#eef3ef" />
      <path d="M0 420C180 360 280 300 430 310 620 322 700 420 900 380 1040 352 1120 300 1200 280V640H0Z" fill="#dce8df" />
      <path d="M0 500C220 440 360 480 520 470 740 456 820 390 1020 420 1100 434 1160 470 1200 500V640H0Z" fill="#c5d5c8" />
      <path d="M0 560C260 520 480 540 720 530 940 520 1080 560 1200 548V640H0Z" fill="#b7c9b4" />
      <circle cx="980" cy="120" r="42" fill="#f4efe4" />
    </svg>
  );
}
