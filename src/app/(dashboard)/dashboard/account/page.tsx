"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  BadgeInfo,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

import {
  profileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/schemas/auth.schema";
import { api } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { FormField, SubmitButton } from "@/components/shared";
import type { User } from "@/types";
import { cn } from "@/lib/cn";

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
  });

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/auth/login?returnTo=/dashboard/account");
    }
  }, [isLoading, user, router]);

  // Pre-fill the form when user loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? "",
        phone: user.phone ?? "",
        profileImage: user.profileImage ?? "",
        password: "",
      });
    }
  }, [user, reset]);

  async function onSubmit(data: ProfileUpdateInput) {
    // Remove empty optional fields before sending
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined),
    );

    const result = await api.patch<User>("/auth/me", payload);

    if (!result.ok) {
      const detail = result.errorDetails?.[0];
      toast.error(detail?.message ?? result.message);
      return;
    }

    await refreshUser();
    toast.success("Profile updated successfully");
    reset({ ...data, password: "" });
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <LoadingSkeleton className="h-10 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-7">
          <LoadingSkeleton className="h-64 md:col-span-2 rounded-xl" />
          <LoadingSkeleton className="h-96 md:col-span-5 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 animate-fade-in mx-auto w-full">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Account Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your personal profile and security preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-12">
        {/* Left Column - Profile Overview */}
        <div className="md:col-span-3 lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <div className="h-24 bg-linear-to-r from-primary/20 via-primary/10 to-blue-500/10 w-full" />
            <CardContent className="px-6 pb-6 pt-0">
              <div className="flex flex-col items-center text-center -mt-12 space-y-4">
                <Avatar className="h-24 w-24 border-4 border-card shadow-sm">
                  <AvatarImage
                    src={user.profileImage ?? undefined}
                    alt={user.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold shadow-sm uppercase tracking-wide">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {user.role}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BadgeInfo className="h-4 w-4" /> Account Status
                  </span>
                  <span className="font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" /> Member Since
                  </span>
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="md:col-span-4 lg:col-span-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>
                Update your contact information. Leave the password field blank
                to keep your current password.
              </CardDescription>
            </CardHeader>
            <form
              id="account-form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <FormField
                    id="account-name"
                    label={
                      <div className="flex items-center gap-1.5 font-medium">
                        <UserIcon className="h-4 w-4 text-muted-foreground" /> Full Name
                      </div>
                    }
                    placeholder={user.name}
                    error={errors.name?.message}
                    {...register("name")}
                  />

                  {/* Phone */}
                  <FormField
                    id="account-phone"
                    type="tel"
                    label={
                      <div className="flex items-center gap-1.5 font-medium">
                        <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                      </div>
                    }
                    placeholder="+1 555 000 0000"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>

                {/* Email (read-only) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-4 w-4 text-muted-foreground" /> Email
                    Address
                  </Label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/70 font-medium bg-muted px-2 py-0.5 rounded">
                      Cannot be changed
                    </span>
                  </div>
                </div>

                {/* Profile image URL */}
                <FormField
                  id="account-profile-image"
                  type="url"
                  label={
                    <div className="flex items-center gap-1.5 font-medium">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" /> Profile Image URL
                    </div>
                  }
                  description="Provide a direct link to an image (e.g., Imgur, GitHub)."
                  placeholder="https://example.com/your-photo.jpg"
                  error={errors.profileImage?.message}
                  {...register("profileImage")}
                />

                <Separator className="my-6" />

                {/* Security Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Security</h3>
                  <FormField
                    id="account-password"
                    type="password"
                    label={
                      <div className="flex items-center gap-1.5 font-medium">
                        <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
                      </div>
                    }
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register("password")}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 px-6 py-4 border-t flex justify-end">
                <SubmitButton
                  size="lg"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !isDirty}
                  className="w-full sm:w-auto shadow-sm"
                  id="account-save"
                >
                  Save Changes
                </SubmitButton>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
