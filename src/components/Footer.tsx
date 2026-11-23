import { LogoMark } from "./LogoMark";

const FOOTER_LINKS = [
  { href: "#destinations", label: "Destinations" },
  { href: "#journeys", label: "Journeys" },
  { href: "#car-rental", label: "Car Rental" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

const SOCIAL = [
  { href: "https://www.instagram.com", label: "Instagram" },
  { href: "https://www.facebook.com", label: "Facebook" },
  { href: "https://t.me", label: "Telegram" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl">Azure Skyland</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-paper/75">
            Private expeditions across Mongolia. Original sample copy for this
            demo — not affiliated with any existing operator.
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            Map
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <a className="hover:text-sand" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            Contact
          </p>
          <address className="mt-3 not-italic text-sm leading-7 text-paper/80">
            Chinggis Avenue, Ulaanbaatar
            <br />
            <a className="hover:text-sand" href="mailto:hello@azureskyland.example">
              hello@azureskyland.example
            </a>
            <br />
            <a className="hover:text-sand" href="tel:+97611000000">
              +976 11 000 000
            </a>
          </address>
          <ul className="mt-4 flex flex-wrap gap-3 text-sm">
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  className="rounded-full border border-paper/20 px-3 py-1 hover:bg-paper/10"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/55 sm:px-6 lg:px-8">
          © 2026 Azure Skyland. All rights reserved.
          Placeholder brand for demonstration.
        </p>
      </div>
    </footer>
  );
}
