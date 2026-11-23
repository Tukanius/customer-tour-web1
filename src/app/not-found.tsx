import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-azure">
        Missing page
      </p>
      <h1 className="mt-3 font-display text-4xl text-ink">
        That track is not on the map.
      </h1>
      <p className="mt-4 text-muted">
        The link may be old. Start again from the atlas home.
      </p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        Back to home
      </Link>
    </div>
  );
}
