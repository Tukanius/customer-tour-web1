"use client";

import { MONTHS, regionLabels, styleLabels } from "@/lib/format";
import type { Region, TravelStyle } from "@/types/travel";
import {
  filterDestinations,
  useTrip,
  type SearchFilters,
  type TravellerCount,
} from "./TripProvider";

const TRAVELLER_OPTIONS: TravellerCount[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
];

const WHERE_OPTIONS: { id: Region | "anywhere"; label: string }[] = [
  { id: "anywhere", label: regionLabels.anywhere },
  { id: "gobi", label: "Gobi" },
  { id: "altai", label: "Altai" },
  { id: "central", label: "Central" },
  { id: "north", label: "North" },
  { id: "wildlife", label: "Wildlife" },
];

const STYLE_OPTIONS: { id: TravelStyle | "any"; label: string }[] = [
  { id: "any", label: styleLabels.any },
  { id: "4x4", label: styleLabels["4x4"] },
  { id: "ger", label: styleLabels.ger },
  { id: "trek", label: styleLabels.trek },
  { id: "homestay", label: styleLabels.homestay },
  { id: "wildlife", label: styleLabels.wildlife },
];

export function HeroSearch() {
  const { filters, setFilters, applySearch, appliedFilters } = useTrip();
  const matchCount = filterDestinations(filters).length;

  function update<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters({ ...filters, [key]: value });
  }

  return (
    <section className="relative overflow-x-clip border-b border-line bg-hero">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <HeroBackdrop />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Private travel · Mongolia
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.15rem] leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
          A private map of Mongolia, drawn for the people who will travel it.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
          Nomad Atlas plans small 4x4 expeditions, ger camps, and nomad stays
          across the Gobi, Altai, Khangai, and the northern lakes. No bus groups.
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
                {WHERE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
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
                {STYLE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
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
              Search
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
    chips.push(regionLabels[applied.where]);
  }
  if (applied.style !== "any") {
    chips.push(styleLabels[applied.style]);
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
