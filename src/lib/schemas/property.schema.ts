import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(3, "Location is required"),
  rentAmount: z
    .number({ error: "Rent amount must be a number" })
    .positive("Rent amount must be greater than 0"),
  bedrooms: z
    .number({ error: "Bedrooms must be a number" })
    .int()
    .min(1, "At least 1 bedroom is required"),
  bathrooms: z
    .number({ error: "Bathrooms must be a number" })
    .int()
    .min(1, "At least 1 bathroom is required"),
  amenities: z
    .array(z.string())
    .min(1, "Add at least one amenity"),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .min(1, "Add at least one image URL"),
  categoryId: z.string().min(1, "Please select a category"),
});

export type PropertyInput = z.infer<typeof propertySchema>;
