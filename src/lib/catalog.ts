import { API_URL, ApiDownError, apiGetJson } from "@/lib/api";
import type {
  CatalogImage,
  CatalogItem,
  CatalogKind,
  CatalogResult,
  TourStop,
} from "@/types/catalog";

const LIST_LIMIT = 100;

type RawImage = { url?: string; name?: string } | string | null | undefined;

function asId(row: Record<string, unknown>): string {
  const slug = typeof row.slug === "string" ? row.slug.trim() : "";
  if (slug) return slug;
  if (typeof row.id === "string" && row.id) return row.id;
  if (typeof row._id === "string" && row._id) return row._id;
  if (row._id != null) return String(row._id);
  return "";
}

function imageUrl(value: RawImage): string | undefined {
  if (!value) return undefined;
  const raw = typeof value === "string" ? value : value.url;
  if (!raw) return undefined;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (!raw.startsWith("/")) return undefined;
  return `${API_URL}${raw}`;
}

function isPublished(row: Record<string, unknown>): boolean {
  if (row.deletedAt) return false;
  if (row.isActive === false) return false;
  return true;
}

function text(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.trim().replace(/\\"/g, '"').replace(/\\'/g, "'");
}

function mapImages(row: Record<string, unknown>): CatalogImage[] {
  if (!Array.isArray(row.images)) return [];
  const out: CatalogImage[] = [];
  for (const img of row.images) {
    const url = imageUrl(img as RawImage);
    if (!url) continue;
    out.push({
      url,
      name:
        typeof img === "object" && img && "name" in img
          ? String(img.name || "")
          : "",
    });
  }
  return out;
}

function mapLocation(row: Record<string, unknown>) {
  const loc = row.location;
  if (!loc || typeof loc !== "object") return null;
  const lat = Number((loc as { lat?: unknown }).lat);
  const lng = Number((loc as { lng?: unknown }).lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  return { lat, lng };
}

function mapStops(row: Record<string, unknown>): TourStop[] {
  const itinerary = row.itinerary ?? row.days ?? row.stops;
  const out: TourStop[] = [];
  if (Array.isArray(itinerary) && itinerary.length > 0) {
    itinerary.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") return;
      const item = entry as Record<string, unknown>;
      const dest =
        item.destination && typeof item.destination === "object"
          ? (item.destination as Record<string, unknown>)
          : item;
      const name =
        text(dest.name) ||
        text(item.title) ||
        text(item.name) ||
        `Stop ${index + 1}`;
      out.push({
        id: asId(dest) || asId(item),
        name,
        region: text(dest.region) || text(item.region),
        title: text(item.title) || text(item.day) || text(item.heading),
        body: text(item.body) || text(item.description) || text(item.notes),
      });
    });
    return out;
  }
  if (!Array.isArray(row.destinations)) return [];
  row.destinations.forEach((entry, index) => {
    if (typeof entry === "string") {
      out.push({ id: entry, name: `Stop ${index + 1}` });
      return;
    }
    if (!entry || typeof entry !== "object") return;
    const dest = entry as Record<string, unknown>;
    out.push({
      id: asId(dest),
      name: text(dest.name) || `Stop ${index + 1}`,
      region: text(dest.region),
    });
  });
  return out;
}

function mapItem(row: Record<string, unknown>, kind: CatalogKind): CatalogItem | null {
  const id = asId(row);
  const name = text(row.name);
  if (!id || !name || !isPublished(row)) return null;
  const gallery = mapImages(row);
  const main = imageUrl(row.mainImage as RawImage) || gallery[0]?.url;
  const duration =
    typeof row.durationDays === "number" && row.durationDays > 0
      ? row.durationDays
      : undefined;
  return {
    id,
    name,
    description: text(row.description) || text(row.summary) || "",
    region: text(row.region),
    imageUrl: main,
    images: gallery,
    location: mapLocation(row),
    capacity: typeof row.capacity === "number" ? row.capacity : undefined,
    ownership: kind === "vehicles" && typeof row.ownership === "string" ? row.ownership : undefined,
    durationDays: duration,
    stops: kind === "tours" ? mapStops(row) : [],
  };
}

function rowsFrom(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (json && typeof json === "object" && Array.isArray((json as { rows?: unknown }).rows)) {
    return (json as { rows: Record<string, unknown>[] }).rows;
  }
  return [];
}

async function readList(kind: CatalogKind): Promise<CatalogItem[]> {
  const { res, json } = await apiGetJson(`/pub/${kind}?isActive=true&limit=${LIST_LIMIT}`);
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(json?.message || `Catalog ${kind} failed (${res.status})`);
  }
  return rowsFrom(json)
    .map((row) => mapItem(row, kind))
    .filter((item): item is CatalogItem => item != null);
}

async function readOne(kind: CatalogKind, id: string): Promise<CatalogItem | null> {
  const { res, json } = await apiGetJson(`/pub/${kind}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(json?.message || "Item could not be loaded.");
  }
  if (!json || typeof json !== "object") return null;
  return mapItem(json as Record<string, unknown>, kind);
}

export async function listCatalog(kind: CatalogKind): Promise<CatalogResult<CatalogItem>> {
  if (!API_URL) {
    return { status: "error", message: "NEXT_PUBLIC_API_URL is not set." };
  }
  try {
    const items = await readList(kind);
    if (items.length === 0) return { status: "empty" };
    return { status: "ok", items };
  } catch (error) {
    if (error instanceof ApiDownError) {
      return { status: "error", message: error.message };
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : "The catalog could not be loaded.",
    };
  }
}

export async function getCatalogItem(
  kind: CatalogKind,
  id: string,
): Promise<CatalogItem | null> {
  if (!id) return null;
  try {
    return await readOne(kind, id);
  } catch (error) {
    if (error instanceof ApiDownError) throw error;
    return null;
  }
}

export const listDestinations = () => listCatalog("destinations");
export const listTours = () => listCatalog("tours");
export const listVehicles = () => listCatalog("vehicles");
export const getDestination = (id: string) => getCatalogItem("destinations", id);
export const getTour = (id: string) => getCatalogItem("tours", id);
export const getVehicle = (id: string) => getCatalogItem("vehicles", id);
