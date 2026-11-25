import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-x-clip border-b border-line bg-hero">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice">
          <rect width="1200" height="640" fill="#eef3ef" />
          <path
            d="M0 420C180 360 280 300 430 310 620 322 700 420 900 380 1040 352 1120 300 1200 280V640H0Z"
            fill="#dce8df"
          />
          <path
            d="M0 500C220 440 360 480 520 470 740 456 820 390 1020 420 1100 434 1160 470 1200 500V640H0Z"
            fill="#c5d5c8"
          />
          <circle cx="980" cy="120" r="42" fill="#f4efe4" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
          Private travel · Mongolia
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.15rem] leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
          A private map of Mongolia, drawn for the people who will travel it.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
          Destinations, tours, and 4x4s on this site are the ones the desk has
          published. If a list is empty, nothing is live in admin yet.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/#destinations" className="btn-primary">
            Browse destinations
          </Link>
          <Link href="/#trip-request" className="btn-secondary">
            Plan my trip
          </Link>
        </div>
      </div>
    </section>
  );
}
