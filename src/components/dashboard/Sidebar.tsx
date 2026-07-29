"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import {
  Home,
  Settings,
  LogOut,
  LayoutDashboard,
  Building,
  Users,
  Tags,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar() {
  const { user, isLoading, clearUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await api.post("/auth/logout", {});
    clearUser();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <aside className="w-64 border-r bg-card flex-col flex min-h-[calc(100vh-4rem)] p-4 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </aside>
    );
  }

  if (!user) return null;

  // Role-specific navigation links
  const tenantLinks = [
    { name: "Dashboard", href: "/dashboard/tenant", icon: LayoutDashboard },
  ];

  const landlordLinks = [
    { name: "Dashboard", href: "/dashboard/landlord", icon: LayoutDashboard },
    {
      name: "My Properties",
      href: "/dashboard/landlord/properties",
      icon: Building,
    },
    { name: "Requests", href: "/dashboard/landlord/requests", icon: Inbox },
  ];

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Categories", href: "/dashboard/admin/categories", icon: Tags },
    { name: "Properties", href: "/dashboard/admin/properties", icon: Building },
  ];

  const roleLinks =
    user.role === "TENANT"
      ? tenantLinks
      : user.role === "LANDLORD"
        ? landlordLinks
        : user.role === "ADMIN"
          ? adminLinks
          : [];

  return (
    <aside className="w-64 border-r bg-card flex-col flex min-h-[calc(100vh-4rem)]">
      <div className="flex-1 px-3 py-6 space-y-6">
        {/* Role Menu */}
        <div>
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {user.role} MENU
          </h3>
          <nav className="space-y-1">
            {roleLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* General Menu */}
        <div>
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ACCOUNT
          </h3>
          <nav className="space-y-1">
            <Link
              href="/dashboard/account"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname === "/dashboard/account"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Home className="h-4 w-4" />
              Back to Site
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
