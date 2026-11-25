import Link from "next/link";
import { aboutContent } from "@/data/travelData";
import { SiteSubNav } from "./SiteSubNav";

export function AboutSection() {
  const about = aboutContent;

  return (
    <div>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-20">
          <div className="lg:col-span-5">
            <SiteSubNav current="/about" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
              {about.eyebrow}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
              {about.title}
            </h1>
          </div>
          <div className="mt-6 space-y-4 text-muted leading-7 lg:col-span-7 lg:mt-10">
            <p className="text-lg text-ink/90">{about.lede}</p>
            {about.mission.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link href="/#trip-request" className="btn-primary mt-4 inline-flex">
              Plan my trip
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-sand/35">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
            {about.reasonsEyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {about.reasonsTitle}
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {about.reasons.map((reason) => (
              <li
                key={reason.title}
                className="rounded-2xl border border-line bg-paper p-5"
              >
                <h3 className="font-display text-xl text-ink">{reason.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{reason.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
            {about.stepsEyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-ink sm:text-4xl">
            {about.stepsTitle}
          </h2>
          <ol className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {about.steps.map((step) => (
              <li
                key={step.number}
                className="rounded-2xl border border-line bg-sand/30 p-5"
              >
                <p className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                  {step.number}
                </p>
                <h3 className="mt-4 font-display text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
