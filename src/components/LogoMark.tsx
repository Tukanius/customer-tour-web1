export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="14" fill="#0284C7" />
      <circle cx="24" cy="24" r="11" stroke="#E0F2FE" strokeWidth="1.6" />
      <path
        d="M24 11v26M11 24h26"
        stroke="#BAE6FD"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M24 16.5 27.4 24 24 31.5 20.6 24Z" fill="#F8FCFF" />
      <circle cx="24" cy="24" r="2.1" fill="#0284C7" stroke="#F8FCFF" />
    </svg>
  );
}
