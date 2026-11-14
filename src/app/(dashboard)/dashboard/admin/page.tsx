"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Building,
  FileText,
  DollarSign,
  TrendingUp,
  Tags,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAdminStats } from "@/hooks/api/useStats";
import { ChartCard, DynamicResponsiveContainer } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "var(--success)",
  APPROVED: "var(--primary)",
  ACTIVE: "var(--secondary)",
  PENDING: "var(--warning)",
  REJECTED: "var(--destructive)",
};

const CATEGORY_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--success)",
  "var(--warning)",
  "var(--muted-foreground)",
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const totals = stats?.totals ?? {
    users: 0,
    tenants: 0,
    landlords: 0,
    properties: 0,
    availableProperties: 0,
    rentals: 0,
    pendingRentals: 0,
    revenue: 0,
  };

  const propertiesByCategory = (stats?.propertiesByCategory ?? []).filter(
    (c: { name: string; count: number }) => c.count > 0
  );
  const rentalsByStatus = stats?.rentalsByStatus ?? [];
  const monthlyData = stats?.monthly ?? [];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Admin Control Center"
        description={`Welcome back, ${user?.name || "Administrator"}. Here is your real-time platform financial and operational metrics.`}
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="rounded-xl">
              <Link href="/dashboard/admin/users">Manage Users</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/dashboard/admin/properties">Moderate Properties</Link>
            </Button>
          </div>
        }
      />

      {/* 4 Summary Cards from totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Users
            </p>
            <p className="text-3xl font-extrabold text-foreground">{totals.users}</p>
            <p className="text-xs text-muted-foreground">
              {totals.tenants} tenants • {totals.landlords} landlords
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Total Properties */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Properties
            </p>
            <p className="text-3xl font-extrabold text-foreground">{totals.properties}</p>
            <p className="text-xs text-muted-foreground">
              {totals.availableProperties} available for rent
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <Building className="h-6 w-6" />
          </div>
        </div>

        {/* Total Rentals */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Rental Requests
            </p>
            <p className="text-3xl font-extrabold text-foreground">{totals.rentals}</p>
            <p className="text-xs text-muted-foreground">
              {totals.pendingRentals} pending approval
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Platform Volume
            </p>
            <p className="text-3xl font-extrabold text-primary">
              {formatCurrency(totals.revenue)}
            </p>
            <p className="text-xs text-muted-foreground">Total settled payments</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Monthly Trends (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Monthly Activity & Revenue Trend"
            description="Track new user registrations, lease applications, and processed payment revenue over time."
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
                    dataKey="users"
                    name="New Users"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rentals"
                    name="Rentals"
                    stroke="var(--secondary)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name="Volume ($)"
                    stroke="var(--success)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </DynamicResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Pie Chart: Rentals by Status (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Rentals by Status"
            description="Distribution of rental request statuses across the marketplace."
            hasData={rentalsByStatus.length > 0}
          >
            <div className="h-72 w-full pt-2">
              <DynamicResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={rentalsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {rentalsByStatus.map((entry: { status: string; count: number }) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || "var(--primary)"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </DynamicResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Bar Chart: Properties by Category (12 cols) */}
        <div className="lg:col-span-12">
          <ChartCard
            title="Properties by Category"
            description="Active listing density across all registered residential property categories."
            hasData={propertiesByCategory.length > 0}
            actions={
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href="/dashboard/admin/categories">Manage Categories</Link>
              </Button>
            }
          >
            <div className="h-72 w-full pt-4">
              <DynamicResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertiesByCategory}
                  margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  />
                  <Bar dataKey="count" name="Properties" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {propertiesByCategory.map((_: unknown, idx: number) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </DynamicResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
