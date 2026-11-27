import Link from "next/link";
import { contactContent } from "@/data/travelData";
import { uiCopy } from "@/data/uiCopy";
import { whatsappHref, WHATSAPP_DISPLAY } from "@/lib/contact";
import { LogoMark } from "./LogoMark";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  const { channels, office } = contactContent;
  const officeLines = office.lines.filter((line) => line.trim());

  return (
    <footer className="border-t border-line bg-ink pb-[var(--dock-h)] text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl">{uiCopy.brand}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-paper/75">
            {uiCopy.footer.blurb}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            {uiCopy.footer.links}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {uiCopy.nav.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-sky" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            {uiCopy.footer.contact}
          </p>
          <address className="mt-3 not-italic text-sm leading-7 text-paper/80">
            {officeLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <a className="block hover:text-sky" href={channels.email.href}>
              {channels.email.display}
            </a>
            <a
              className="inline-flex items-center gap-2 hover:text-sky"
              href={whatsappHref()}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              {uiCopy.whatsapp} {WHATSAPP_DISPLAY}
            </a>
            {office.hours ? (
              <span className="mt-2 block text-paper/60">{office.hours}</span>
            ) : null}
          </address>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/55 sm:px-6 lg:px-8">
          {uiCopy.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
