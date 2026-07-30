"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { PropertyForm } from "@/components/properties/PropertyForm";
import type { PropertyInput } from "@/lib/schemas/property.schema";
import type { Property } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await api.get<Property>(`/properties/${id}`);
        if (res.ok && res.data) {
          setProperty(res.data);
        } else {
          toast.error(res.message || "Failed to load property details");
          router.push("/dashboard/landlord/properties");
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred");
        router.push("/dashboard/landlord/properties");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperty();
  }, [id, router]);

  const handleSubmit = async (data: PropertyInput) => {
    setIsSubmitting(true);
    try {
      // Remove empty strings from amenities and images
      const cleanedData = {
        ...data,
        amenities: data.amenities.filter((a) => a.trim() !== ""),
        images: data.images.filter((i) => i.trim() !== ""),
      };

      const res = await api.put(`/landlord/properties/${id}`, cleanedData);

      if (res.ok) {
        toast.success("Property updated successfully!");
        router.push("/dashboard/landlord/properties");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update property");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading property details...</p>
      </div>
    );
  }

  if (!property) return null;

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
            Edit Property
          </h1>
          <p className="text-muted-foreground mt-1">
            Update the details for "{property.title}"
          </p>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm p-6 sm:p-8">
        <PropertyForm
          initialData={property}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
