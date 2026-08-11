"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { type Property, type RentalRequest } from "@/types";
import { Building2, Users, AlertCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { format } from "date-fns";
import { EmptyState } from "@/components/shared";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function LandlordDashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [propsRes, reqsRes] = await Promise.all([
          api.get<Property[]>("/landlord/properties"),
          api.get<RentalRequest[]>("/landlord/requests"),
        ]);

        if (propsRes.ok && propsRes.data) {
          setProperties(propsRes.data);
        } else {
          throw new Error(propsRes.message || "Failed to load properties");
        }

        if (reqsRes.ok && reqsRes.data) {
          setRequests(reqsRes.data);
        } else {
          throw new Error(reqsRes.message || "Failed to load requests");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border rounded-xl bg-destructive/10 text-destructive text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <h2 className="font-semibold">Failed to load dashboard data</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Calculate metrics
  const activeTenantsCount = requests.filter(
    (r) => r.status === "ACTIVE" || r.status === "COMPLETED",
  ).length;
  const pendingRequestsCount = requests.filter(
    (r) => r.status === "PENDING",
  ).length;

  // Estimate earnings (sum of rentAmount for ACTIVE/COMPLETED rentals)
  const estimatedEarnings = requests
    .filter((r) => r.status === "ACTIVE" || r.status === "COMPLETED")
    .reduce((sum, req) => sum + Number(req.property?.rentAmount || 0), 0);

  // Group requests by month for the line chart
  const requestsByMonth = requests.reduce((acc, req) => {
    const month = format(new Date(req.createdAt), "MMM yyyy");
    if (!acc[month]) {
      acc[month] = { month, requests: 0 };
    }
    acc[month].requests += 1;
    return acc;
  }, {} as Record<string, { month: string; requests: number }>);

  const chartData = Object.values(requestsByMonth).sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );

  const recentRequests = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 flex flex-col min-h-[calc(100vh-8rem)] p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">Add Property</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Properties"
          value={properties.length.toString()}
          icon={<Building2 className="w-5 h-5 text-blue-500" />}
        />
        <DashboardCard
          title="Active Tenants"
          value={activeTenantsCount.toString()}
          icon={<Users className="w-5 h-5 text-green-500" />}
        />
        <DashboardCard
          title="Pending Requests"
          value={pendingRequestsCount.toString()}
          icon={<AlertCircle className="w-5 h-5 text-yellow-500" />}
        />
        <DashboardCard
          title="Estimated Earnings"
          value={`$${estimatedEarnings.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5 text-purple-500" />}
        />
      </div>

      <div className="border rounded-xl bg-card shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-6">Request Volume Over Time</h3>
        {chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} 
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))" }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
            No request data available to chart.
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 flex-1">
        <div className="border rounded-xl bg-card shadow-sm flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Recent Requests</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/landlord/requests">View All</Link>
            </Button>
          </div>
          <div className="p-6 flex-1">
            {recentRequests.length === 0 ? (
              <div className="h-full pt-4">
                <EmptyState
                  icon={Users}
                  title="No recent requests"
                  description="You don't have any new rental requests."
                />
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {req.tenant?.name || "Unknown Tenant"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {req.property?.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Requested on{" "}
                        {format(new Date(req.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <RentalStatusBadge status={req.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-xl bg-card shadow-sm flex flex-col">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="font-semibold text-lg">Your Properties</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/landlord/properties">Manage</Link>
            </Button>
          </div>
          <div className="p-6 flex-1">
            {properties.length === 0 ? (
              <div className="h-full pt-4">
                <EmptyState
                  icon={Building2}
                  title="No properties listed"
                  description="You haven't listed any properties yet."
                  action={{ label: "List a Property", onClick: () => window.location.href = "/dashboard/landlord/properties/new" }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((prop) => (
                  <div
                    key={prop.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {prop.images && prop.images.length > 0 ? (
                        <div className="w-12 h-12 rounded bg-muted overflow-hidden shrink-0">
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">
                          {prop.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ${prop.rentAmount.toLocaleString()} / mo
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${prop.status === "AVAILABLE" ? "bg-green-50 text-green-700 border-green-200" : prop.status === "RENTED" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                    >
                      {prop.status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110">
        {icon}
      </div>
      <div className="flex items-center space-x-2 text-muted-foreground mb-4">
        {icon}
        <h3 className="font-medium text-sm">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
