import { uiCopy } from "@/data/uiCopy";
import { googleMapsSearchUrl, hasCoords } from "@/lib/contact";

export function MapsLink({
  location,
  className = "",
}: {
  location?: { lat: number; lng: number } | null;
  className?: string;
}) {
  if (!hasCoords(location)) return null;
  return (
    <a
      href={googleMapsSearchUrl(location.lat, location.lng)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 text-sm font-semibold text-ocean hover:underline ${className}`}
    >
      <LocationIcon />
      {uiCopy.maps}
    </a>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
      <path
        d="M12 21s6-5.4 6-10.2A6 6 0 0 0 6 10.8C6 15.6 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10.8" r="1.8" fill="currentColor" />
    </svg>
  );
}
