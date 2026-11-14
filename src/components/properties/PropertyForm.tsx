"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PropertyInput } from "@/lib/schemas/property.schema";
import { useCategories } from "@/hooks/api/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Trash2, Plus, Info, ImageIcon, CheckCircle2, DollarSign } from "lucide-react";

interface PropertyFormProps {
  initialData?: Partial<PropertyInput>;
  onSubmit: (data: PropertyInput) => Promise<void>;
  isSubmitting: boolean;
}

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location is required"),
  rentAmount: z.number({ error: "Rent amount must be a number" }).positive("Rent amount must be greater than 0"),
  bedrooms: z.number({ error: "Bedrooms must be a number" }).int().min(1, "At least 1 bedroom is required"),
  bathrooms: z.number({ error: "Bathrooms must be a number" }).int().min(1, "At least 1 bathroom is required"),
  categoryId: z.string().min(1, "Please select a category"),
  images: z.array(z.string()).min(1, "At least one property image is required"),
  amenities: z
    .array(z.object({ name: z.string() }))
    .min(1, "Add at least one amenity"),
});

type FormValues = z.infer<typeof propertyFormSchema>;

export function PropertyForm({
  initialData,
  onSubmit,
  isSubmitting,
}: PropertyFormProps) {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      rentAmount: initialData?.rentAmount ?? ("" as unknown as number),
      bedrooms: initialData?.bedrooms ?? ("" as unknown as number),
      bathrooms: initialData?.bathrooms ?? ("" as unknown as number),
      categoryId: initialData?.categoryId || "",
      images: initialData?.images || [],
      amenities: initialData?.amenities?.map((a) => ({ name: a })) || [
        { name: "Wi-Fi" },
        { name: "Air Conditioning" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "amenities",
  });

  const handleFormSubmit = async (values: FormValues) => {
    const cleanAmenities = values.amenities
      .map((a) => a.name.trim())
      .filter((name) => Boolean(name));

    const payload: PropertyInput = {
      title: values.title.trim(),
      description: values.description.trim(),
      location: values.location.trim(),
      rentAmount: Number(values.rentAmount),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      categoryId: values.categoryId,
      amenities: cleanAmenities.length > 0 ? cleanAmenities : ["General Living"],
      images: values.images.filter((img) => Boolean(img?.trim())),
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8" noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Basic Details & Pricing */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border bg-card space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b pb-3 text-primary font-bold">
              <Info className="h-5 w-5" />
              <h3 className="text-base sm:text-lg">Basic Information</h3>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-title" className="text-xs font-semibold">
                Property Title *
              </Label>
              <Input
                id="prop-title"
                placeholder="e.g. Modern High-Rise Apartment in Downtown"
                className="rounded-xl"
                disabled={isSubmitting}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "prop-title-error" : undefined}
                {...register("title")}
              />
              {errors.title && (
                <p id="prop-title-error" className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-categoryId" className="text-xs font-semibold">
                Category *
              </Label>
              <select
                id="prop-categoryId"
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                disabled={isSubmitting || isLoadingCategories}
                aria-invalid={!!errors.categoryId}
                aria-describedby={errors.categoryId ? "prop-cat-error" : undefined}
                {...register("categoryId")}
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p id="prop-cat-error" className="text-xs text-destructive">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-location" className="text-xs font-semibold">
                Location / Address *
              </Label>
              <Input
                id="prop-location"
                placeholder="e.g. 142 Elm St, Austin, TX"
                className="rounded-xl"
                disabled={isSubmitting}
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? "prop-loc-error" : undefined}
                {...register("location")}
              />
              {errors.location && (
                <p id="prop-loc-error" className="text-xs text-destructive">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="prop-description" className="text-xs font-semibold">
                Full Description *
              </Label>
              <Textarea
                id="prop-description"
                placeholder="Describe your property, proximity to transport, lease terms, and building features..."
                className="min-h-32 rounded-xl"
                disabled={isSubmitting}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? "prop-desc-error" : undefined}
                {...register("description")}
              />
              {errors.description && (
                <p id="prop-desc-error" className="text-xs text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Room Specs Card */}
          <div className="p-6 rounded-xl border bg-card space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b pb-3 text-primary font-bold">
              <DollarSign className="h-5 w-5" />
              <h3 className="text-base sm:text-lg">Pricing & Specifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rent Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="prop-rentAmount" className="text-xs font-semibold">
                  Monthly Rent ($) *
                </Label>
                <Input
                  id="prop-rentAmount"
                  type="number"
                  placeholder="2400"
                  className="rounded-xl"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.rentAmount}
                  aria-describedby={errors.rentAmount ? "prop-rent-error" : undefined}
                  {...register("rentAmount", { valueAsNumber: true })}
                />
                {errors.rentAmount && (
                  <p id="prop-rent-error" className="text-xs text-destructive">
                    {errors.rentAmount.message}
                  </p>
                )}
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <Label htmlFor="prop-bedrooms" className="text-xs font-semibold">
                  Bedrooms *
                </Label>
                <Input
                  id="prop-bedrooms"
                  type="number"
                  placeholder="2"
                  className="rounded-xl"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.bedrooms}
                  aria-describedby={errors.bedrooms ? "prop-bed-error" : undefined}
                  {...register("bedrooms", { valueAsNumber: true })}
                />
                {errors.bedrooms && (
                  <p id="prop-bed-error" className="text-xs text-destructive">
                    {errors.bedrooms.message}
                  </p>
                )}
              </div>

              {/* Bathrooms */}
              <div className="space-y-1.5">
                <Label htmlFor="prop-bathrooms" className="text-xs font-semibold">
                  Bathrooms *
                </Label>
                <Input
                  id="prop-bathrooms"
                  type="number"
                  placeholder="1"
                  className="rounded-xl"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.bathrooms}
                  aria-describedby={errors.bathrooms ? "prop-bath-error" : undefined}
                  {...register("bathrooms", { valueAsNumber: true })}
                />
                {errors.bathrooms && (
                  <p id="prop-bath-error" className="text-xs text-destructive">
                    {errors.bathrooms.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photos & Amenities */}
        <div className="space-y-6">
          {/* Photos Upload Card */}
          <div className="p-6 rounded-xl border bg-card space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 border-b pb-3 text-primary font-bold">
              <ImageIcon className="h-5 w-5" />
              <h3 className="text-base sm:text-lg">Property Photos *</h3>
            </div>

            <Controller
              control={control}
              name="images"
              render={({ field }) => (
                <ImageUploader
                  value={field.value || []}
                  onChange={(urls) => field.onChange(urls)}
                  folder="properties"
                />
              )}
            />
            {errors.images && (
              <p className="text-xs text-destructive">
                {errors.images.message || "Please provide at least one property image."}
              </p>
            )}
          </div>

          {/* Amenities with useFieldArray (S14 resolved) */}
          <div className="p-6 rounded-xl border bg-card space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="text-base sm:text-lg">Amenities & Features</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "" })}
                disabled={isSubmitting}
                className="h-8 rounded-xl text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Amenity
              </Button>
            </div>

            <div className="space-y-2.5">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. In-Unit Washer/Dryer, Balcony, Parking"
                    className="rounded-xl h-9 text-xs"
                    disabled={isSubmitting}
                    aria-label={`Amenity #${index + 1}`}
                    {...register(`amenities.${index}.name` as const)}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting}
                      onClick={() => remove(index)}
                      aria-label={`Remove amenity #${index + 1}`}
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.amenities && (
              <p className="text-xs text-destructive">{errors.amenities.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="rounded-xl px-8 font-semibold shadow-xs"
        >
          {isSubmitting ? "Saving Property..." : "Publish Listing"}
        </Button>
      </div>
    </form>
  );
}
