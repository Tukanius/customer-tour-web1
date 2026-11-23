"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { destinations, tours } from "@/data/travelData";
import type { Region, TravelStyle } from "@/types/travel";

export type TravellerCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface SearchFilters {
  where: Region | "anywhere";
  style: TravelStyle | "any";
  when: number | "any";
  travellers: TravellerCount;
}

const defaultFilters: SearchFilters = {
  where: "anywhere",
  style: "any",
  when: "any",
  travellers: 2,
};

interface TripContextValue {
  filters: SearchFilters;
  setFilters: (next: SearchFilters) => void;
  appliedFilters: SearchFilters;
  applySearch: () => void;
  clearFilters: () => void;
  destinationSlugs: string[];
  tourSlugs: string[];
  vehicleSlugs: string[];
  toggleDestination: (slug: string) => void;
  toggleTour: (slug: string) => void;
  toggleVehicle: (slug: string) => void;
  removeDestination: (slug: string) => void;
  removeTour: (slug: string) => void;
  removeVehicle: (slug: string) => void;
  clearTrip: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

function toggleIn(list: string[], slug: string) {
  return list.includes(slug)
    ? list.filter((item) => item !== slug)
    : [...list, slug];
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(defaultFilters);
  const [destinationSlugs, setDestinationSlugs] = useState<string[]>([]);
  const [tourSlugs, setTourSlugs] = useState<string[]>([]);
  const [vehicleSlugs, setVehicleSlugs] = useState<string[]>([]);

  const applySearch = useCallback(() => {
    setAppliedFilters(filters);
    document
      .getElementById("destinations")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  }, []);

  const toggleDestination = useCallback((slug: string) => {
    setDestinationSlugs((list) => toggleIn(list, slug));
  }, []);
  const toggleTour = useCallback((slug: string) => {
    setTourSlugs((list) => toggleIn(list, slug));
  }, []);
  const toggleVehicle = useCallback((slug: string) => {
    setVehicleSlugs((list) => toggleIn(list, slug));
  }, []);
  const removeDestination = useCallback((slug: string) => {
    setDestinationSlugs((list) => list.filter((item) => item !== slug));
  }, []);
  const removeTour = useCallback((slug: string) => {
    setTourSlugs((list) => list.filter((item) => item !== slug));
  }, []);
  const removeVehicle = useCallback((slug: string) => {
    setVehicleSlugs((list) => list.filter((item) => item !== slug));
  }, []);
  const clearTrip = useCallback(() => {
    setDestinationSlugs([]);
    setTourSlugs([]);
    setVehicleSlugs([]);
  }, []);

  const value = useMemo(
    () => ({
      filters,
      setFilters,
      appliedFilters,
      applySearch,
      clearFilters,
      destinationSlugs,
      tourSlugs,
      vehicleSlugs,
      toggleDestination,
      toggleTour,
      toggleVehicle,
      removeDestination,
      removeTour,
      removeVehicle,
      clearTrip,
    }),
    [
      filters,
      appliedFilters,
      applySearch,
      clearFilters,
      destinationSlugs,
      tourSlugs,
      vehicleSlugs,
      toggleDestination,
      toggleTour,
      toggleVehicle,
      removeDestination,
      removeTour,
      removeVehicle,
      clearTrip,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within TripProvider");
  }
  return context;
}

export function filterDestinations(filters: SearchFilters) {
  return destinations.filter((destination) => {
    if (filters.where !== "anywhere" && destination.region !== filters.where) {
      return false;
    }
    if (filters.style !== "any" && !destination.styles.includes(filters.style)) {
      return false;
    }
    if (filters.when !== "any" && !destination.months.includes(filters.when)) {
      return false;
    }
    return true;
  });
}

export function filterTours(filters: SearchFilters) {
  return tours.filter((tour) => {
    if (
      filters.where !== "anywhere" &&
      tour.region !== "mixed" &&
      tour.region !== filters.where
    ) {
      return false;
    }
    if (filters.style !== "any" && !tour.styles.includes(filters.style)) {
      return false;
    }
    return true;
  });
}
