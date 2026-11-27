"use client";

import Link from "next/link";
import { uiCopy } from "@/data/uiCopy";
import { whatsappHref } from "@/lib/contact";
import { useCatalogSheet } from "./CatalogSheet";
import { useLightboxOptional } from "./ImageLightbox";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function GlobalContactActions() {
  const { isOpen } = useCatalogSheet();
  const lightbox = useLightboxOptional();
  if (isOpen || lightbox?.isOpen) return null;

  return (
    <>
      <div className="pointer-events-none fixed bottom-6 right-4 z-40 hidden flex-col items-end gap-3 md:flex lg:right-6">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg"
          aria-label={uiCopy.whatsapp}
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_30px_-20px_rgb(15_23_42_/_0.45)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Link href="/contact" className="btn-primary min-w-0 flex-1">
            {uiCopy.planTrip}
          </Link>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white"
            aria-label={uiCopy.whatsapp}
          >
            <WhatsAppIcon className="h-6 w-6" />
          </a>
        </div>
      </div>
    </>
  );
}
