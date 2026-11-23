import Link from "next/link";
import { vehicles } from "@/data/travelData";
import { driveModeLabels, usd } from "@/lib/format";
import { AddToTripButton } from "./AddToTripButton";

export function VehicleCards() {
  return (
    <section
      id="car-rent"
      className="scroll-mt-24 border-b border-line bg-sand/35"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Car rent
        </p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="max-w-xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            4x4s with a mechanic who knows the washouts.
          </h2>
          <Link href="/car-rent" className="btn-secondary self-start">
            All vehicles
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {vehicles.map((vehicle) => (
            <li key={vehicle.slug}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-paper p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  {vehicle.seats} seats · {usd.format(vehicle.dailyRateUsd)} / day
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">
                  {vehicle.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                  {vehicle.summary}
                </p>
                <p className="mt-3 text-sm text-ink">
                  {vehicle.driveModes.map((mode) => driveModeLabels[mode]).join(" · ")}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
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
    </section>
  );
}
