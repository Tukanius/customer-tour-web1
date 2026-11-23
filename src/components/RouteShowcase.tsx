"use client";

import { useMemo, useState } from "react";
import { routePresets } from "@/data/tours";
import type { RoutePreset, RouteStop } from "@/data/types";

export function RouteShowcase() {
  const [presetId, setPresetId] = useState(routePresets[0].id);
  const [activeStopId, setActiveStopId] = useState(routePresets[0].stops[0].id);
  const [playKey, setPlayKey] = useState(0);

  const preset = useMemo(
    () => routePresets.find((item) => item.id === presetId) ?? routePresets[0],
    [presetId],
  );
  const activeStop =
    preset.stops.find((stop) => stop.id === activeStopId) ?? preset.stops[0];

  function selectPreset(next: RoutePreset) {
    setPresetId(next.id);
    setActiveStopId(next.stops[0].id);
    setPlayKey((key) => key + 1);
  }

  return (
    <section
      id="journeys"
      className="scroll-mt-24 border-b border-line bg-paper"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Journeys
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
            Replay animation
          </button>
        </div>

        <div
          className="mt-8 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Tour presets"
        >
          {routePresets.map((item) => {
            const selected = item.id === preset.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                  selected
                    ? "border-azure bg-azure text-paper"
                    : "border-line bg-sand/50 text-ink hover:bg-sand"
                }`}
                onClick={() => selectPreset(item)}
              >
                {item.name}
              </button>
            );
          })}
        </div>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-line bg-sand/40 p-4 sm:p-6">
          <div className="absolute right-4 top-4 z-10 rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold text-ink">
            {preset.distanceKm.toLocaleString()} km
          </div>
          <RouteDiagram
            key={`${preset.id}-${playKey}`}
            preset={preset}
            activeStopId={activeStop.id}
            onSelect={setActiveStopId}
          />
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {preset.stops.map((stop) => {
            const active = stop.id === activeStop.id;
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
      </div>
    </section>
  );
}

function pathThroughStops(stops: RouteStop[]) {
  if (stops.length === 0) {
    return "";
  }
  const [first, ...rest] = stops;
  return rest.reduce((path, stop, index) => {
    const prev = index === 0 ? first : rest[index - 1];
    const c1x = prev.x + (stop.x - prev.x) * 0.38;
    const c1y = prev.y;
    const c2x = prev.x + (stop.x - prev.x) * 0.62;
    const c2y = stop.y;
    return `${path} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${stop.x} ${stop.y}`;
  }, `M ${first.x} ${first.y}`);
}

function RouteDiagram({
  preset,
  activeStopId,
  onSelect,
}: {
  preset: RoutePreset;
  activeStopId: string;
  onSelect: (id: string) => void;
}) {
  const path = pathThroughStops(preset.stops);
  return (
    <svg
      viewBox="0 0 800 240"
      className="h-auto w-full"
      role="img"
      aria-label={`${preset.name} route with ${preset.stops.length} stops`}
    >
      <rect width="800" height="240" fill="transparent" />
      <path
        d="M0 200 C 140 170 220 210 360 180 520 145 640 190 800 160 V240 H0 Z"
        fill="#d7e2d6"
      />
      <path
        d="M0 220 C 180 200 300 230 480 205 640 182 720 210 800 198 V240 H0 Z"
        fill="#c5d3c4"
      />
      <path
        className="route-path"
        d={path}
        fill="none"
        stroke="#1f4f63"
        strokeWidth="3"
        strokeLinecap="round"
        pathLength={1}
      />
      {preset.stops.map((stop) => (
        <StopMarker
          key={stop.id}
          stop={stop}
          active={stop.id === activeStopId}
          onSelect={onSelect}
        />
      ))}
    </svg>
  );
}

function StopMarker({
  stop,
  active,
  onSelect,
}: {
  stop: RouteStop;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <g
      className="cursor-pointer"
      onClick={() => onSelect(stop.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(stop.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Stop ${stop.number}: ${stop.name}`}
      aria-current={active ? "true" : undefined}
    >
      <circle
        cx={stop.x}
        cy={stop.y}
        r={active ? 16 : 13}
        fill={active ? "#1f4f63" : "#fbf8f2"}
        stroke={active ? "#1f4f63" : "#1a241c"}
        strokeWidth="2"
      />
      <text
        x={stop.x}
        y={stop.y + 4}
        textAnchor="middle"
        className="select-none"
        fontSize="11"
        fontWeight="700"
        fill={active ? "#fbf8f2" : "#1a241c"}
      >
        {stop.number}
      </text>
    </g>
  );
}
