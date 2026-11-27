"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { useLightboxOptional } from "./ImageLightbox";

export function ModalSheet({
  isOpen,
  onClose,
  label,
  closeLabel,
  titleId,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  titleId?: string;
  children: ReactNode;
}) {
  const generatedId = useId();
  const labelledBy = titleId ?? generatedId;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const dragStart = useRef<number | null>(null);
  const lightbox = useLightboxOptional();

  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (lightbox?.isOpen) return;
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const nodes = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [isOpen, lightbox?.isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="absolute inset-x-0 bottom-0 flex max-h-[95vh] min-h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-paper shadow-2xl md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(92vh,920px)] md:w-[min(94vw,1100px)] md:max-h-[92vh] md:min-h-0 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl"
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).dataset.handle !== "sheet") return;
          dragStart.current = event.clientY;
        }}
        onPointerUp={(event) => {
          if (dragStart.current != null && event.clientY - dragStart.current > 90) {
            onClose();
          }
          dragStart.current = null;
        }}
      >
        <div
          data-handle="sheet"
          className="flex shrink-0 cursor-grab flex-col items-center pt-3 md:hidden"
        >
          <span className="h-1.5 w-12 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-3 md:px-6 md:pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
            {label}
          </p>
          <button
            ref={closeRef}
            type="button"
            aria-label={`Dismiss ${label}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-6 md:pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SheetSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-52 animate-pulse rounded-2xl bg-mist" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-mist" />
      <div className="h-24 animate-pulse rounded bg-mist/80" />
    </div>
  );
}
