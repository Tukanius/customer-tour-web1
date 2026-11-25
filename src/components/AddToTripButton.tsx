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
      ? trip.destinationIds.includes(slug)
      : kind === "tour"
        ? trip.tourIds.includes(slug)
        : trip.vehicleIds.includes(slug);
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
