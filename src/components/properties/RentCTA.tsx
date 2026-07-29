"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

interface RentCTAProps {
  propertyId: string;
}

export function RentCTA({ propertyId }: RentCTAProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = () => {
    if (isLoading) return;

    if (!user) {
      // Unauthenticated -> redirect to login with returnTo
      const returnTo = encodeURIComponent(pathname);
      router.push(`/auth/login?returnTo=${returnTo}`);
      return;
    }

    if (user.role !== "TENANT") {
      alert("Only tenants can request to rent properties.");
      return;
    }

    // Tenant logic - For phase 1, just show a stub alert.
    // Phase 2 will implement the actual modal/form to request.
    alert("Request to rent modal will be implemented in Phase 2!");
  };

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAction}
      disabled={isLoading || isSubmitting}
    >
      {isLoading ? "Loading..." : "Request to Rent"}
    </Button>
  );
}
