import { API_URL, ApiDownError, apiGetJson } from "@/lib/api";
import type { CatalogItem, CatalogKind, CatalogResult } from "@/types/catalog";

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

function mapItem(row: Record<string, unknown>, kind: CatalogKind): CatalogItem | null {
  const id = asId(row);
  const name = typeof row.name === "string" ? row.name.trim() : "";
  if (!id || !name || !isPublished(row)) return null;
  const description =
    (typeof row.description === "string" && row.description) ||
    (typeof row.summary === "string" && row.summary) ||
    "";
  const gallery = Array.isArray(row.images)
    ? row.images
        .map((img) => {
          const url = imageUrl(img as RawImage);
          return url
            ? { url, name: typeof img === "object" && img && "name" in img ? String(img.name || "") : "" }
            : null;
        })
        .filter((img): img is { url: string; name: string } => img != null)
    : [];
  const main = imageUrl(row.mainImage as RawImage) || gallery[0]?.url;
  const location =
    row.location &&
    typeof row.location === "object" &&
    row.location !== null &&
    "lat" in row.location &&
    "lng" in row.location
      ? {
          lat: Number((row.location as { lat: number }).lat),
          lng: Number((row.location as { lng: number }).lng),
        }
      : null;
  return {
    id,
    name,
    description,
    region: typeof row.region === "string" && row.region.trim() ? row.region.trim() : undefined,
    imageUrl: main,
    images: gallery,
    location,
    capacity: typeof row.capacity === "number" ? row.capacity : undefined,
    ownership: kind === "vehicles" && typeof row.ownership === "string" ? row.ownership : undefined,
  };
}

function rowsFrom(json: unknown): Record<string, unknown>[] {
  if (Array.isArray(json)) return json as Record<string, unknown>[];
  if (json && typeof json === "object" && Array.isArray((json as { rows?: unknown }).rows)) {
    return (json as { rows: Record<string, unknown>[] }).rows;
  }
  return [];
}

let adminToken: string | null = null;

async function adminLogin(): Promise<string | null> {
  const email = process.env.TOUR_API_ADMIN_EMAIL;
  const password = process.env.TOUR_API_ADMIN_PASSWORD;
  if (!email || !password) return null;
  if (adminToken) return adminToken;
  const { res, json } = await apiGetJson("/admin/auth/login", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok || !json?.accessToken) return null;
  adminToken = json.accessToken as string;
  return adminToken;
}

async function readList(
  kind: CatalogKind,
): Promise<{ items: CatalogItem[]; missing: boolean }> {
  const pubPath = `/pub/${kind}?isActive=true&limit=${LIST_LIMIT}`;
  const { res, json } = await apiGetJson(pubPath);
  if (res.ok) {
    return {
      items: rowsFrom(json)
        .map((row) => mapItem(row, kind))
        .filter((item): item is CatalogItem => item != null),
      missing: false,
    };
  }
  if (res.status !== 404 && res.status !== 401) {
    throw new Error(json?.message || `Catalog ${kind} failed (${res.status})`);
  }

  const token = await adminLogin();
  if (!token) {
    return { items: [], missing: true };
  }
  const adminPath =
    kind === "vehicles"
      ? `/admin/vehicles?isActive=true&limit=${LIST_LIMIT}`
      : kind === "tours"
        ? `/admin/tours?isActive=true&limit=${LIST_LIMIT}`
        : `/admin/destinations?isActive=true&limit=${LIST_LIMIT}`;
  const admin = await apiGetJson(adminPath, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (admin.res.status === 401) {
    adminToken = null;
    const retry = await adminLogin();
    if (!retry) return { items: [], missing: true };
    const again = await apiGetJson(adminPath, {
      headers: { Accept: "application/json", Authorization: `Bearer ${retry}` },
    });
    if (again.res.status === 404) return { items: [], missing: true };
    if (!again.res.ok) {
      throw new Error(again.json?.message || `Catalog ${kind} failed`);
    }
    return {
      items: rowsFrom(again.json)
        .map((row) => mapItem(row, kind))
        .filter((item): item is CatalogItem => item != null),
      missing: false,
    };
  }
  if (admin.res.status === 404) {
    return { items: [], missing: true };
  }
  if (!admin.res.ok) {
    throw new Error(admin.json?.message || `Catalog ${kind} failed`);
  }
  return {
    items: rowsFrom(admin.json)
      .map((row) => mapItem(row, kind))
      .filter((item): item is CatalogItem => item != null),
    missing: false,
  };
}

async function readOne(kind: CatalogKind, id: string): Promise<CatalogItem | null> {
  const encoded = encodeURIComponent(id);
  const pub = await apiGetJson(`/pub/${kind}/${encoded}`);
  if (pub.res.ok && pub.json && typeof pub.json === "object") {
    return mapItem(pub.json as Record<string, unknown>, kind);
  }
  const token = await adminLogin();
  if (!token) {
    if (pub.res.status === 404) return null;
    throw new Error(pub.json?.message || "Item could not be loaded.");
  }
  const adminKind =
    kind === "vehicles" ? "vehicles" : kind === "tours" ? "tours" : "destinations";
  const admin = await apiGetJson(`/admin/${adminKind}/${encoded}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });
  if (admin.res.status === 404) return null;
  if (!admin.res.ok) {
    throw new Error(admin.json?.message || "Item could not be loaded.");
  }
  return mapItem(admin.json as Record<string, unknown>, kind);
}

export async function listCatalog(kind: CatalogKind): Promise<CatalogResult<CatalogItem>> {
  if (!API_URL) {
    return { status: "error", message: "NEXT_PUBLIC_API_URL is not set." };
  }
  try {
    const { items, missing } = await readList(kind);
    if (missing && kind === "tours") {
      return { status: "empty" };
    }
    if (missing) {
      return {
        status: "error",
        message: "The public catalog is not on the API yet.",
      };
    }
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
