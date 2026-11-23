"use client";

import type { RouteStop, Tour } from "@/types/travel";

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

export function RouteDiagram({
  tour,
  activeStopId,
  onSelect,
}: {
  tour: Tour;
  activeStopId: string;
  onSelect: (id: string) => void;
}) {
  const path = pathThroughStops(tour.stops);
  return (
    <svg
      viewBox="0 0 800 240"
      className="h-auto w-full"
      role="img"
      aria-label={`${tour.name} route with ${tour.stops.length} stops`}
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
      {tour.stops.map((stop) => {
        const active = stop.id === activeStopId;
        return (
          <g
            key={stop.id}
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
      })}
    </svg>
  );
}
