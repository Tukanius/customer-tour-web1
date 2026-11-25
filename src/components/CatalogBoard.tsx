"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatalogItem } from "@/types/catalog";
import { CatalogCard } from "./CatalogCard";

const PREVIEW = 4;

function kickerOf(item: CatalogItem, kind: "destination" | "tour" | "vehicle") {
  if (kind === "vehicle") {
    return item.capacity ? `${item.capacity} seats` : undefined;
  }
  return item.region;
}

export function CatalogBoard({
  items,
  hrefBase,
  kind,
  previewCount,
  moreHref,
}: {
  items: CatalogItem[];
  hrefBase: "/destinations" | "/tours" | "/car-rent";
  kind: "destination" | "tour" | "vehicle";
  previewCount?: number;
  moreHref?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const limit = previewCount ?? PREVIEW;
  const canToggle = Boolean(previewCount) && items.length > limit;
  const shown = expanded || !canToggle ? items : items.slice(0, limit);

  return (
    <div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((item) => (
          <li key={item.id}>
            <CatalogCard
              item={item}
              href={`${hrefBase}/${item.id}`}
              kind={kind}
              kicker={kickerOf(item, kind)}
            />
          </li>
        ))}
      </ul>
      {canToggle ? (
        <button
          type="button"
          className="btn-secondary mt-8"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : moreHref ? (
        <Link href={moreHref} className="btn-secondary mt-8">
          Show more
        </Link>
      ) : null}
    </div>
  );
}

export function CatalogStatus({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-sand/30 px-5 py-10 text-center">
      <p className="font-display text-xl text-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
    </div>
  );
}
