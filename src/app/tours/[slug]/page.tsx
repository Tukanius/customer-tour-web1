import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MapsLink } from "@/components/MapsLink";
import { StatusCard } from "@/components/PhotoCard";
import { TourItinerary } from "@/components/TourItinerary";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { ApiDownError } from "@/lib/api";
import { getTour } from "@/lib/catalog";
import { whatsappHref } from "@/lib/contact";

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tour = await getTour(slug);
    if (!tour) return { title: "Tour not found" };
    return { title: tour.name, description: tour.description || tour.name };
  } catch {
    return { title: "Tours" };
  }
}

export default function TourDetailPage({ params }: PageProps<"/tours/[slug]">) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-mist" />}>
      <TourBody params={params} />
    </Suspense>
  );
}

async function TourBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let tour;
  try {
    tour = await getTour(slug);
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
  if (!tour) notFound();
  const kicker = [
    tour.durationDays ? `${tour.durationDays} days` : null,
    tour.region,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article>
      {tour.imageUrl ? (
        <div className="h-64 overflow-hidden bg-mist sm:h-80 md:h-[28rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tour.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
            {kicker}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {tour.name}
        </h1>
        {tour.description ? (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            {tour.description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <MapsLink location={tour.location} />
          <Link href="/contact" className="btn-primary">
            Plan My Trip
          </Link>
          <a href={whatsappHref()} className="btn-secondary" target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
        {tour.stops.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-ink">Itinerary</h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Stops published on this tour. Open a destination for photos and
              the map.
            </p>
            <div className="mt-6">
              <TourItinerary stops={tour.stops} />
            </div>
          </section>
        ) : null}
        {tour.images.length > 1 ? (
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tour.images.map((image) => (
              <li key={image.url} className="overflow-hidden rounded-2xl bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name || ""}
                  className="h-36 w-full object-cover sm:h-44"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
