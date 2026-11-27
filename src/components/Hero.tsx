import Link from "next/link";
import { uiCopy } from "@/data/uiCopy";

export function Hero({ imageUrl }: { imageUrl?: string }) {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden md:min-h-[88vh]">
      <div
        className="hero-photo absolute inset-0 bg-mist"
        style={
          imageUrl
            ? { backgroundImage: `url(${imageUrl})` }
            : {
                backgroundImage:
                  "linear-gradient(160deg, #0284c7 0%, #38bdf8 42%, #e0f2fe 100%)",
              }
        }
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/10" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 md:min-h-[88vh] md:pb-24 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky">
          {uiCopy.hero.kicker}
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.6rem]">
          {uiCopy.hero.title}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
          {uiCopy.hero.lede}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tours" className="btn-primary">
            {uiCopy.hero.tours}
          </Link>
          <Link
            href="/destinations"
            className="inline-flex min-h-11 items-center rounded-full border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
          >
            {uiCopy.hero.destinations}
          </Link>
        </div>
      </div>
    </section>
  );
}
