import { z } from "zod";

export const rentalRequestSchema = z.object({
  moveInDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      { message: "Please enter a valid date" }
    ),
  message: z
    .string()
    .max(500, "Message cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
});

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;
