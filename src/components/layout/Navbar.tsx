"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Search,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";
import Logo from "@/utils/images/logo";

export function dashboardHref(role: string): string {
  switch (role) {
    case "TENANT":
      return "/dashboard/tenant";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    case "ADMIN":
    case "TENANT":
    case "LANDLORD":
      return "/dashboard/account";
    default:
      return "/";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const { user, isLoading, clearUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/properties", label: "Properties", icon: Search },
    { href: "/about", label: "About Us", icon: Home },
    { href: "/contact", label: "Contact Us", icon: Home },
  ];

  async function handleLogout() {
    await api.post("/auth/logout");
    clearUser();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === href ? "text-primary" : "text-muted-foreground",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: auth */}
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
                  <Link
                    href={dashboardHref(user.role)}
                    className="cursor-pointer"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/account" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-accent"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          id="mobile-menu-button"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t bg-background px-4 py-4 space-y-4"
          id="mobile-menu"
        >
          <nav className="flex flex-col gap-3">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium py-2 transition-colors hover:text-primary",
                  pathname === href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4 space-y-2">
            {user ? (
              <>
                <p className="text-sm font-medium">{user.name}</p>
                <Link
                  href={dashboardHref(user.role)}
                  className="flex items-center gap-2 text-sm py-1.5 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-sm py-1.5 hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-sm py-1.5 text-destructive hover:text-destructive/80 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
