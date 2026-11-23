export type Region = "gobi" | "altai" | "central" | "north" | "wildlife";

export type TravelStyle =
  | "4x4"
  | "ger"
  | "trek"
  | "homestay"
  | "wildlife";

export type DriveMode = "self-drive" | "with-driver";

export type Meal = "Breakfast" | "Lunch" | "Dinner";

export interface Destination {
  slug: string;
  name: string;
  region: Region;
  season: string;
  summary: string;
  overview: string;
  highlights: string[];
  nearby: string[];
  styles: TravelStyle[];
  months: number[];
}

export interface RouteStop {
  id: string;
  number: number;
  name: string;
  description: string;
  distanceFromStartKm: number;
  x: number;
  y: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  route: string;
  description: string;
  overnight: string;
  meals: Meal[];
}

export interface PricingTier {
  id: string;
  label: string;
  travellers: number;
  pricePerPersonUsd: number;
  days: number;
}

export interface Tour {
  slug: string;
  name: string;
  durationDays: number;
  region: Region | "mixed";
  startingPriceUsd: number;
  summary: string;
  distanceKm: number;
  styles: TravelStyle[];
  stops: RouteStop[];
  days: ItineraryDay[];
  pricing: PricingTier[];
  included: string[];
  notIncluded: string[];
  packing: string[];
}

export interface VehicleSpec {
  label: string;
  value: string;
}

export interface RateLine {
  label: string;
  amountUsd: number;
  note?: string;
}

export interface Vehicle {
  slug: string;
  name: string;
  summary: string;
  dailyRateUsd: number;
  seats: number;
  driveModes: DriveMode[];
  specs: VehicleSpec[];
  insurance: string[];
  equipment: string[];
  rateBreakdown: RateLine[];
  roadSuitability: string[];
}
