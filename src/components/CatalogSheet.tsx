"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { galleryFor, mapCatalogItem } from "@/lib/catalog";
import { uiCopy } from "@/data/uiCopy";
import { vehicleWhatsappHref, whatsappHref } from "@/lib/contact";
import type { CatalogItem, CatalogKind } from "@/types/catalog";
import { ImageGallery, MediaImage } from "./MediaImage";
import { MapsLink } from "./MapsLink";
import { ModalSheet, SheetSkeleton } from "./ModalSheet";
import { WhatsAppIcon } from "./WhatsAppIcon";

interface SheetContextValue {
  openDestination: (id: string, preview?: CatalogItem) => void;
  openVehicle: (id: string, preview?: CatalogItem) => void;
  close: () => void;
  isOpen: boolean;
}

const SheetContext = createContext<SheetContextValue | null>(null);

export function useCatalogSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("useCatalogSheet must be used within CatalogSheetProvider");
  }
  return ctx;
}

/** @deprecated use useCatalogSheet */
export const useDestinationSheet = useCatalogSheet;

function fetchItem(kind: CatalogKind, id: string) {
  return fetch(`${API_URL}/pub/${kind}/${encodeURIComponent(id)}`, {
    headers: { Accept: "application/json" },
  }).then(async (res) => {
    if (!res.ok) throw new Error("missing");
    const json = (await res.json()) as Record<string, unknown>;
    const mapped = mapCatalogItem(json, kind);
    if (!mapped) throw new Error("missing");
    return mapped;
  });
}

export function CatalogSheetProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<CatalogKind | null>(null);
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(false);
  const close = useCallback(() => {
    setKind(null);
  }, []);
  const open = useCallback((next: CatalogKind, id: string, preview?: CatalogItem) => {
    if (preview) setItem(preview);
    setKind(next);
    setLoading(true);
    fetchItem(next, id)
      .then(setItem)
      .catch(() => {
        if (!preview) setItem(null);
      })
      .finally(() => setLoading(false));
  }, []);
  const openDestination = useCallback(
    (id: string, preview?: CatalogItem) => open("destinations", id, preview),
    [open],
  );
  const openVehicle = useCallback(
    (id: string, preview?: CatalogItem) => open("vehicles", id, preview),
    [open],
  );
  const isOpen = kind === "destinations" || kind === "vehicles";

  return (
    <SheetContext.Provider value={{ openDestination, openVehicle, close, isOpen }}>
      {children}
      <ModalSheet
        isOpen={isOpen}
        onClose={close}
        label={kind === "vehicles" ? uiCopy.cars.sheetLabel : uiCopy.destinations.sheetLabel}
        closeLabel={kind === "vehicles" ? uiCopy.cars.close : uiCopy.destinations.close}
        titleId={item ? "catalog-sheet-title" : undefined}
      >
        {loading && !item ? (
          <SheetSkeleton />
        ) : item && kind === "vehicles" ? (
          <VehicleProfile item={item} titleId="catalog-sheet-title" compact />
        ) : item ? (
          <DestinationProfile item={item} titleId="catalog-sheet-title" compact />
        ) : (
          <p className="py-12 text-center text-muted">
            {kind === "vehicles" ? uiCopy.cars.missing : uiCopy.destinations.missing}
          </p>
        )}
      </ModalSheet>
    </SheetContext.Provider>
  );
}

export const DestinationSheetProvider = CatalogSheetProvider;

export function DestinationProfile({
  item,
  titleId,
  compact = false,
}: {
  item: CatalogItem;
  titleId?: string;
  compact?: boolean;
}) {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;
  const gallery = galleryFor(item);
  const extra = item.images.filter((image) => image.url !== item.imageUrl);
  return (
    <div>
      <MediaImage
        image={item.profileImage || (item.imageUrl ? { url: item.imageUrl, name: item.name } : undefined)}
        images={gallery}
        index={0}
        label={uiCopy.tours.noPhoto}
        variant="sheet"
      />
      <div className={compact ? "pt-5" : "mx-auto max-w-3xl px-4 py-10 sm:px-6"}>
        {item.region ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            {item.region}
          </p>
        ) : null}
        <h1
          id={headingId}
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
            {uiCopy.planTrip}
          </Link>
          <a href={whatsappHref()} className="btn-secondary" target="_blank" rel="noreferrer">
            <WhatsAppIcon />
            {uiCopy.whatsapp}
          </a>
        </div>
        {extra.length > 0 ? <ImageGallery images={extra} all={gallery} /> : null}
      </div>
    </div>
  );
}

export function VehicleProfile({
  item,
  titleId,
  compact = false,
}: {
  item: CatalogItem;
  titleId?: string;
  compact?: boolean;
}) {
  const generatedId = useId();
  const headingId = titleId ?? generatedId;
  const gallery = galleryFor(item);
  const extra = item.images.filter((image) => image.url !== item.imageUrl);
  return (
    <div>
      <MediaImage
        image={item.profileImage || (item.imageUrl ? { url: item.imageUrl, name: item.name } : undefined)}
        images={gallery}
        index={0}
        label={uiCopy.tours.noPhoto}
        variant="sheet"
      />
      <div className={compact ? "pt-5" : "mx-auto max-w-3xl px-4 py-10 sm:px-6"}>
        {item.price ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            {item.price}
          </p>
        ) : null}
        <h1
          id={headingId}
          className={`font-display tracking-tight text-ink ${compact ? "mt-2 text-3xl" : "mt-3 text-4xl sm:text-5xl"}`}
        >
          {item.name}
        </h1>
        {item.specs.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.specs.map((spec) => (
              <li
                key={spec}
                className="rounded-full border border-line bg-mist/70 px-3 py-1 text-sm text-ink"
              >
                {spec}
              </li>
            ))}
          </ul>
        ) : null}
        {item.description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{item.description}</p>
        ) : null}
        {item.conditions ? (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{item.conditions}</p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={vehicleWhatsappHref(item.name)}
            className="btn-primary"
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon />
            {uiCopy.cars.enquire}
          </a>
          <Link href="/contact" className="btn-secondary">
            {uiCopy.planTrip}
          </Link>
        </div>
        {extra.length > 0 ? <ImageGallery images={extra} all={gallery} /> : null}
      </div>
    </div>
  );
}
