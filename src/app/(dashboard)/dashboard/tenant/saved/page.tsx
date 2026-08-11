"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Heart, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared";

import { useRouter } from "next/navigation";

export default function SavedPropertiesPage() {
  const { savedProperties, isInitialized } = useWishlist();
  const router = useRouter();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse space-y-4 flex flex-col items-center">
          <div className="w-12 h-12 bg-muted rounded-full" />
          <div className="w-32 h-4 bg-muted rounded" />
        </div>
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
          Properties you've favorited for quick access.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          description="You haven't added any properties to your wishlist. Start exploring to find your dream home."
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
