"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { destinations } from "@/data/tours";
import type { LanguageCode, Region, TravelStyle } from "@/data/types";

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
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  filters: SearchFilters;
  setFilters: (next: SearchFilters) => void;
  appliedFilters: SearchFilters;
  applySearch: () => void;
  clearFilters: () => void;
  selectedIds: string[];
  toggleDestination: (id: string) => void;
  removeDestination: (id: string) => void;
  clearDestinations: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("EN");
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [appliedFilters, setAppliedFilters] =
    useState<SearchFilters>(defaultFilters);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const applySearch = useCallback(() => {
    setAppliedFilters(filters);
    const node = document.getElementById("destinations");
    node?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  }, []);

  const toggleDestination = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }, []);

  const removeDestination = useCallback((id: string) => {
    setSelectedIds((current) => current.filter((item) => item !== id));
  }, []);

  const clearDestinations = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      filters,
      setFilters,
      appliedFilters,
      applySearch,
      clearFilters,
      selectedIds,
      toggleDestination,
      removeDestination,
      clearDestinations,
    }),
    [
      language,
      filters,
      appliedFilters,
      applySearch,
      clearFilters,
      selectedIds,
      toggleDestination,
      removeDestination,
      clearDestinations,
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
