"use client";

import { useTrip } from "./TripProvider";

export function AddToTripButton({
  kind,
  slug,
  className = "",
}: {
  kind: "destination" | "tour" | "vehicle";
  slug: string;
  className?: string;
}) {
  const trip = useTrip();
  const selected =
    kind === "destination"
      ? trip.destinationSlugs.includes(slug)
      : kind === "tour"
        ? trip.tourSlugs.includes(slug)
        : trip.vehicleSlugs.includes(slug);
  const onToggle =
    kind === "destination"
      ? trip.toggleDestination
      : kind === "tour"
        ? trip.toggleTour
        : trip.toggleVehicle;

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onToggle(slug)}
      className={`${selected ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {selected ? "Added to trip" : "Add to trip"}
    </button>
  );
}
