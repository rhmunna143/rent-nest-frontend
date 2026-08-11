"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { ShieldCheck, Tags, Building, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import type { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [totalProperties, setTotalProperties] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Fetch categories to get the total number of categories and the properties breakdown
        const catRes = await api.get<Category[]>("/categories");
        if (catRes.ok && catRes.data) {
          setCategories(catRes.data);
        }

        // Fetch properties with limit=1 just to extract the total count from pagination meta
        const propRes = await api.get<unknown[]>("/properties?limit=1");
        if (propRes.ok && propRes.meta) {
          setTotalProperties(propRes.meta.total);
        } else if (propRes.ok && propRes.data) {
          // fallback if meta isn't correctly returning total
          setTotalProperties(propRes.data.length);
        }
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  // Prepare data for the chart (Properties per Category)
  const chartData = categories.map((cat) => ({
    name: cat.name,
    properties: cat._count?.properties || 0,
  }));

  // Theme colors for the bars
  const COLORS = [
    "#0ea5e9",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#f43f5e",
    "#64748b",
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-10 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-100 mt-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold text-primary">Admin Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name || "Admin"}. Here is your live platform
          overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Total Properties */}
        <div className="p-6 border rounded-xl bg-card shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Building className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Properties
            </p>
            <h2 className="text-3xl font-bold">
              {totalProperties !== null ? totalProperties : "—"}
            </h2>
          </div>
        </div>

        {/* Total Categories */}
        <div className="p-6 border rounded-xl bg-card shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Tags className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Platform Categories
            </p>
            <h2 className="text-3xl font-bold">{categories.length}</h2>
          </div>
        </div>

        {/* System Status */}
        <div className="p-6 border rounded-xl bg-card shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Marketplace Status
            </p>
            <h2 className="text-xl font-bold text-green-600 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Operational
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="xl:col-span-2 border rounded-xl bg-card shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Properties by Category & Share</h3>
          {chartData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 h-87.5">
              <div className="w-full h-full">
                <h4 className="text-sm font-medium text-muted-foreground text-center mb-2">Total Count</h4>
                <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--muted))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar
                    dataKey="properties"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              </div>
              <div className="w-full h-full">
                <h4 className="text-sm font-medium text-muted-foreground text-center mb-2">Category Share</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="properties"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      cursor={{ fill: "hsl(var(--muted)/0.5)" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-87.5 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              No category data available to chart.
            </div>
          )}
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <div className="border rounded-xl bg-card shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Category Management</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create and manage the primary classification tags used by
              landlords to list their properties.
            </p>
            <Button className="w-full" asChild>
              <Link href="/dashboard/admin/categories">Manage Categories</Link>
            </Button>
          </div>

          <div className="border rounded-xl bg-muted/30 p-6">
            <h3 className="text-sm font-semibold mb-2 uppercase text-muted-foreground tracking-wider">
              Dashboard Scope
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Because global user aggregates and historical revenue endpoints
              are currently out of scope for the backend v1 API, this dashboard
              exclusively showcases 100% live property and category metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
