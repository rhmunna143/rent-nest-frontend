"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import type { Property } from "@/types";
import { cn } from "@/lib/cn";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/api/useFavorites";

interface SavePropertyButtonProps {
  property: Property;
  className?: string;
}

export function SavePropertyButton({ property, className }: SavePropertyButtonProps) {
  const { user } = useAuth();
  const router = useRouter();

  // Landlords and admins should never see the heart button
  if (user && user.role !== "TENANT") {
    return null;
  }

  const isTenant = user?.role === "TENANT";
  const { data: favorites = [], isLoading } = useFavorites(isTenant);
  const addMutation = useAddFavorite();
  const removeMutation = useRemoveFavorite();

  // One-time migration of localStorage wishlist on mount for authenticated tenants
  React.useEffect(() => {
    if (!isTenant) return;
    try {
      const stored = localStorage.getItem("rentnest_wishlist");
      if (stored) {
        const parsed = JSON.parse(stored) as Property[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item) => {
            if (item?.id && !favorites.some((f) => f.id === item.id)) {
              addMutation.mutate(item.id);
            }
          });
          localStorage.removeItem("rentnest_wishlist");
        }
      }
    } catch {
      // ignore parsing errors
    }
  }, [isTenant, favorites]);

  const saved = favorites.some((f) => f.id === property.id);
  const isPending = addMutation.isPending || removeMutation.isPending;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save properties.");
      router.push(`/auth/login?returnTo=/properties/${property.id}`);
      return;
    }

    if (user.role !== "TENANT") {
      toast.error("Only tenants can save properties to a wishlist.");
      return;
    }

    if (isPending) return;

    if (saved) {
      removeMutation.mutate(property.id, {
        onSuccess: () => toast.success("Removed from saved properties."),
        onError: (err) => toast.error(err.message || "Failed to remove property"),
      });
    } else {
      addMutation.mutate(property.id, {
        onSuccess: () => toast.success("Saved to your wishlist!"),
        onError: (err) => toast.error(err.message || "Failed to save property"),
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading || isPending}
      className={cn(
        "p-2 rounded-full bg-background/90 backdrop-blur-sm shadow-xs transition-all hover:scale-105 active:scale-95 hover:bg-background disabled:opacity-50",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save property"}
      type="button"
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-colors",
          saved ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"
        )}
      />
    </button>
  );
}
