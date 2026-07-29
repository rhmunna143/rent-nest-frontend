"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { PropertyForm } from "@/components/properties/PropertyForm";
import type { PropertyInput } from "@/lib/schemas/property.schema";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NewPropertyPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PropertyInput) => {
    setIsSubmitting(true);
    try {
      // Remove empty strings from amenities and images
      const cleanedData = {
        ...data,
        amenities: data.amenities.filter((a) => a.trim() !== ""),
        images: data.images.filter((i) => i.trim() !== ""),
      };

      const res = await api.post("/landlord/properties", cleanedData);

      if (res.ok) {
        toast.success("Property created successfully!");
        router.push("/dashboard/landlord/properties");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create property");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/landlord/properties">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add New Property
          </h1>
          <p className="text-muted-foreground mt-1">
            List a new property to accept rental requests.
          </p>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm p-6 sm:p-8">
        <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
