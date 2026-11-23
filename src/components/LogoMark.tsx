export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="12" fill="#1f4f63" />
      <circle cx="24" cy="24" r="11" stroke="#e8f4f7" strokeWidth="1.6" />
      <path
        d="M24 10v28M10 24h28"
        stroke="#d7ecf2"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M24 16.5 27.2 24 24 31.5 20.8 24Z"
        fill="#f4efe4"
      />
      <circle cx="24" cy="24" r="2.2" fill="#1f4f63" stroke="#f4efe4" />
    </svg>
  );
}
