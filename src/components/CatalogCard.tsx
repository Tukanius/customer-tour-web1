"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { uiCopy } from "@/data/uiCopy";
import type { CatalogItem, CatalogKind } from "@/types/catalog";
import { useCatalogSheet } from "./CatalogSheet";

function cardMeta(item: CatalogItem, kind: CatalogKind): string {
  if (kind === "tours") {
    return [item.durationDays ? uiCopy.cards.days(item.durationDays) : null, item.region]
      .filter(Boolean)
      .join(" · ");
  }
  if (kind === "vehicles") {
    return [item.price, item.specs[0]].filter(Boolean).join(" · ");
  }
  return item.region || "";
}

function cardAction(kind: CatalogKind): string {
  if (kind === "tours") return uiCopy.tours.view;
  if (kind === "vehicles") return uiCopy.cars.view;
  return uiCopy.destinations.view;
}

export function CatalogCard({ item, kind }: { item: CatalogItem; kind: CatalogKind }) {
  const sheet = useCatalogSheet();
  const meta = cardMeta(item, kind);
  const action = cardAction(kind);

  const body = (
    <>
      <div className="aspect-[4/3] overflow-hidden bg-mist">
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
      <div className="flex flex-1 flex-col p-4">
        <p className="h-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ocean">
          {meta || "\u00a0"}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-[3.25rem] font-display text-xl leading-snug text-ink">
          {item.name}
        </h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-muted">
          {item.description || "\u00a0"}
        </p>
        <p className="mt-auto pt-4 text-sm font-semibold text-ocean">{action}</p>
      </div>
    </>
  );

  const frame = (child: ReactNode) => (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_18px_40px_-32px_rgb(15_23_42_/_0.45)]">
      {child}
    </article>
  );

  if (kind === "tours") {
    return frame(
      <Link href={`/tours/${item.id}`} className="flex h-full flex-col">
        {body}
      </Link>,
    );
  }

  const open = () =>
    kind === "vehicles"
      ? sheet.openVehicle(item.id, item)
      : sheet.openDestination(item.id, item);

  return frame(
    <button type="button" className="flex h-full w-full flex-col text-left" onClick={open}>
      {body}
    </button>,
  );
}

export function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-5 py-12 text-center shadow-sm">
      <p className="font-display text-2xl text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="aspect-[4/3] animate-pulse bg-mist" />
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <div className="h-3 w-24 animate-pulse rounded bg-mist" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-mist" />
        <div className="h-10 animate-pulse rounded bg-mist/70" />
      </div>
    </div>
  );
}
