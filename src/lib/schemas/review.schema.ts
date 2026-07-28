import { z } from "zod";

export const reviewSchema = z.object({
  rating: z
    .number({ error: "Please select a rating" })
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z
    .string()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
