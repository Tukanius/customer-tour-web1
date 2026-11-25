"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TripContextValue {
  destinationIds: string[];
  tourIds: string[];
  vehicleIds: string[];
  toggleDestination: (id: string) => void;
  toggleTour: (id: string) => void;
  toggleVehicle: (id: string) => void;
  removeDestination: (id: string) => void;
  removeTour: (id: string) => void;
  removeVehicle: (id: string) => void;
  clearTrip: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

function toggleIn(list: string[], id: string) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [destinationIds, setDestinationIds] = useState<string[]>([]);
  const [tourIds, setTourIds] = useState<string[]>([]);
  const [vehicleIds, setVehicleIds] = useState<string[]>([]);

  const toggleDestination = useCallback((id: string) => {
    setDestinationIds((list) => toggleIn(list, id));
  }, []);
  const toggleTour = useCallback((id: string) => {
    setTourIds((list) => toggleIn(list, id));
  }, []);
  const toggleVehicle = useCallback((id: string) => {
    setVehicleIds((list) => toggleIn(list, id));
  }, []);
  const removeDestination = useCallback((id: string) => {
    setDestinationIds((list) => list.filter((item) => item !== id));
  }, []);
  const removeTour = useCallback((id: string) => {
    setTourIds((list) => list.filter((item) => item !== id));
  }, []);
  const removeVehicle = useCallback((id: string) => {
    setVehicleIds((list) => list.filter((item) => item !== id));
  }, []);
  const clearTrip = useCallback(() => {
    setDestinationIds([]);
    setTourIds([]);
    setVehicleIds([]);
  }, []);

  const value = useMemo(
    () => ({
      destinationIds,
      tourIds,
      vehicleIds,
      toggleDestination,
      toggleTour,
      toggleVehicle,
      removeDestination,
      removeTour,
      removeVehicle,
      clearTrip,
    }),
    [
      destinationIds,
      tourIds,
      vehicleIds,
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
