"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import { dashboardFor } from "@/lib/roles";
import { getInitials } from "@/lib/format";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, User, Heart } from "lucide-react";

export function UserMenu() {
  const { user, isLoading, clearUser } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await api.post("/auth/logout");
    clearUser();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return <div className="h-9 w-24 animate-pulse rounded-xl bg-muted" />;
  }

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="User menu"
          id="user-menu-trigger"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.profileImage ?? undefined}
              alt={user.name}
            />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium max-w-[120px] truncate hidden sm:inline-block">
            {user.name}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={dashboardFor(user.role)} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        {user.role === "TENANT" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/tenant/saved" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              Saved Properties
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <Link href="/dashboard/account" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile & Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer"
          id="logout-button"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
