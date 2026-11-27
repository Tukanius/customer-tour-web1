import Link from "next/link";
import { uiCopy } from "@/data/uiCopy";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl text-ink">{uiCopy.status.notFoundTitle}</h1>
      <p className="mt-4 text-muted">{uiCopy.status.notFoundBody}</p>
      <Link href="/" className="btn-primary mt-8 inline-flex">
        {uiCopy.status.home}
      </Link>
    </div>
  );
}
