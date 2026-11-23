import type { Region } from "@/types/travel";

export const REGION_ART: Record<Region, string> = {
  gobi: "#e4d2b0",
  altai: "#c5d0d8",
  central: "#c9d6b8",
  north: "#b7c9d4",
  wildlife: "#d7cbb0",
};

export function RegionGraphic({
  region,
  className = "h-full w-full",
}: {
  region: Region;
  className?: string;
}) {
  if (region === "gobi") {
    return (
      <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
        <path d="M0 110 C80 90 140 120 220 100 300 80 340 70 400 86V160H0Z" fill="#d9c196" />
        <path d="M0 132 C90 118 180 140 280 120 340 108 370 122 400 118V160H0Z" fill="#c9ab78" />
      </svg>
    );
  }
  if (region === "altai") {
    return (
      <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
        <path d="M20 140 110 40 180 110 250 28 380 140Z" fill="#9aafbd" />
        <path d="M110 40 140 78 180 110 148 86Z" fill="#eef3f6" />
      </svg>
    );
  }
  if (region === "north") {
    return (
      <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
        <ellipse cx="200" cy="108" rx="150" ry="34" fill="#7fa0b3" />
        <path d="M0 120 C60 90 90 80 140 95 80 70 40 70 0 90Z" fill="#6f8b78" />
      </svg>
    );
  }
  if (region === "wildlife") {
    return (
      <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
        <path d="M0 120 C100 90 160 100 240 80 300 66 340 90 400 84V160H0Z" fill="#b9c49a" />
        <circle cx="250" cy="78" r="10" fill="#6d5a3c" />
        <circle cx="290" cy="92" r="8" fill="#6d5a3c" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 160" className={className} aria-hidden="true">
      <path d="M0 100 C70 80 120 70 200 88 280 106 330 70 400 90V160H0Z" fill="#a7bf90" />
      <path d="M40 160 C80 110 110 110 130 160" fill="none" stroke="#6f8a5e" strokeWidth="6" />
    </svg>
  );
}
