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

function destinationRef(value: unknown): { id: string; name?: string; region?: string } {
  if (typeof value === "string" && value) return { id: value };
  if (!value || typeof value !== "object") return { id: "" };
  const dest = value as Record<string, unknown>;
  return {
    id: asId(dest),
    name: text(dest.name),
    region: text(dest.region),
  };
}

function mapStops(row: Record<string, unknown>): TourStop[] {
  const itinerary = row.itinerary ?? row.days ?? row.stops;
  const out: TourStop[] = [];
  if (Array.isArray(itinerary) && itinerary.length > 0) {
    for (const entry of itinerary) {
      if (!entry || typeof entry !== "object") continue;
      const item = entry as Record<string, unknown>;
      const dest = destinationRef(item.destination);
      const name = text(item.name) || dest.name;
      if (!name) continue;
      out.push({
        id: dest.id,
        name,
        region: dest.region || text(item.region),
        title: text(item.title) || text(item.day) || text(item.heading),
        body: text(item.body) || text(item.description) || text(item.notes),
      });
    }
    return out;
  }
  if (!Array.isArray(row.destinations)) return [];
  for (const entry of row.destinations) {
    const dest = destinationRef(entry);
    if (!dest.id && !dest.name) continue;
    out.push({
      id: dest.id,
      name: dest.name || dest.id,
      region: dest.region,
    });
  }
  return out;
}

function mapPrice(row: Record<string, unknown>): string | undefined {
  const raw = row.price ?? row.dailyPrice ?? row.rate ?? row.rentalPrice;
  if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  return text(raw);
}

function mapConditions(row: Record<string, unknown>): string | undefined {
  return text(row.conditions) || text(row.terms) || text(row.rentalConditions);
}

function mapSpecs(row: Record<string, unknown>, kind: CatalogKind): string[] {
  const specs: string[] = [];
  if (kind === "vehicles" && typeof row.capacity === "number" && row.capacity > 0) {
    specs.push(row.capacity === 1 ? "1 seat" : `${row.capacity} seats`);
  }
  if (kind === "vehicles" && row.ownership === "OWN") specs.push("Company vehicle");
  if (kind === "vehicles" && row.ownership === "RENTED") specs.push("Partner vehicle");
  const extra = row.specs ?? row.specifications;
  if (Array.isArray(extra)) {
    for (const entry of extra) {
      const value = text(entry);
      if (value && !specs.includes(value)) specs.push(value);
    }
  }
  for (const key of ["engine", "transmission", "fuel", "year"] as const) {
    const raw = row[key];
    const value = typeof raw === "number" && Number.isFinite(raw) ? String(raw) : text(raw);
    if (value && !specs.includes(value)) specs.push(value);
  }
  return specs;
}

export function mapCatalogItem(
  row: Record<string, unknown>,
  kind: CatalogKind,
): CatalogItem | null {
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
    featured: row.isFeatured === true || row.featured === true,
    price: kind === "vehicles" ? mapPrice(row) : undefined,
    specs: kind === "vehicles" ? mapSpecs(row, kind) : [],
    conditions: kind === "vehicles" ? mapConditions(row) : undefined,
    stops: kind === "tours" ? mapStops(row) : [],
  };
}

export function pickFeatured(items: CatalogItem[], count = 3): CatalogItem[] {
  const featured = items.filter((item) => item.featured);
  if (featured.length === 0) return items.slice(0, count);
  const rest = items.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, count);
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
    .map((row) => mapCatalogItem(row, kind))
    .filter((item): item is CatalogItem => item != null);
}

async function readOne(kind: CatalogKind, id: string): Promise<CatalogItem | null> {
  const { res, json } = await apiGetJson(`/pub/${kind}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(json?.message || "Item could not be loaded.");
  }
  if (!json || typeof json !== "object") return null;
  return mapCatalogItem(json as Record<string, unknown>, kind);
}

export async function listCatalog(kind: CatalogKind): Promise<CatalogResult<CatalogItem>> {
  if (!API_URL) {
    return { status: "error", message: "Could not load this list. Please try again." };
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
      message: error instanceof Error ? error.message : "Could not load this list. Please try again.",
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
