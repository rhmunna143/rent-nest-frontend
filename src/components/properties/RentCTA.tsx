"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { createRentalSchema, type CreateRentalInput } from "@/lib/schemas/rental.schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyStatus } from "@/types";
import { Lock, Info, Send } from "lucide-react";

interface RentCTAProps {
  propertyId: string;
  status: PropertyStatus;
  landlordId?: string;
}

export function RentCTA({ propertyId, status, landlordId }: RentCTAProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRentalInput>({
    resolver: zodResolver(createRentalSchema),
  });

  const isOwner = user?.id && landlordId && user.id === landlordId;
  const isAvailable = status === "AVAILABLE";

  const handleAction = () => {
    if (isLoading) return;

    if (!user) {
      const returnTo = encodeURIComponent(pathname);
      router.push(`/auth/login?returnTo=${returnTo}`);
      return;
    }

    if (user.role !== "TENANT") {
      toast.error("Only tenants can request to rent properties.");
      return;
    }

    setIsOpen(true);
  };

  const onSubmit = async (data: CreateRentalInput) => {
    setIsSubmitting(true);

    // Strip empty strings per F3.6 specification
    const payload: Record<string, unknown> = { propertyId };
    if (data.moveInDate?.trim()) {
      payload.moveInDate = data.moveInDate.trim();
    }
    if (data.message?.trim()) {
      payload.message = data.message.trim();
    }

    const result = await api.post("/rentals", payload);
    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Rental request submitted successfully!");
      setIsOpen(false);
      reset();
      router.refresh();
      router.push("/dashboard/tenant/requests");
    } else {
      if (result.status === 409) {
        toast.error("You already have an active rental application for this property.");
      } else {
        toast.error(result.message || "Failed to submit request.");
      }
    }
  };

  // 1. If property is not available
  if (!isAvailable) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full rounded-xl" disabled>
          <Lock className="mr-2 h-4 w-4" />
          {status === "RENTED" ? "Property Rented" : "Listing Unavailable"}
        </Button>
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Info className="h-3.5 w-3.5" />
          This property is not currently accepting new lease requests.
        </p>
      </div>
    );
  }

  // 2. If viewer is the landlord owner of this property
  if (isOwner) {
    return (
      <div className="space-y-2">
        <Button size="lg" variant="secondary" className="w-full rounded-xl" disabled>
          Your Property Listing
        </Button>
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Info className="h-3.5 w-3.5" />
          You manage this property from your landlord dashboard.
        </p>
      </div>
    );
  }

  // 3. Normal tenant or guest CTA
  return (
    <>
      <Button
        size="lg"
        className="w-full rounded-xl text-base font-semibold shadow-md"
        onClick={handleAction}
        disabled={isLoading}
      >
        {isLoading ? "Checking availability..." : "Request to Rent"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Request to Rent</DialogTitle>
            <DialogDescription className="text-sm">
              Submit your lease application directly to the landlord. You may optionally specify your target move-in date and an introductory message.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="moveInDate" className="text-xs font-semibold">
                Preferred Move-in Date (Optional)
              </Label>
              <Input
                id="moveInDate"
                type="date"
                className="rounded-xl"
                {...register("moveInDate")}
              />
              {errors.moveInDate && (
                <p className="text-xs text-destructive">{errors.moveInDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-xs font-semibold">
                Message to Landlord (Optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself, mention your lease duration or any questions..."
                className="min-h-24 rounded-xl"
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting application..."
                ) : (
                  <>
                    <Send className="mr-1.5 h-4 w-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
