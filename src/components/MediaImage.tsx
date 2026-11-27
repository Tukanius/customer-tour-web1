"use client";

import { uiCopy } from "@/data/uiCopy";
import type { CatalogImage } from "@/types/catalog";
import { useLightbox } from "./ImageLightbox";

export function MediaFallback({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/3] h-full w-full items-center justify-center rounded-2xl bg-mist text-sm text-muted">
      {label}
    </div>
  );
}

export function MediaImage({
  image,
  images,
  index,
  label,
  className = "",
  variant = "page",
}: {
  image?: CatalogImage;
  images: CatalogImage[];
  index: number;
  label: string;
  className?: string;
  variant?: "page" | "sheet";
}) {
  const { open } = useLightbox();
  const frame = variant === "sheet" ? "h-56 w-full sm:h-72" : "aspect-[4/3]";
  if (!image?.url) {
    return (
      <div className={`flex ${frame} w-full items-center justify-center rounded-2xl bg-mist text-sm text-muted ${className}`}>
        {label}
      </div>
    );
  }
  return (
    <button
      type="button"
      className={`group block w-full overflow-hidden rounded-2xl bg-mist text-left ${className}`}
      onClick={() => open(images.length ? images : [image], Math.max(index, 0))}
      aria-label={`${uiCopy.lightbox.open} ${image.name || label}`}
    >
      <span className={`relative block ${frame}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.name || label}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </span>
    </button>
  );
}

export function ImageGallery({
  images,
  all,
}: {
  images: CatalogImage[];
  all?: CatalogImage[];
}) {
  const { open } = useLightbox();
  const set = all && all.length > 0 ? all : images;
  if (images.length === 0) return null;
  return (
    <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
      {images.map((image, index) => (
        <li key={`${image.url}-${index}`}>
          <button
            type="button"
            className="block w-full overflow-hidden rounded-2xl bg-mist"
            onClick={() => {
              const found = set.findIndex((entry) => entry.url === image.url);
              open(set, found >= 0 ? found : index);
            }}
            aria-label={`${uiCopy.lightbox.open} ${image.name || uiCopy.lightbox.photo}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.name || ""}
              className="h-44 w-full object-cover sm:h-56 md:h-64"
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
