import Link from "next/link";
import type { CatalogItem } from "@/types/catalog";
import { AddToTripButton } from "./AddToTripButton";

export function CatalogCard({
  item,
  href,
  kind,
  kicker,
}: {
  item: CatalogItem;
  href: string;
  kind: "destination" | "tour" | "vehicle";
  kicker?: string;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="relative h-44 overflow-hidden bg-sand" aria-hidden={!item.imageUrl}>
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
      <div className="flex flex-1 flex-col p-5">
        {kicker ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {kicker}
          </p>
        ) : null}
        <h3 className="mt-2 font-display text-2xl text-ink">{item.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-muted">
          {item.description
            ? item.description.length > 160
              ? `${item.description.slice(0, 157).trim()}…`
              : item.description
            : "Published from the operator desk."}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <AddToTripButton kind={kind} slug={item.id} className="flex-1" />
          <Link href={href} className="btn-secondary flex-1">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function CatalogSkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="h-44 animate-pulse bg-sand" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-sand" />
        <div className="h-6 w-3/4 animate-pulse rounded bg-sand" />
        <div className="h-16 w-full animate-pulse rounded bg-sand/70" />
      </div>
    </div>
  );
}
