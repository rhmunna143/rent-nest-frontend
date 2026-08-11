"use client";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import {
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import * as React from "react";
import { toast } from "sonner";
import { dashboardHref, getInitials } from "./Navbar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface INavAvatarProps {}

export default function NavAvatar() {
  const { user, isLoading, clearUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Search },
  ];

  async function handleLogout() {
    await api.post("/auth/logout");
    clearUser();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="hidden md:flex items-center gap-3">
      {isLoading ? (
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      ) : user ? (
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
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium max-w-30 truncate">
                {user.name}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Account
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer"
              id="logout-button"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/register">Sign up</Link>
          </Button>
        </>
      )}
    </div>
  );
}
