import Link from "next/link";
import { LogoMark } from "./LogoMark";

const LINKS = [
  { href: "/destinations", label: "Destinations" },
  { href: "/tours", label: "Tours" },
  { href: "/car-rent", label: "Car Rent" },
  { href: "/#trip-request", label: "Plan a trip" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl">Nomad Atlas</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-paper/75">
            Private journeys across Mongolia. Original sample copy for this
            demo — not affiliated with any existing operator.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            Map
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-sand" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            Desk
          </p>
          <address className="mt-3 not-italic text-sm leading-7 text-paper/80">
            Chinggis Avenue, Ulaanbaatar
            <br />
            <a className="hover:text-sand" href="mailto:hello@nomadatlas.example">
              hello@nomadatlas.example
            </a>
            <br />
            <a className="hover:text-sand" href="tel:+97611000000">
              +976 11 000 000
            </a>
          </address>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/55 sm:px-6 lg:px-8">
          © 2026 Nomad Atlas. All rights reserved. Placeholder brand for
          demonstration.
        </p>
      </div>
    </footer>
  );
}
