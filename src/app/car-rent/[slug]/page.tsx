import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusCard } from "@/components/PhotoCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ApiDownError } from "@/lib/api";
import { getVehicle } from "@/lib/catalog";
import { whatsappHref } from "@/lib/contact";

export async function generateMetadata({
  params,
}: PageProps<"/car-rent/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const vehicle = await getVehicle(slug);
    if (!vehicle) return { title: "Vehicle not found" };
    return {
      title: vehicle.name,
      description: vehicle.description || vehicle.name,
    };
  } catch {
    return { title: "Car Rental" };
  }
}

export default function VehicleDetailPage({
  params,
}: PageProps<"/car-rent/[slug]">) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-mist" />}>
      <VehicleBody params={params} />
    </Suspense>
  );
}

async function VehicleBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let vehicle;
  try {
    vehicle = await getVehicle(slug);
  } catch (error) {
    if (error instanceof ApiDownError) {
      return (
        <div className="mx-auto max-w-3xl px-4 py-16">
          <StatusCard title="The desk is unreachable" body={error.message} />
        </div>
      );
    }
    throw error;
  }
  if (!vehicle) notFound();
  const kicker = [
    vehicle.capacity ? `${vehicle.capacity} seats` : null,
    vehicle.ownership === "OWN"
      ? "Company fleet"
      : vehicle.ownership === "RENTED"
        ? "Partner vehicle"
        : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      {vehicle.imageUrl ? (
        <div className="h-56 overflow-hidden bg-mist sm:h-72 lg:h-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vehicle.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {vehicle.name}
        </h1>
        {vehicle.description ? (
          <p className="mt-4 text-lg leading-8 text-muted">{vehicle.description}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn-primary">
            Plan My Trip
          </Link>
          <a href={whatsappHref()} className="btn-secondary" target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
