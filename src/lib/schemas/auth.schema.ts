import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  password: passwordSchema,
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
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => !val || (val.length >= 8 && /[A-Z]/.test(val) && /[a-z]/.test(val) && /[0-9]/.test(val)),
        { message: "New password must be at least 8 characters with upper, lower, and a number" }
      ),
    confirmPassword: z.string().optional().or(z.literal("")),
    password: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return Boolean(data.currentPassword && data.confirmPassword === data.newPassword);
      }
      return true;
    },
    {
      message: "Current password is required and passwords must match",
      path: ["confirmPassword"],
    }
  );

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
