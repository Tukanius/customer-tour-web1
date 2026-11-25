import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { AddToTripButton } from "./AddToTripButton";

export function CatalogDetail({
  item,
  kind,
  eyebrow,
}: {
  item: CatalogItem;
  kind: "destination" | "tour" | "vehicle";
  eyebrow: string;
}) {
  const gallery = item.images.length
    ? item.images
    : item.imageUrl
      ? [{ url: item.imageUrl, name: item.name }]
      : [];

  return (
    <article>
      <div className="relative h-56 overflow-hidden bg-sand sm:h-72 lg:h-80">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(160deg,#dce8df,#efe8d9)]" />
        )}
      </div>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          {eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          {item.name}
        </h1>
        {item.description ? (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            {item.description}
          </p>
        ) : (
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            Published from the operator desk. Ask for the current season notes
            when you plan the trip.
          </p>
        )}
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          {item.region ? (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Region
              </dt>
              <dd className="mt-1 text-ink">{item.region}</dd>
            </div>
          ) : null}
          {item.capacity ? (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Seats
              </dt>
              <dd className="mt-1 text-ink">{item.capacity}</dd>
            </div>
          ) : null}
          {item.location ? (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Map
              </dt>
              <dd className="mt-1">
                <a
                  className="text-azure underline-offset-2 hover:underline"
                  href={`https://www.openstreetmap.org/?mlat=${item.location.lat}&mlon=${item.location.lng}#map=8/${item.location.lat}/${item.location.lng}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <AddToTripButton kind={kind} slug={item.id} />
          <Link href="/#trip-request" className="btn-secondary">
            Plan my trip
          </Link>
        </div>
        {gallery.length > 1 ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl text-ink">Gallery</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((image) => (
                <li key={image.url} className="overflow-hidden rounded-2xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.name || ""}
                    className="h-36 w-full object-cover sm:h-44"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}

export function CatalogDetailSkeleton() {
  return (
    <div>
      <div className="h-56 animate-pulse bg-sand sm:h-72" />
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-12 sm:px-6">
        <div className="h-3 w-28 animate-pulse rounded bg-sand" />
        <div className="h-10 w-2/3 animate-pulse rounded bg-sand" />
        <div className="h-24 w-full max-w-2xl animate-pulse rounded bg-sand/70" />
      </div>
    </div>
  );
}
