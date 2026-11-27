import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { DestinationProfile } from "@/components/CatalogSheet";
import { uiCopy } from "@/data/uiCopy";
import { ApiDownError } from "@/lib/api";
import { getDestination } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const destination = await getDestination(slug);
    if (!destination) return { title: uiCopy.status.destinationMissing };
    return {
      title: destination.name,
      description: destination.description || destination.name,
    };
  } catch {
    return { title: uiCopy.destinations.title };
  }
}

export default function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  return (
    <Suspense
      fallback={
        <div className="h-64 animate-pulse bg-mist sm:h-80" />
      }
    >
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
        <div className="mx-auto max-w-3xl px-4 py-16">
          <StatusCard title={uiCopy.status.unreachable} body={error.message} />
        </div>
      );
    }
    throw error;
  }
  if (!destination) notFound();
  return <DestinationProfile item={destination} />;
}
