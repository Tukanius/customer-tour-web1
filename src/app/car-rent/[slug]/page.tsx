import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogStatus } from "@/components/CatalogBoard";
import { CatalogDetail, CatalogDetailSkeleton } from "@/components/CatalogDetail";
import { ApiDownError } from "@/lib/api";
import { getVehicle } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/car-rent/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const vehicle = await getVehicle(slug);
    if (!vehicle) return { title: "Vehicle not found" };
    return {
      title: vehicle.name,
      description: vehicle.description || vehicle.name,
    };
  } catch {
    return { title: "Car Rent" };
  }
}

export default function VehicleDetailPage({
  params,
}: PageProps<"/car-rent/[slug]">) {
  return (
    <Suspense fallback={<CatalogDetailSkeleton />}>
      <VehicleBody params={params} />
    </Suspense>
  );
}

async function VehicleBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let vehicle;
  try {
    vehicle = await getVehicle(slug);
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
  if (!vehicle) notFound();
  const seats = vehicle.capacity ? `${vehicle.capacity} seats` : "Car rent";
  return <CatalogDetail item={vehicle} kind="vehicle" eyebrow={seats} />;
}
