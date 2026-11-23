import { DestinationsSection } from "@/components/DestinationsSection";
import { Footer } from "@/components/Footer";
import { HeroSearch } from "@/components/HeroSearch";
import { ItineraryAndPricing } from "@/components/ItineraryAndPricing";
import { Navbar } from "@/components/Navbar";
import { RouteShowcase } from "@/components/RouteShowcase";
import { TripRequestForm } from "@/components/TripRequestForm";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSearch />
        <RouteShowcase />
        <DestinationsSection />
        <CarRentalSection />
        <ItineraryAndPricing />
        <AboutSection />
        <TripRequestForm />
      </main>
      <Footer />
    </>
  );
}

function CarRentalSection() {
  return (
    <section
      id="car-rental"
      className="scroll-mt-24 border-b border-line bg-paper"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
            Car rental
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Land Cruisers with a mechanic who knows the washouts.
          </h2>
          <p className="mt-4 max-w-lg text-muted leading-7">
            Self-drive or with a driver. Sample fleet: two 4x4 wagons, roof
            tents, a satellite messenger, and spare wheels that have actually
            been used. We do not rent into the deep Gobi without a support plan.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ["With driver", "Fuel, permits, and a second spare included."],
            ["Self-drive", "Briefing, paper maps, and a check-in radio."],
            ["Roof tent kit", "Sleep off the vehicle on shorter loops."],
            ["Winter note", "Studded tyres from November. Ask first."],
          ].map(([title, copy]) => (
            <li
              key={title}
              className="rounded-2xl border border-line bg-sand/40 p-4"
            >
              <p className="font-display text-lg text-ink">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted">{copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
            About
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            A small desk in Ulaanbaatar, and a lot of empty kilometres.
          </h2>
        </div>
        <div className="mt-6 space-y-4 text-muted leading-7 lg:col-span-7 lg:mt-8">
          <p>
            Azure Skyland is a placeholder private-travel studio: original copy,
            original maps, no borrowed photographs. The work is slow travel with
            herder families, protected-area permits, and vehicles we maintain
            ourselves.
          </p>
          <p>
            Groups stay small on purpose. If a route needs a second car, we send
            one. If the weather turns, we change the day rather than the
            photograph.
          </p>
        </div>
      </div>
    </section>
  );
}
