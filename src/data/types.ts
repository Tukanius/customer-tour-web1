export type Region = "gobi" | "altai" | "central" | "north" | "wildlife";

export type TravelStyle =
  | "4x4"
  | "ger"
  | "trek"
  | "homestay"
  | "wildlife";

export type LanguageCode = "EN" | "MN" | "RU" | "KO" | "JA" | "DE";

export interface Destination {
  id: string;
  name: string;
  region: Region;
  season: string;
  summary: string;
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

export interface RoutePreset {
  id: string;
  name: string;
  durationDays: number;
  distanceKm: number;
  stops: RouteStop[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  route: string;
  description: string;
  overnight: string;
  meals: ("Breakfast" | "Lunch" | "Dinner")[];
}

export interface PricingTier {
  id: string;
  label: string;
  travellers: number;
  pricePerPersonUsd: number;
  days: number;
}
