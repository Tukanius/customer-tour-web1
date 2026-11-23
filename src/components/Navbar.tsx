"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LANGUAGES } from "@/data/tours";
import { LogoMark } from "./LogoMark";
import { useTrip } from "./TripProvider";

const NAV_LINKS = [
  { href: "#destinations", label: "Destinations" },
  { href: "#journeys", label: "Journeys" },
  { href: "#car-rental", label: "Car Rental" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function Navbar() {
  const { language, setLanguage } = useTrip();
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <a
          href="#top"
          className="flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure"
        >
          <LogoMark className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
          <span className="truncate font-display text-lg tracking-tight text-ink sm:text-xl">
            Azure Skyland
          </span>
        </a>

        <nav
          className="ml-4 hidden items-center gap-1 lg:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sand hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <LanguagePills
            language={language}
            onChange={setLanguage}
            compact
          />
          <a href="#contact" className="btn-primary whitespace-nowrap">
            Plan my trip
          </a>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink lg:hidden"
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={() => setOpen(true)}
        >
          <span className="sr-only">Open menu</span>
          <MenuIcon />
        </button>
      </div>

    </header>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-y-0 right-0 flex w-[min(22rem,100%)] flex-col overflow-y-auto border-l border-line bg-paper p-5 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg text-ink">Azure Skyland</p>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
                onClick={() => setOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <CloseIcon />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base text-ink hover:bg-sand"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted">
                Language
              </p>
              <LanguagePills language={language} onChange={setLanguage} />
            </div>
            <a
              href="#contact"
              className="btn-primary mt-8"
              onClick={() => setOpen(false)}
            >
              Plan my trip
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

function LanguagePills({
  language,
  onChange,
  compact = false,
}: {
  language: string;
  onChange: (code: (typeof LANGUAGES)[number]["code"]) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap rounded-full border border-line bg-sand/70 p-0.5 ${compact ? "max-w-[18rem]" : ""}`}
      role="radiogroup"
      aria-label="Language"
    >
      {LANGUAGES.map((item) => {
        const selected = item.code === language;
        return (
          <button
            key={item.code}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={item.label}
            title={item.label}
            onClick={() => onChange(item.code)}
            className={`min-h-8 min-w-8 rounded-full px-2 text-[11px] font-semibold tracking-wide transition-colors ${
              selected
                ? "bg-azure text-paper"
                : "text-muted hover:text-ink"
            }`}
          >
            {item.code}
          </button>
        );
      })}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M5 12h14M5 17h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M7 7l10 10M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
