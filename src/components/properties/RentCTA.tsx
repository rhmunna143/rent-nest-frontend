"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { createRentalSchema, type CreateRentalInput } from "@/lib/schemas/rental";

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

interface RentCTAProps {
  propertyId: string;
}

export function RentCTA({ propertyId }: RentCTAProps) {
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
    const result = await api.post("/rentals", {
      propertyId,
      ...data,
    });
    
    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Rental request submitted successfully!");
      setIsOpen(false);
      reset();
      router.refresh();
      router.push("/dashboard/tenant");
    } else {
      if (result.status === 409) {
        toast.error("You already have an active request for this property.");
      } else {
        toast.error(result.message || "Failed to submit request.");
      }
    }
  };

  return (
    <>
      <Button 
        size="lg" 
        className="w-full" 
        onClick={handleAction} 
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Request to Rent"}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request to Rent</DialogTitle>
            <DialogDescription>
              Submit your request to the landlord. You can optionally include your desired move-in date and a message.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="moveInDate">Move-in Date *</Label>
              <Input
                id="moveInDate"
                type="date"
                {...register("moveInDate")}
              />
              {errors.moveInDate && (
                <p className="text-sm text-destructive">{errors.moveInDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message to Landlord *</Label>
              <textarea
                id="message"
                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Hi, I'm very interested in this property..."
                {...register("message")}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
