"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Loader2, User as UserIcon, Mail, Phone, Image as ImageIcon, Lock } from "lucide-react";
import { toast } from "sonner";

import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/schemas/auth.schema";
import { api } from "@/lib/api-client";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import type { User } from "@/types";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
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
      router.replace("/auth/login?returnTo=/account");
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
      Object.entries(data).filter(([, v]) => v !== "" && v !== undefined)
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
      <div className="container mx-auto max-w-2xl px-4 py-12 space-y-6">
        <LoadingSkeleton className="h-8 w-48" />
        <LoadingSkeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile and account preferences
        </p>
      </div>

      {/* Profile summary */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImage ?? undefined} alt={user.name} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <span className="mt-1 inline-flex items-center rounded-full bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5">
              {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information. Leave a field blank to keep it unchanged.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="account-form"
            noValidate
            className="space-y-5"
          >
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="account-name" className="flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5" /> Full name
              </Label>
              <Input
                id="account-name"
                type="text"
                placeholder={user.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "account-name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <p id="account-name-error" className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </Label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="bg-muted"
                aria-label="Email (read-only)"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="account-phone" className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone number
              </Label>
              <Input
                id="account-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            {/* Profile image URL */}
            <div className="space-y-1.5">
              <Label htmlFor="account-profile-image" className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5" /> Profile image URL
              </Label>
              <Input
                id="account-profile-image"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                aria-invalid={!!errors.profileImage}
                aria-describedby={errors.profileImage ? "account-profile-image-error" : undefined}
                {...register("profileImage")}
              />
              {errors.profileImage && (
                <p id="account-profile-image-error" className="text-xs text-destructive">
                  {errors.profileImage.message}
                </p>
              )}
            </div>

            <Separator />

            {/* New password */}
            <div className="space-y-1.5">
              <Label htmlFor="account-password" className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" /> New password
              </Label>
              <Input
                id="account-password"
                type="password"
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "account-password-error" : undefined}
                {...register("password")}
              />
              {errors.password && (
                <p id="account-password-error" className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSubmitting || !isDirty}
              id="account-save"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
