import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], {
    error: "Please select a role",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    profileImage: z
      .string()
      .url("Please enter a valid image URL")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "New password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) =>
      Object.values(data).some((v) => v !== undefined && v !== ""),
    { message: "At least one field must be updated" }
  );

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
