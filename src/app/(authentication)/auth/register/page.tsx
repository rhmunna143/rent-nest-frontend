"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Home, Users, Building2 } from "lucide-react";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/lib/schemas/auth.schema";
import { api } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { User } from "@/types";

function dashboardFor(role: string) {
  switch (role) {
    case "TENANT": return "/dashboard/tenant";
    case "LANDLORD": return "/dashboard/landlord";
    default: return "/";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"TENANT" | "LANDLORD">("TENANT");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "TENANT" },
  });

  const onRoleSelect = (role: "TENANT" | "LANDLORD") => {
    setSelectedRole(role);
    setValue("role", role, { shouldValidate: true });
  };

  async function onSubmit(data: RegisterInput) {
    const result = await api.post<User>("/auth/register", data);

    if (!result.ok) {
      // Surface field-level errors from errorDetails
      const detail = result.errorDetails?.[0];
      toast.error(detail?.message ?? result.message);
      return;
    }

    await refreshUser();
    toast.success("Account created! Welcome to RentNest 🎉");
    router.push(dashboardFor(data.role));
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-4xl">🏠</span>
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Join RentNest as a tenant or landlord
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="register-form" noValidate className="space-y-5">
            {/* Role selector */}
            <div className="space-y-2">
              <Label>I am a…</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["TENANT", "LANDLORD"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    id={`role-${role.toLowerCase()}`}
                    onClick={() => onRoleSelect(role)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all hover:border-primary/60",
                      selectedRole === role
                        ? "border-primary bg-primary/5"
                        : "border-muted bg-card"
                    )}
                  >
                    {role === "TENANT" ? (
                      <Users className="h-6 w-6 text-primary" />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                    <span className="text-sm font-medium">
                      {role === "TENANT" ? "Tenant" : "Landlord"}
                    </span>
                    <span className="text-xs text-muted-foreground text-center">
                      {role === "TENANT"
                        ? "Browse and rent properties"
                        : "List and manage properties"}
                    </span>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="register-name">Full name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "register-name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="register-name-error" className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "register-email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="register-email-error" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "register-password-error" : undefined}
                {...register("password")}
              />
              {errors.password && (
                <p id="register-password-error" className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              id="register-submit"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:underline"
              id="login-link"
            >
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
