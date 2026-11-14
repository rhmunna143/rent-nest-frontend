"use client";

import { useFavorites } from "@/hooks/api/useFavorites";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Heart, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/shared";

export default function SavedPropertiesPage() {
  const router = useRouter();
  const { data: savedProperties = [], isLoading } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-80 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading your saved properties...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Saved Properties
        </h1>
        <p className="text-muted-foreground">
          Properties you have bookmarked for quick access and status tracking.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          description="You haven't added any properties to your wishlist. Explore available rentals to save your favorites."
          action={{
            label: "Browse Properties",
            onClick: () => router.push("/properties"),
          }}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
