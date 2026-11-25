import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogStatus } from "@/components/CatalogBoard";
import { CatalogDetail, CatalogDetailSkeleton } from "@/components/CatalogDetail";
import { ApiDownError } from "@/lib/api";
import { getDestination } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await getDestination(slug);
    if (!destination) return { title: "Place not found" };
    return {
      title: destination.name,
      description: destination.description || destination.name,
    };
  } catch {
    return { title: "Destinations" };
  }
}

export default function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <DestinationBody params={params} />
    </Suspense>
  );
}

async function DestinationBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let destination;
  try {
    destination = await getDestination(slug);
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
  if (!destination) notFound();
  return (
    <CatalogDetail
      item={destination}
      kind="destination"
      eyebrow={destination.region || "Destination"}
    />
  );
}
