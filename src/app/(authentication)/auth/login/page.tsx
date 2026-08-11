"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
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
import Logo from "@/utils/images/logo";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function dashboardFor(role: string) {
  switch (role) {
    case "TENANT":
      return "/dashboard/tenant";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const setDemoCredentials = (role: "ADMIN" | "LANDLORD" | "TENANT") => {
    switch (role) {
      case "ADMIN":
        setValue("email", "admin@rentnest.com");
        setValue("password", "admin123");
        break;
      case "LANDLORD":
        setValue("email", "landlord@example.com");
        setValue("password", "password123");
        break;
      case "TENANT":
        setValue("email", "tenant@example.com");
        setValue("password", "password123");
        break;
    }
    toast.info(`${role} credentials filled. Click "Sign in" to continue.`);
  };

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
    <div className="min-h-[calc(100vh-4rem)] relative grid md:grid-cols-2 items-center md:gap-12 p-4">
      <Button variant="ghost" className="absolute top-4 left-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <DotLottieReact
        src="https://lottie.host/0baa752b-c738-4c82-93a1-ee16b965367c/uF1ZNflhnO.lottie"
        loop
        autoplay
        className="w-full mx-auto hidden md:flex"
      />

      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your RentNest account</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Button variant="outline" size="sm" type="button" onClick={() => setDemoCredentials("ADMIN")}>
              Admin
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => setDemoCredentials("LANDLORD")}>
              Landlord
            </Button>
            <Button variant="outline" size="sm" type="button" onClick={() => setDemoCredentials("TENANT")}>
              Tenant
            </Button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
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
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
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
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                {...register("password")}
              />
              {errors.password && (
                <p
                  id="login-password-error"
                  className="text-xs text-destructive"
                >
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
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Admin hint */}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Use the buttons above for quick demo access.
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
