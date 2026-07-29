import { z } from "zod";

export const createRentalSchema = z.object({
  moveInDate: z.string().optional(),
  message: z.string().optional(),
});

export type CreateRentalInput = z.infer<typeof createRentalSchema>;
