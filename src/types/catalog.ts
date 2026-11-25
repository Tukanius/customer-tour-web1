export interface CatalogImage {
  url: string;
  name?: string;
}

export interface TourStop {
  id: string;
  name: string;
  region?: string;
  title?: string;
  body?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  region?: string;
  imageUrl?: string;
  images: CatalogImage[];
  location?: { lat: number; lng: number } | null;
  capacity?: number;
  ownership?: string;
  durationDays?: number;
  stops: TourStop[];
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
