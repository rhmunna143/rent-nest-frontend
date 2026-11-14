"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Home,
  Settings,
  LogOut,
  LayoutDashboard,
  Building,
  Users,
  Tags,
  Inbox,
  FileText,
  CreditCard,
  Heart,
  DollarSign,
  ShieldCheck,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function Sidebar() {
  const { user, isLoading, clearUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // ignore
    }
    clearUser();
    toast.success("Logged out successfully");
    router.push("/auth/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <aside className="w-64 border-r bg-card flex-col flex min-h-[calc(100vh-4rem)] p-4 space-y-4">
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
      </aside>
    );
  }

  if (!user) return null;

  // Role-specific navigation links
  const tenantLinks = [
    { name: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
    { name: "My Requests", href: "/dashboard/tenant/requests", icon: FileText },
    { name: "Payments", href: "/dashboard/tenant#payments", icon: CreditCard },
    { name: "Saved Properties", href: "/dashboard/tenant/saved", icon: Heart },
    { name: "Profile & Account", href: "/dashboard/account", icon: Settings },
  ];

  const landlordLinks = [
    { name: "Overview", href: "/dashboard/landlord", icon: LayoutDashboard },
    { name: "My Properties", href: "/dashboard/landlord/properties", icon: Building },
    { name: "Rental Requests", href: "/dashboard/landlord/requests", icon: Inbox },
    { name: "Earnings & Revenue", href: "/dashboard/landlord#earnings", icon: DollarSign },
    { name: "Profile & Account", href: "/dashboard/account", icon: Settings },
  ];

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Properties", href: "/dashboard/admin/properties", icon: ShieldCheck },
    { name: "Rental Requests", href: "/dashboard/admin/rentals", icon: FileText },
    { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Categories", href: "/dashboard/admin/categories", icon: Tags },
    { name: "Messages", href: "/dashboard/admin/messages", icon: Mail },
    { name: "Settings", href: "/dashboard/account", icon: Settings },
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
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {user.role} PORTAL
          </h3>
          <nav className="space-y-1">
            {roleLinks.map((link) => {
              const isActive =
                link.href.includes("#")
                  ? pathname === link.href.split("#")[0]
                  : pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Nav */}
        <div>
          <h3 className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            NAVIGATION
          </h3>
          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Home className="h-4 w-4 shrink-0" />
              <span>Back to Site</span>
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
