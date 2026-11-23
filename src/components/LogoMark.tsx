export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="#1f4f63" />
      <path
        d="M6 34.5C12 28 16 22 24 18c8-4 14-2 18 4"
        stroke="#d7ecf2"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 38l10.5-14 6.5 8 7-12L40 38"
        fill="#2f6f86"
      />
      <path
        d="M8 38l10.5-14 6.5 8 7-12L40 38"
        stroke="#e8f4f7"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="14" r="3.2" fill="#f4efe4" />
    </svg>
  );
}
