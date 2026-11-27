import { API_URL, ApiDownError, apiGetJson } from "@/lib/api";
import type {
  CatalogImage,
  CatalogItem,
  CatalogKind,
  CatalogResult,
  NamedRef,
  TourDay,
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

function namedRef(value: unknown): NamedRef | null {
  if (typeof value === "string" && value.trim()) {
    const raw = value.trim();
    if (/^[a-f0-9]{24}$/i.test(raw)) return null;
    return { id: raw, name: raw };
  }
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const name = text(row.name) || text(row.title) || text(row.dayName);
  const id = asId(row);
  if (!name && !id) return null;
  if (!name) return null;
  return { id, name, region: text(row.region) };
}

function namedList(value: unknown): NamedRef[] {
  if (!Array.isArray(value)) {
    const single = namedRef(value);
    return single ? [single] : [];
  }
  const out: NamedRef[] = [];
  for (const entry of value) {
    const item = namedRef(entry);
    if (!item) continue;
    if (out.some((existing) => existing.id && existing.id === item.id)) continue;
    out.push(item);
  }
  return out;
}

function mapMeals(item: Record<string, unknown>): string[] {
  const labels: string[] = [];
  const add = (value: unknown, fallback?: string) => {
    if (value === true && fallback) labels.push(fallback);
    else {
      const t = text(value);
      if (t) labels.push(t);
    }
  };
  if (Array.isArray(item.meals)) {
    for (const meal of item.meals) add(meal);
    return labels;
  }
  const meals = item.meals;
  if (meals && typeof meals === "object") {
    const bag = meals as Record<string, unknown>;
    add(bag.breakfast, "Breakfast");
    add(bag.lunch, "Lunch");
    add(bag.dinner, "Dinner");
    return labels;
  }
  add(item.breakfast, "Breakfast");
  add(item.lunch, "Lunch");
  add(item.dinner, "Dinner");
  return labels;
}

function formatTravelTime(item: Record<string, unknown>): string | undefined {
  const preset = text(item.travelTime);
  if (preset) return preset;
  const hoursRaw = item.travelHours ?? item.hours;
  const minutesRaw = item.travelMinutes ?? item.minutes;
  const hours = typeof hoursRaw === "number" && hoursRaw > 0 ? hoursRaw : 0;
  const minutes = typeof minutesRaw === "number" && minutesRaw > 0 ? minutesRaw : 0;
  if (!hours && !minutes) return undefined;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  return parts.join(" ");
}

function formatDistance(item: Record<string, unknown>): string | undefined {
  const preset = text(item.travelDistance) || text(item.distance);
  if (preset) return preset;
  const km = item.travelDistanceKm ?? item.distanceKm;
  if (typeof km === "number" && Number.isFinite(km) && km > 0) return `${km} km`;
  if (typeof km === "string" && km.trim()) return km.trim();
  return undefined;
}

function mapImage(value: RawImage, fallbackName = ""): CatalogImage | undefined {
  const url = imageUrl(value);
  if (!url) return undefined;
  const name =
    typeof value === "object" && value && "name" in value
      ? String(value.name || fallbackName)
      : fallbackName;
  return { url, name };
}

function mapTourDays(row: Record<string, unknown>): TourDay[] {
  const itinerary = row.itinerary ?? row.days ?? row.tourDays ?? row.stops;
  if (!Array.isArray(itinerary) || itinerary.length === 0) return [];
  const out: TourDay[] = [];
  itinerary.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    const item = entry as Record<string, unknown>;
    const destinations = namedList(
      item.destinations ?? item.destination,
    );
    const name =
      text(item.dayName) ||
      text(item.name) ||
      text(item.title) ||
      destinations[0]?.name;
    const description = text(item.description) || text(item.body) || text(item.notes);
    const travelDistance = formatDistance(item);
    const travelTime = formatTravelTime(item);
    const activities = namedList(item.activities);
    const meals = mapMeals(item);
    const overnight = text(item.overnight) || text(item.accommodation);
    if (
      !name &&
      !description &&
      !travelDistance &&
      !travelTime &&
      activities.length === 0 &&
      destinations.length === 0 &&
      meals.length === 0 &&
      !overnight
    ) {
      return;
    }
    out.push({
      day: out.length + 1,
      name,
      description,
      travelDistance,
      travelTime,
      activities,
      destinations,
      meals,
      overnight,
    });
  });
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

function mapDuration(row: Record<string, unknown>, days: TourDay[]): number | undefined {
  if (typeof row.durationDays === "number" && row.durationDays > 0) return row.durationDays;
  if (typeof row.duration === "number" && row.duration > 0) return row.duration;
  const parsed = Number.parseInt(String(row.duration ?? ""), 10);
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  if (days.length > 0) return days.length;
  return undefined;
}

export function mapCatalogItem(
  row: Record<string, unknown>,
  kind: CatalogKind,
): CatalogItem | null {
  const id = asId(row);
  const name = text(row.title) || text(row.name);
  if (!id || !name || !isPublished(row)) return null;
  const gallery = mapImages(row);
  const profile =
    mapImage(row.profileImage as RawImage, name) ||
    mapImage(row.mainImage as RawImage, name) ||
    gallery[0];
  const map = mapImage(row.mapImage as RawImage, "Map");
  const days = kind === "tours" ? mapTourDays(row) : [];
  return {
    id,
    name,
    description: text(row.description) || text(row.summary) || "",
    region: text(row.region),
    date: text(row.date),
    imageUrl: profile?.url,
    profileImage: profile,
    mapImage: map,
    images: gallery,
    location: mapLocation(row),
    capacity: typeof row.capacity === "number" ? row.capacity : undefined,
    ownership: kind === "vehicles" && typeof row.ownership === "string" ? row.ownership : undefined,
    durationDays: mapDuration(row, days),
    featured: row.isFeatured === true || row.featured === true,
    price: kind === "vehicles" ? mapPrice(row) : undefined,
    specs: kind === "vehicles" ? mapSpecs(row, kind) : [],
    conditions: kind === "vehicles" ? mapConditions(row) : undefined,
    days,
  };
}

export function galleryFor(item: CatalogItem): CatalogImage[] {
  const out: CatalogImage[] = [];
  const add = (image?: CatalogImage) => {
    if (!image?.url) return;
    if (out.some((existing) => existing.url === image.url)) return;
    out.push(image);
  };
  add(item.profileImage || (item.imageUrl ? { url: item.imageUrl, name: item.name } : undefined));
  add(item.mapImage);
  for (const image of item.images) add(image);
  return out;
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
