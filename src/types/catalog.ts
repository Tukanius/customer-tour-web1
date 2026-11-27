export interface CatalogImage {
  url: string;
  name?: string;
}

export interface NamedRef {
  id: string;
  name: string;
  region?: string;
}

export interface TourDay {
  day: number;
  name?: string;
  description?: string;
  travelDistance?: string;
  travelTime?: string;
  activities: NamedRef[];
  destinations: NamedRef[];
  meals: string[];
  overnight?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  region?: string;
  date?: string;
  imageUrl?: string;
  profileImage?: CatalogImage;
  mapImage?: CatalogImage;
  images: CatalogImage[];
  location?: { lat: number; lng: number } | null;
  capacity?: number;
  ownership?: string;
  durationDays?: number;
  featured?: boolean;
  price?: string;
  specs: string[];
  conditions?: string;
  days: TourDay[];
}

export type CatalogKind = "destinations" | "tours" | "vehicles";

export type CatalogResult<T> =
  | { status: "ok"; items: T[] }
  | { status: "empty" }
  | { status: "error"; message: string };

export type InquiryPostResult =
  | { status: "sent" }
  | { status: "pending"; message: string }
  | { status: "error"; message: string };
