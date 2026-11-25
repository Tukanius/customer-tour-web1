"use client";

import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { useDestinationSheet } from "./DestinationSheet";

export function DestinationCard({ item }: { item: CatalogItem }) {
  const { openDestination } = useDestinationSheet();
  return (
    <article className="group overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_18px_40px_-32px_rgb(15_23_42_/_0.45)]">
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => openDestination(item.id, item)}
      >
        <CardMedia item={item} />
        <div className="p-5">
          {item.region ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
              {item.region}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-2xl text-ink">{item.name}</h3>
          {item.description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
              {item.description}
            </p>
          ) : null}
          <p className="mt-4 text-sm font-semibold text-ocean">View place</p>
        </div>
      </button>
    </article>
  );
}

export function TourCard({ item }: { item: CatalogItem }) {
  const kicker = [
    item.durationDays ? `${item.durationDays} days` : null,
    item.region,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_18px_40px_-32px_rgb(15_23_42_/_0.45)]">
      <Link href={`/tours/${item.id}`} className="flex h-full flex-col">
        <CardMedia item={item} />
        <div className="flex flex-1 flex-col p-5">
          {kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
              {kicker}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-2xl text-ink">{item.name}</h3>
          {item.description ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">
              {item.description}
            </p>
          ) : null}
          <p className="mt-4 text-sm font-semibold text-ocean">View tour</p>
        </div>
      </Link>
    </article>
  );
}

export function VehicleCard({ item }: { item: CatalogItem }) {
  const kicker = [
    item.capacity ? `${item.capacity} seats` : null,
    item.ownership === "OWN" ? "Company fleet" : item.ownership === "RENTED" ? "Partner" : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_18px_40px_-32px_rgb(15_23_42_/_0.45)]">
      <Link href={`/car-rent/${item.id}`} className="flex h-full flex-col">
        <CardMedia item={item} />
        <div className="flex flex-1 flex-col p-5">
          {kicker ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
              {kicker}
            </p>
          ) : null}
          <h3 className="mt-1 font-display text-2xl text-ink">{item.name}</h3>
          {item.description ? (
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-muted">
              {item.description}
            </p>
          ) : null}
          <p className="mt-4 text-sm font-semibold text-ocean">View vehicle</p>
        </div>
      </Link>
    </article>
  );
}

function CardMedia({ item }: { item: CatalogItem }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-mist">
      {item.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="h-full w-full bg-[linear-gradient(160deg,#e0f2fe,#f8fcff)]" />
      )}
    </div>
  );
}

export function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper px-5 py-12 text-center shadow-sm">
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-paper">
      <div className="aspect-[16/10] animate-pulse bg-mist" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-mist" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-mist" />
        <div className="h-16 animate-pulse rounded bg-mist/70" />
      </div>
    </div>
  );
}
