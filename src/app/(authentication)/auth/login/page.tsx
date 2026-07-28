"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";

import { loginSchema, type LoginInput } from "@/lib/schemas/auth.schema";
import { api } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { User } from "@/types";

function dashboardFor(role: string) {
  switch (role) {
    case "TENANT": return "/dashboard/tenant";
    case "LANDLORD": return "/dashboard/landlord";
    case "ADMIN": return "/dashboard/admin";
    default: return "/";
  }
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    const result = await api.post<{ user: User }>("/auth/login", data);

    if (!result.ok) {
      toast.error(result.message ?? "Invalid email or password");
      return;
    }

    await refreshUser();
    toast.success("Welcome back!");

    const destination = returnTo ?? dashboardFor(result.data.user.role);
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <span className="text-4xl">🏠</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your RentNest account</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="login-form"
            noValidate
            className="space-y-5"
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "login-email-error" : undefined}
                {...register("email")}
              />
              {errors.email && (
                <p id="login-email-error" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "login-password-error" : undefined}
                {...register("password")}
              />
              {errors.password && (
                <p id="login-password-error" className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              id="login-submit"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Admin hint */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Admin:{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">
              admin@rentnest.com
            </code>{" "}
            /{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded text-[11px]">
              admin123
            </code>
          </p>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-primary hover:underline"
              id="register-link"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
