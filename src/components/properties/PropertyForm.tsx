"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertySchema,
  type PropertyInput,
} from "@/lib/schemas/property.schema";
import { api } from "@/lib/api-client";
import { type Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, Info, ImageIcon, DollarSign } from "lucide-react";

interface PropertyFormProps {
  initialData?: Partial<PropertyInput>;
  onSubmit: (data: PropertyInput) => Promise<void>;
  isSubmitting: boolean;
}

export function PropertyForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PropertyFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [amenityCount, setAmenityCount] = useState(
    initialData?.amenities?.length ? initialData.amenities.length : 1,
  );
  const [imageCount, setImageCount] = useState(
    initialData?.images?.length ? initialData.images.length : 1,
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<PropertyInput>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      rentAmount: initialData?.rentAmount || ("" as unknown as number),
      bedrooms: initialData?.bedrooms || ("" as unknown as number),
      bathrooms: initialData?.bathrooms || ("" as unknown as number),
      amenities: initialData?.amenities || [""],
      images: initialData?.images || [""],
      categoryId: initialData?.categoryId || "",
    },
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await api.get<Category[]>("/categories");
        if (res.ok && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        {/* Left Column: Basic Details & Pricing */}
        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-primary">
              <Info className="w-5 h-5" />
              <h3 className="text-lg font-medium">Basic Information</h3>
            </div>

            <div>
              <Label htmlFor="title" className="mb-1 block">
                Property Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. Modern Apartment in Downtown"
                {...register("title")}
                className="bg-background"
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="mb-1 block">
                Description *
              </Label>
              <textarea
                id="description"
                className="flex min-h-35 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Describe the property's key features, neighborhood, and unique selling points..."
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location" className="mb-1 block">
                Location / Address *
              </Label>
              <Input
                id="location"
                placeholder="e.g. 123 Main St, New York, NY 10001"
                {...register("location")}
                className="bg-background"
              />
              {errors.location && (
                <p className="text-sm text-destructive mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="categoryId" className="mb-1 block">
                Property Category *
              </Label>
              <select
                id="categoryId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("categoryId")}
                disabled={isLoadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-sm text-destructive mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 text-primary">
              <DollarSign className="w-5 h-5" />
              <h3 className="text-lg font-medium">Pricing & Layout</h3>
            </div>

            <div>
              <Label htmlFor="rentAmount" className="mb-1 block">
                Rent Amount ($/mo) *
              </Label>
              <Input
                id="rentAmount"
                type="number"
                placeholder="e.g. 1500"
                {...register("rentAmount", { valueAsNumber: true })}
                className="bg-background"
              />
              {errors.rentAmount && (
                <p className="text-sm text-destructive mt-1">
                  {errors.rentAmount.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bedrooms" className="mb-1 block">
                  Bedrooms *
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="e.g. 2"
                  {...register("bedrooms", { valueAsNumber: true })}
                  className="bg-background"
                />
                {errors.bedrooms && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="bathrooms" className="mb-1 block">
                  Bathrooms *
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="e.g. 1"
                  {...register("bathrooms", { valueAsNumber: true })}
                  className="bg-background"
                />
                {errors.bathrooms && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Amenities & Media */}
        <div className="space-y-8 bg-muted/30 p-6 rounded-xl border border-dashed border-muted-foreground/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-primary">
                <ImageIcon className="w-5 h-5" />
                <h3 className="text-lg font-medium">Media & Photos</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImageCount((c) => c + 1)}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Image URL
              </Button>
            </div>

            <div className="space-y-3">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div key={`image-${i}`} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...register(`images.${i}` as const)}
                      className="bg-background"
                    />
                  </div>
                  {imageCount > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => {
                        const current = getValues("images");
                        current.splice(i, 1);
                        setValue("images", current);
                        setImageCount((c) => c - 1);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.images && (
                <p className="text-sm text-destructive mt-1">
                  {errors.images.message || "Please provide valid image URLs."}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Provide direct links to publicly hosted images (e.g. Imgur, AWS
              S3). The first image will be used as the thumbnail.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2 text-primary">
                <Plus className="w-5 h-5" />
                <h3 className="text-lg font-medium">Amenities</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmenityCount((c) => c + 1)}
                className="h-8"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Amenity
              </Button>
            </div>

            <div className="space-y-3">
              {Array.from({ length: amenityCount }).map((_, i) => (
                <div key={`amenity-${i}`} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="e.g. High-speed WiFi, In-unit Laundry"
                      {...register(`amenities.${i}` as const)}
                      className="bg-background"
                    />
                  </div>
                  {amenityCount > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => {
                        const current = getValues("amenities");
                        current.splice(i, 1);
                        setValue("amenities", current);
                        setAmenityCount((c) => c - 1);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {errors.amenities && (
                <p className="text-sm text-destructive mt-1">
                  {errors.amenities.message}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              List the features and amenities that make this property stand out
              to potential tenants.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t mt-8">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="min-w-50 text-base"
        >
          {isSubmitting ? "Processing..." : "Save Property Listing"}
        </Button>
      </div>
    </form>
  );
}