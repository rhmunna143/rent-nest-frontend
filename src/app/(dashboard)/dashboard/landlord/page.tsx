"use client";

import * as React from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Clock,
  DollarSign,
  Plus,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLandlordStats, useLandlordRequests } from "@/hooks/api/useLandlord";
import { ChartCard, DynamicResponsiveContainer } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useLandlordStats();
  const { data: requestsData, isLoading: reqsLoading } = useLandlordRequests({
    limit: 5,
  });

  const isLoading = statsLoading || reqsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const monthlyData = stats?.monthly ?? [];
  const recentRequests = requestsData?.data ?? [];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Landlord Portal"
        description={`Welcome back, ${user?.name || "Landlord"}. Monitor your portfolio performance, tenant applications, and rental disbursements.`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/dashboard/landlord/requests">
                <Inbox className="mr-1.5 h-4 w-4" />
                Review Requests
              </Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/dashboard/landlord/properties/new">
                <Plus className="mr-1.5 h-4 w-4" />
                List Property
              </Link>
            </Button>
          </div>
        }
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              My Properties
            </p>
            <p className="text-3xl font-extrabold text-foreground">
              {stats?.totalProperties ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Registered listings</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building2 className="h-6 w-6" />
          </div>
        </div>

        {/* Active Rentals */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Leases
            </p>
            <p className="text-3xl font-extrabold text-foreground">
              {stats?.activeRentals ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Pending Requests */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Inquiries
            </p>
            <p className="text-3xl font-extrabold text-warning">
              {stats?.pendingRequests ?? 0}
            </p>
            <p className="text-xs text-muted-foreground">Awaiting your response</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Real Payments Earnings */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Net Revenue
            </p>
            <p className="text-3xl font-extrabold text-primary">
              {formatCurrency(stats?.earnings ?? 0)}
            </p>
            <p className="text-xs text-muted-foreground">Collected payments</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Earnings & Inquiries Line Chart */}
      <div id="earnings">
        <ChartCard
          title="Revenue & Application Velocity"
          description="Historical progression of tenant lease applications and settled rental revenue."
          hasData={monthlyData.length > 0}
        >
          <div className="h-72 w-full pt-4">
            <DynamicResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--card)",
                    color: "var(--card-foreground)",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  name="Applications"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="earnings"
                  name="Earnings ($)"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </DynamicResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Recent Rental Applications</h3>
            <p className="text-xs text-muted-foreground">
              Latest applications received across your active listings.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link href="/dashboard/landlord/requests">
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {recentRequests.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border bg-card/60 border-dashed space-y-2">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto opacity-40" />
            <h4 className="font-semibold text-sm">No applications yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Once prospective tenants discover your properties and apply, their requests will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border bg-card shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {req.tenant?.name || "Applicant"}
                    </span>
                    <RentalStatusBadge status={req.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Applied for:{" "}
                    <span className="font-medium text-foreground">
                      {req.property?.title || "Property"}
                    </span>{" "}
                    • {formatDate(req.createdAt)}
                  </p>
                </div>

                <Button asChild size="sm" variant="ghost" className="rounded-xl self-start sm:self-auto text-xs">
                  <Link href="/dashboard/landlord/requests">
                    Manage Request <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
