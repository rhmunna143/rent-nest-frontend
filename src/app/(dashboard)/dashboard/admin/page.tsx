"use client";

import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Tags, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name || "Admin"}. You have full access to
          platform moderation tools.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Categories Card */}
        <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Category Management</h2>
            <p className="text-muted-foreground text-sm mt-1 mb-4">
              Create, edit, and remove property categories across the platform.
            </p>
            <Button asChild>
              <Link href="/dashboard/admin/categories">Manage Categories</Link>
            </Button>
          </div>
        </div>

        {/* System Status Card */}
        <div className="p-6 border rounded-xl bg-card shadow-sm flex flex-col items-start gap-4">
          <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">System Status</h2>
            <p className="text-muted-foreground text-sm mt-1">
              All services are operational. Role-based routing is actively
              enforcing security boundaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
