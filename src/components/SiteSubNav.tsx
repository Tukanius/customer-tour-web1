import Link from "next/link";
import { siteCopy } from "@/data/travelData";

export function SiteSubNav({ current }: { current: "/about" | "/contact" }) {
  return (
    <nav aria-label="Studio" className="mb-8 flex flex-wrap gap-2">
      {siteCopy.subNav.map((link) => {
        const active = current === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1.5 text-sm ${
              active
                ? "bg-sand text-ink"
                : "border border-line text-muted hover:bg-sand hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
