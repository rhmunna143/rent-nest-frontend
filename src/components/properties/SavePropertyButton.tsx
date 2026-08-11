"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import type { Property } from "@/types";
import { cn } from "@/lib/cn";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface SavePropertyButtonProps {
  property: Property;
  className?: string;
}

export function SavePropertyButton({ property, className }: SavePropertyButtonProps) {
  const { isSaved, toggleSave, isInitialized } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  if (!isInitialized) {
    return (
      <button 
        className={cn("p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-colors opacity-50", className)}
        disabled
      >
        <Heart className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  const saved = isSaved(property.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save properties.");
      router.push("/auth/login");
      return;
    }
    
    if (user.role !== "TENANT") {
      toast.error("Only tenants can save properties to a wishlist.");
      return;
    }

    toggleSave(property);
    if (saved) {
      toast.success("Removed from saved properties.");
    } else {
      toast.success("Saved to your wishlist!");
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "p-2 rounded-full bg-background/80 backdrop-blur-sm shadow-sm transition-all hover:scale-105 active:scale-95",
        className
      )}
      aria-label={saved ? "Remove from saved" : "Save property"}
    >
      <Heart
        className={cn(
          "w-5 h-5 transition-colors",
          saved ? "fill-rose-500 text-rose-500" : "text-muted-foreground hover:text-rose-500"
        )}
      />
    </button>
  );
}
