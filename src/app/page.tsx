import { DestinationsSection } from "@/components/DestinationsSection";
import { FeaturedTours } from "@/components/FeaturedTours";
import { HeroSearch } from "@/components/HeroSearch";
import { RouteShowcase } from "@/components/RouteShowcase";
import { TripRequestForm } from "@/components/TripRequestForm";
import { VehicleCards } from "@/components/VehicleCards";

export default function Home() {
  return (
    <>
      <HeroSearch />
      <RouteShowcase />
      <DestinationsSection />
      <FeaturedTours />
      <VehicleCards />
      <TripRequestForm />
    </>
  );
}
