import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogStatus } from "@/components/CatalogBoard";
import { CatalogDetail, CatalogDetailSkeleton } from "@/components/CatalogDetail";
import { ApiDownError } from "@/lib/api";
import { getTour } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/tours/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const tour = await getTour(slug);
    if (!tour) return { title: "Tour not found" };
    return { title: tour.name, description: tour.description || tour.name };
  } catch {
    return { title: "Tours" };
  }
}

export default function TourDetailPage({ params }: PageProps<"/tours/[slug]">) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <TourBody params={params} />
    </Suspense>
  );
}

async function TourBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let tour;
  try {
    tour = await getTour(slug);
  } catch (error) {
    if (error instanceof ApiDownError) {
      return (
        <div className="mx-auto max-w-6xl px-4 py-16">
          <CatalogStatus title="The desk is unreachable" body={error.message} />
        </div>
      );
    }
    throw error;
  }
  if (!tour) notFound();
  return <CatalogDetail item={tour} kind="tour" eyebrow={tour.region || "Tour"} />;
}
