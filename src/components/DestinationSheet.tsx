"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { whatsappHref } from "@/lib/contact";
import type { CatalogItem } from "@/types/catalog";
import { MapsLink } from "./MapsLink";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface SheetContextValue {
  openDestination: (id: string, preview?: CatalogItem) => void;
  close: () => void;
  isOpen: boolean;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function useDestinationSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useDestinationSheet must be used within DestinationSheetProvider");
  }
  return ctx;
}

function mapRow(row: Record<string, unknown>): CatalogItem | null {
  const id = typeof row._id === "string" ? row._id : typeof row.id === "string" ? row.id : "";
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!id || !name || row.isActive === false || row.deletedAt) return null;
  const images = Array.isArray(row.images)
    ? row.images
        .map((img) => {
          if (!img || typeof img !== "object" || !("url" in img)) return null;
          const url = String((img as { url?: string }).url || "");
          return url ? { url, name: String((img as { name?: string }).name || "") } : null;
        })
        .filter((img): img is { url: string; name: string } => img != null)
    : [];
  const main =
    row.mainImage && typeof row.mainImage === "object" && "url" in row.mainImage
      ? String((row.mainImage as { url?: string }).url || "")
      : images[0]?.url;
  const loc = row.location as { lat?: number; lng?: number } | null | undefined;
  const lat = Number(loc?.lat);
  const lng = Number(loc?.lng);
  return {
    id,
    name,
    description:
      typeof row.description === "string"
        ? row.description.trim().replace(/\\"/g, '"').replace(/\\'/g, "'")
        : "",
    region: typeof row.region === "string" && row.region.trim() ? row.region.trim() : undefined,
    imageUrl: main || undefined,
    images,
    location: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
    stops: [],
  };
}

export function DestinationSheetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(false);
  const close = useCallback(() => {
    setOpen(false);
  }, []);
  const openDestination = useCallback((id: string, preview?: CatalogItem) => {
    if (preview) setItem(preview);
    setOpen(true);
    setLoading(true);
    fetch(`${API_URL}/pub/destinations/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("missing");
        const json = (await res.json()) as Record<string, unknown>;
        const mapped = mapRow(json);
        if (mapped) setItem(mapped);
      })
      .catch(() => {
        if (!preview) setItem(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SheetContext.Provider value={{ openDestination, close, isOpen }}>
      {children}
      <DestinationSheet item={item} loading={loading} isOpen={isOpen} onClose={close} />
    </SheetContext.Provider>
  );
}

function DestinationSheet({
  item,
  loading,
  isOpen,
  onClose,
}: {
  item: CatalogItem | null;
  loading: boolean;
  isOpen: boolean;
  onClose: () => void;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close destination"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute inset-x-0 bottom-0 flex max-h-[95vh] min-h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(90vh,880px)] md:w-[min(90vw,880px)] md:max-h-[90vh] md:min-h-0 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).dataset.handle !== "sheet") return;
          dragStart.current = event.clientY;
        }}
        onPointerUp={(event) => {
          if (dragStart.current != null && event.clientY - dragStart.current > 90) {
            onClose();
          }
          dragStart.current = null;
        }}
      >
        <div
          data-handle="sheet"
          className="flex shrink-0 cursor-grab flex-col items-center pt-3 md:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-3 md:px-6 md:pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            Destination
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label="Dismiss destination"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:pb-8">
          {loading && !item ? (
            <div className="space-y-4">
              <div className="h-52 animate-pulse rounded-2xl bg-mist" />
              <div className="h-8 w-2/3 animate-pulse rounded bg-mist" />
              <div className="h-24 animate-pulse rounded bg-mist/80" />
            </div>
          ) : item ? (
            <DestinationProfile item={item} titleId={titleId} compact />
          ) : (
            <p className="py-12 text-center text-muted">This place is not published.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function DestinationProfile({
  item,
  titleId,
  compact = false,
}: {
  item: CatalogItem;
  titleId?: string;
  compact?: boolean;
}) {
  const gallery = item.images.length
    ? item.images
    : item.imageUrl
      ? [{ url: item.imageUrl, name: item.name }]
      : [];

  return (
    <div>
      {item.imageUrl ? (
        <div className={`overflow-hidden bg-mist ${compact ? "h-52 rounded-2xl" : "h-64 sm:h-80 md:h-[28rem]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
      <div className={compact ? "pt-5" : "mx-auto max-w-3xl px-4 py-10 sm:px-6"}>
        {item.region ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            {item.region}
          </p>
        ) : null}
        <h1
          id={titleId}
          className={`font-display tracking-tight text-ink ${compact ? "mt-2 text-3xl" : "mt-3 text-4xl sm:text-5xl"}`}
        >
          {item.name}
        </h1>
        {item.description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{item.description}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <MapsLink location={item.location} />
          <Link href="/contact" className="btn-primary">
            Plan My Trip
          </Link>
          <a href={whatsappHref()} className="btn-secondary" target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            WhatsApp
          </a>
        </div>
        {gallery.length > 1 ? (
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {gallery.map((image) => (
              <li key={image.url} className="overflow-hidden rounded-2xl bg-mist">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name || ""}
                  className="h-28 w-full object-cover sm:h-36"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
