"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import {
  FileText,
  CreditCard,
  Building,
  DollarSign,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRentals } from "@/hooks/api/useRentals";
import { usePayments } from "@/hooks/api/usePayments";
import { ChartCard, DynamicResponsiveContainer } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/ui/data-table";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { Payment } from "@/types";

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const { data: rentalsData, isLoading: rentalsLoading } = useRentals();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments();

  const isLoading = rentalsLoading || paymentsLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const rentals = rentalsData?.data ?? [];
  const payments = paymentsData?.data ?? [];

  const activeRentalsCount = rentals.filter((r) => r.status === "ACTIVE").length;
  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // Group payments by month for the Spend-per-Month Bar Chart
  const spendByMonth = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((acc, p) => {
      const date = new Date(p.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, amount: 0 };
      }
      acc[monthKey].amount += Number(p.amount);
      return acc;
    }, {} as Record<string, { month: string; amount: number }>);

  const chartData = Object.values(spendByMonth).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "transactionId",
      header: "Transaction",
      cell: ({ row }) => {
        const id = row.original.transactionId || row.original.id;
        return (
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            {id.slice(0, 16)}...
          </span>
        );
      },
    },
    {
      accessorKey: "rentalRequest",
      header: "Property",
      cell: ({ row }) => {
        const prop = row.original.rentalRequest?.property;
        if (!prop) return <span className="text-xs text-muted-foreground">Lease Payment</span>;
        return (
          <div className="space-y-0.5">
            <Link
              href={`/properties/${prop.id}`}
              target="_blank"
              className="text-xs font-semibold hover:underline flex items-center gap-1 line-clamp-1"
            >
              <span>{prop.title}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Link>
            <p className="text-[11px] text-muted-foreground">{prop.location}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-xs font-bold text-primary">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <PaymentStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Tenant Dashboard"
        description={`Welcome back, ${user?.name || "Renter"}. Track your lease applications, active rentals, and payment records.`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/dashboard/tenant/requests">My Requests</Link>
            </Button>
            <Button asChild size="sm" className="rounded-xl">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        }
      />

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Requests
            </p>
            <p className="text-3xl font-extrabold text-foreground">{rentals.length}</p>
            <p className="text-xs text-muted-foreground">Submitted applications</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active Rentals
            </p>
            <p className="text-3xl font-extrabold text-foreground">{activeRentalsCount}</p>
            <p className="text-xs text-muted-foreground">Currently leased homes</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
            <Building className="h-6 w-6" />
          </div>
        </div>

        <div className="p-6 rounded-xl border bg-card shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Spent
            </p>
            <p className="text-3xl font-extrabold text-primary">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-xs text-muted-foreground">Settled lease payments</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Spend-Per-Month Bar Chart */}
      <ChartCard
        title="Monthly Rental Spend"
        description="Historical view of completed lease payments processed via Stripe."
        hasData={chartData.length > 0}
        emptyMessage="No completed payments yet to chart."
      >
        <div className="h-64 w-full pt-4">
          <DynamicResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
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
              <Bar dataKey="amount" name="Spend ($)" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </DynamicResponsiveContainer>
        </div>
      </ChartCard>

      {/* Payment History DataTable */}
      <div id="payments" className="space-y-4 pt-4 border-t">
        <div>
          <h2 className="text-lg font-bold">Payment History</h2>
          <p className="text-xs text-muted-foreground">
            Audit history of your rental deposits and monthly lease charges.
          </p>
        </div>

        <DataTable
          columns={paymentColumns}
          data={payments}
          isLoading={paymentsLoading}
          searchPlaceholder="Search payments..."
        />
      </div>
    </div>
  );
}
