import type { Metadata } from "next";
import Link from "next/link";
import { AddToTripButton } from "@/components/AddToTripButton";
import { vehicles } from "@/data/travelData";
import { driveModeLabels, usd } from "@/lib/format";

export const metadata: Metadata = {
  title: "Car Rent",
  description:
    "Self-drive and with-driver 4x4 hire in Mongolia, with daily rates and expedition specs.",
};

export default function CarRentPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Car rent
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
        Expedition 4x4s, not airport runabouts.
      </h1>
      <p className="mt-4 max-w-xl text-muted leading-7">
        Daily rates, seats, and whether the car is self-drive or with a driver.
        We do not rent into the deep Gobi without a support plan.
      </p>
      <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {vehicles.map((vehicle) => (
          <li key={vehicle.slug}>
            <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                {vehicle.seats} seats · {usd.format(vehicle.dailyRateUsd)} / day
              </p>
              <h2 className="mt-2 font-display text-3xl text-ink">
                {vehicle.name}
              </h2>
              <p className="mt-3 flex-1 text-muted leading-7">{vehicle.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {vehicle.driveModes.map((mode) => (
                  <li
                    key={mode}
                    className="rounded-full border border-line bg-sand/50 px-3 py-1 text-xs font-medium text-ink"
                  >
                    {driveModeLabels[mode]}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                {vehicle.specs
                  .slice(0, 3)
                  .map((spec) => `${spec.label}: ${spec.value}`)
                  .join(" · ")}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <AddToTripButton
                  kind="vehicle"
                  slug={vehicle.slug}
                  className="flex-1"
                />
                <Link
                  href={`/car-rent/${vehicle.slug}`}
                  className="btn-secondary flex-1"
                >
                  View details
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
