import type { Metadata } from "next";
import { DestinationCatalog } from "@/components/DestinationCatalog";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Gobi dunes, Altai peaks, central grassland, northern lakes, and wildlife ranges — private places on the Nomad Atlas map.",
};

export default function DestinationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Destinations
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        The map, place by place.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Filter by region. Add a place to your trip, then send a request from
        the home form.
      </p>
      <div className="mt-10">
        <DestinationCatalog />
      </div>
    </div>
  );
}
