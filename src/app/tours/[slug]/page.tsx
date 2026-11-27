import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { ImageGallery, MediaImage } from "@/components/MediaImage";
import { MapsLink } from "@/components/MapsLink";
import { TourItinerary } from "@/components/TourItinerary";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { uiCopy } from "@/data/uiCopy";
import { ApiDownError } from "@/lib/api";
import { galleryFor, getTour } from "@/lib/catalog";
import { whatsappHref } from "@/lib/contact";

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tour = await getTour(slug);
    if (!tour) return { title: uiCopy.status.tourMissing };
    return { title: tour.name, description: tour.description || tour.name };
  } catch {
    return { title: uiCopy.tours.title };
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
          <StatusCard title={uiCopy.status.unreachable} body={error.message} />
        </div>
      );
    }
    throw error;
  }
  if (!tour) notFound();
  const kicker = [
    tour.durationDays ? uiCopy.cards.days(tour.durationDays) : null,
    tour.date,
    tour.region,
  ]
    .filter(Boolean)
    .join(" · ");
  const gallery = galleryFor(tour);
  const extra = tour.images.filter(
    (image) => image.url !== tour.profileImage?.url && image.url !== tour.mapImage?.url,
  );
  const profileIndex = gallery.findIndex((image) => image.url === tour.profileImage?.url);
  const mapIndex = gallery.findIndex((image) => image.url === tour.mapImage?.url);

  return (
    <article>
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
              {uiCopy.tours.profile}
            </p>
            <MediaImage
              image={tour.profileImage}
              images={gallery}
              index={profileIndex >= 0 ? profileIndex : 0}
              label={uiCopy.tours.noPhoto}
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
              {uiCopy.tours.map}
            </p>
            <MediaImage
              image={tour.mapImage}
              images={gallery}
              index={mapIndex >= 0 ? mapIndex : Math.max(gallery.length - 1, 0)}
              label={uiCopy.tours.noPhoto}
            />
          </div>
        </div>
      </div>
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
            {uiCopy.planTrip}
          </Link>
          <a href={whatsappHref()} className="btn-secondary" target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            {uiCopy.whatsapp}
          </a>
        </div>
        {tour.days.length > 0 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-ink">{uiCopy.tours.itinerary}</h2>
            <div className="mt-6">
              <TourItinerary days={tour.days} />
            </div>
          </section>
        ) : null}
        {extra.length > 0 ? <ImageGallery images={extra} all={gallery} /> : null}
      </div>
    </article>
  );
}
