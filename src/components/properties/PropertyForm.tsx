"use client";

import * as React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertySchema,
  type PropertyInput,
} from "@/lib/schemas/property.schema";
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

interface FormValues extends Omit<PropertyInput, "amenities"> {
  amenities: { name: string }[];
}

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
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      rentAmount: initialData?.rentAmount || ("" as unknown as number),
      bedrooms: initialData?.bedrooms || ("" as unknown as number),
      bathrooms: initialData?.bathrooms || ("" as unknown as number),
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

  const images = watch("images");

  const handleFormSubmit = async (values: FormValues) => {
    // Map amenities back to string array and filter out empty entries
    const cleanAmenities = values.amenities
      .map((a) => a.name.trim())
      .filter((name) => Boolean(name));

    const payload: PropertyInput = {
      ...values,
      rentAmount: Number(values.rentAmount),
      bedrooms: Number(values.bedrooms),
      bathrooms: Number(values.bathrooms),
      amenities: cleanAmenities,
      images: values.images.filter((img) => Boolean(img?.trim())),
    };

    // Client-side validation check
    const validation = propertySchema.safeParse(payload);
    if (!validation.success) {
      return;
    }

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Basic Details & Pricing */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border bg-card space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-3 text-primary font-bold">
              <Info className="h-5 w-5" />
              <h3 className="text-base sm:text-lg">Basic Information</h3>
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Property Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. Modern High-Rise Apartment in Downtown"
                className="rounded-xl"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="categoryId" className="text-xs font-semibold">
                Category *
              </Label>
              <select
                id="categoryId"
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                {...register("categoryId")}
                disabled={isLoadingCategories}
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-destructive">{errors.categoryId.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <Label htmlFor="location" className="text-xs font-semibold">
                Location / Address *
              </Label>
              <Input
                id="location"
                placeholder="e.g. 142 Elm St, Austin, TX"
                className="rounded-xl"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Full Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your property, proximity to transport, lease terms, and building features..."
                className="min-h-32 rounded-xl"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Pricing & Room Specs Card */}
          <div className="p-6 rounded-2xl border bg-card space-y-5 shadow-xs">
            <div className="flex items-center gap-2 border-b pb-3 text-primary font-bold">
              <DollarSign className="h-5 w-5" />
              <h3 className="text-base sm:text-lg">Pricing & Specifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Rent Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="rentAmount" className="text-xs font-semibold">
                  Monthly Rent ($) *
                </Label>
                <Input
                  id="rentAmount"
                  type="number"
                  placeholder="2400"
                  className="rounded-xl"
                  {...register("rentAmount", { valueAsNumber: true })}
                />
                {errors.rentAmount && (
                  <p className="text-xs text-destructive">{errors.rentAmount.message}</p>
                )}
              </div>

              {/* Bedrooms */}
              <div className="space-y-1.5">
                <Label htmlFor="bedrooms" className="text-xs font-semibold">
                  Bedrooms *
                </Label>
                <Input
                  id="bedrooms"
                  type="number"
                  placeholder="2"
                  className="rounded-xl"
                  {...register("bedrooms", { valueAsNumber: true })}
                />
                {errors.bedrooms && (
                  <p className="text-xs text-destructive">{errors.bedrooms.message}</p>
                )}
              </div>

              {/* Bathrooms */}
              <div className="space-y-1.5">
                <Label htmlFor="bathrooms" className="text-xs font-semibold">
                  Bathrooms *
                </Label>
                <Input
                  id="bathrooms"
                  type="number"
                  placeholder="1"
                  className="rounded-xl"
                  {...register("bathrooms", { valueAsNumber: true })}
                />
                {errors.bathrooms && (
                  <p className="text-xs text-destructive">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Photos & Amenities */}
        <div className="space-y-6">
          {/* Photos Upload Card */}
          <div className="p-6 rounded-2xl border bg-card space-y-5 shadow-xs">
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
          <div className="p-6 rounded-2xl border bg-card space-y-5 shadow-xs">
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
                    {...register(`amenities.${index}.name` as const)}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
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
          className="rounded-xl px-8 font-semibold shadow-md"
        >
          {isSubmitting ? "Saving Property..." : "Publish Listing"}
        </Button>
      </div>
    </form>
  );
}
