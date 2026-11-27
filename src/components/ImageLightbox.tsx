"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { uiCopy } from "@/data/uiCopy";
import type { CatalogImage } from "@/types/catalog";

interface LightboxContextValue {
  open: (images: CatalogImage[], index?: number) => void;
  close: () => void;
  isOpen: boolean;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within LightboxProvider");
  return ctx;
}

export function useLightboxOptional() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<CatalogImage[]>([]);
  const [index, setIndex] = useState(0);
  const open = useCallback((next: CatalogImage[], start = 0) => {
    if (next.length === 0) return;
    setImages(next);
    setIndex(Math.min(Math.max(start, 0), next.length - 1));
  }, []);
  const close = useCallback(() => setImages([]), []);
  const isOpen = images.length > 0;

  return (
    <LightboxContext.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen ? (
        <LightboxView
          images={images}
          index={index}
          onIndex={setIndex}
          onClose={close}
        />
      ) : null}
    </LightboxContext.Provider>
  );
}

function LightboxView({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: CatalogImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const current = images[index];

  const go = useCallback(
    (next: number) => {
      if (images.length < 2) return;
      onIndex((next + images.length) % images.length);
      setScale(1);
    },
    [images.length, onIndex],
  );

  useEffect(() => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey, true);
      lastFocus.current?.focus();
    };
  }, [go, index, onClose]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-ink"
      role="dialog"
      aria-modal="true"
      aria-label={uiCopy.lightbox.label}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-2 px-3 py-3 text-white sm:px-5">
        <p className="min-w-0 truncate text-sm text-white/80">
          {current.name || uiCopy.lightbox.photo} ({index + 1}/{images.length})
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="rounded-full border border-white/25 px-3 py-1.5 text-sm"
            onClick={(event) => {
              event.stopPropagation();
              setScale((value) => Math.min(4, Number((value + 0.5).toFixed(2))));
            }}
          >
            {uiCopy.lightbox.zoomIn}
          </button>
          <button
            type="button"
            className="rounded-full border border-white/25 px-3 py-1.5 text-sm"
            onClick={(event) => {
              event.stopPropagation();
              setScale((value) => Math.max(1, Number((value - 0.5).toFixed(2))));
            }}
          >
            {uiCopy.lightbox.zoomOut}
          </button>
          <button
            ref={closeRef}
            type="button"
            aria-label={uiCopy.lightbox.close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25"
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>
      </div>
      <div
        className="relative min-h-0 flex-1"
        onClick={(event) => event.stopPropagation()}
        onWheel={(event) => {
          event.preventDefault();
          const next = event.deltaY < 0 ? scale * 1.08 : scale / 1.08;
          setScale(Math.min(4, Math.max(1, Number(next.toFixed(3)))));
        }}
        onPointerDown={(event) => {
          swipe.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          if (!swipe.current) return;
          const dx = event.clientX - swipe.current.x;
          const dy = event.clientY - swipe.current.y;
          swipe.current = null;
          if (scale > 1) return;
          if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            go(dx < 0 ? index + 1 : index - 1);
          }
        }}
        onTouchStart={(event) => {
          if (event.touches.length === 2) {
            pinch.current = {
              distance: pinchDistance(event.touches.item(0), event.touches.item(1)),
              scale,
            };
          }
        }}
        onTouchMove={(event) => {
          if (event.touches.length === 2 && pinch.current) {
            const ratio =
              pinchDistance(event.touches.item(0), event.touches.item(1)) /
              pinch.current.distance;
            setScale(Math.min(4, Math.max(1, pinch.current.scale * ratio)));
          }
        }}
        onTouchEnd={() => {
          pinch.current = null;
        }}
        onDoubleClick={() => setScale((value) => (value > 1 ? 1 : 2))}
      >
        <div className="flex h-full w-full items-center justify-center overflow-auto p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.url}
            alt={current.name || ""}
            className="max-h-full max-w-full object-contain"
            style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
            draggable={false}
          />
        </div>
        {images.length > 1 ? (
          <>
            <button
              type="button"
              aria-label={uiCopy.lightbox.prev}
              className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white"
              onClick={() => go(index - 1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={uiCopy.lightbox.next}
              className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-xl text-white"
              onClick={() => go(index + 1)}
            >
              ›
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

function pinchDistance(
  a: { clientX: number; clientY: number } | null,
  b: { clientX: number; clientY: number } | null,
) {
  if (!a || !b) return 0;
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}
