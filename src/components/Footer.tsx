import Link from "next/link";
import { contactContent, siteCopy } from "@/data/travelData";
import { whatsappHref, WHATSAPP_DISPLAY } from "@/lib/contact";
import { LogoMark } from "./LogoMark";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  const { channels, office } = contactContent;

  return (
    <footer className="border-t border-line bg-ink pb-[var(--dock-h)] text-paper">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-9 w-9" />
            <p className="font-display text-xl">Nomad Atlas</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-paper/75">
            {siteCopy.footerBlurb}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">
            {siteCopy.footerMapLabel}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {siteCopy.footerLinks.map((link) => (
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
            {siteCopy.footerDeskLabel}
          </p>
          <address className="mt-3 not-italic text-sm leading-7 text-paper/80">
            {office.lines[0]}
            <br />
            <a className="hover:text-sky" href={channels.email.href}>
              {channels.email.display}
            </a>
            <br />
            <a
              className="inline-flex items-center gap-2 hover:text-sky"
              href={whatsappHref()}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <span className="mt-2 block text-paper/60">{office.hours}</span>
          </address>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-paper/55 sm:px-6 lg:px-8">
          {siteCopy.copyright}
        </p>
      </div>
    </footer>
  );
}
