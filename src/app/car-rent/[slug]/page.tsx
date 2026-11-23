import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToTripButton } from "@/components/AddToTripButton";
import { getVehicle, vehicles } from "@/data/travelData";
import { driveModeLabels, usd } from "@/lib/format";

export async function generateStaticParams() {
  return vehicles.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/car-rent/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) {
    return { title: "Vehicle not found" };
  }
  return { title: vehicle.name, description: vehicle.summary };
}

export default async function VehicleDetailPage({
  params,
}: PageProps<"/car-rent/[slug]">) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        {vehicle.seats} seats · {usd.format(vehicle.dailyRateUsd)} / day
      </p>
      <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
        {vehicle.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
        {vehicle.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {vehicle.driveModes.map((mode) => (
          <span
            key={mode}
            className="rounded-full border border-line bg-sand/50 px-3 py-1 text-xs font-medium text-ink"
          >
            {driveModeLabels[mode]}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <AddToTripButton kind="vehicle" slug={vehicle.slug} />
        <Link href="/#trip-request" className="btn-secondary">
          Plan my trip
        </Link>
      </div>
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="overflow-x-auto rounded-2xl border border-line">
          <h2 className="border-b border-line bg-sand/50 px-4 py-3 font-display text-xl text-ink">
            Specs
          </h2>
          <table className="min-w-full text-sm">
            <caption className="sr-only">Vehicle specifications</caption>
            <tbody>
              {vehicle.specs.map((spec) => (
                <tr key={spec.label} className="border-t border-line">
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    {spec.label}
                  </th>
                  <td className="px-4 py-3 text-ink">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="overflow-x-auto rounded-2xl border border-line">
          <h2 className="border-b border-line bg-sand/50 px-4 py-3 font-display text-xl text-ink">
            Rate breakdown
          </h2>
          <table className="min-w-full text-sm">
            <caption className="sr-only">Daily rate breakdown</caption>
            <tbody>
              {vehicle.rateBreakdown.map((line) => (
                <tr key={line.label} className="border-t border-line">
                  <th className="px-4 py-3 text-left font-medium text-muted">
                    {line.label}
                  </th>
                  <td className="px-4 py-3 text-ink">
                    {usd.format(line.amountUsd)}
                    {line.note ? (
                      <span className="ml-2 text-xs text-muted">{line.note}</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <ListCard title="Insurance" items={vehicle.insurance} />
        <ListCard title="Equipment" items={vehicle.equipment} />
      </div>
      <section className="mt-8 rounded-2xl border border-line bg-sand/30 p-5">
        <h2 className="font-display text-2xl text-ink">Road suitability</h2>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {vehicle.roadSuitability.map((item) => (
            <li key={item} className="text-sm leading-6 text-muted">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function ListCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-line bg-sand/30 p-5">
      <h2 className="font-display text-xl text-ink">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-azure" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
