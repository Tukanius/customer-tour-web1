import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusCard } from "@/components/CatalogCard";
import { VehicleProfile } from "@/components/CatalogSheet";
import { uiCopy } from "@/data/uiCopy";
import { ApiDownError } from "@/lib/api";
import { getVehicle } from "@/lib/catalog";

export async function generateMetadata({
  params,
}: PageProps<"/car-rent/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  try {
    const vehicle = await getVehicle(slug);
    if (!vehicle) return { title: uiCopy.status.vehicleMissing };
    return {
      title: vehicle.name,
      description: vehicle.description || vehicle.name,
    };
  } catch {
    return { title: uiCopy.cars.title };
  }
}

export default function VehicleDetailPage({
  params,
}: PageProps<"/car-rent/[slug]">) {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse bg-mist" />}>
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
        <div className="mx-auto max-w-3xl px-4 py-16">
          <StatusCard title={uiCopy.status.unreachable} body={error.message} />
        </div>
      );
    }
    throw error;
  }
  if (!vehicle) notFound();
  return <VehicleProfile item={vehicle} />;
}
