"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, FileText, CreditCard, Activity, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PropertyStatusBadge,
  RentalStatusBadge,
} from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import type { RentalRequest, Payment } from "@/types";
import { api } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared";

export default function TenantDashboardPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [requestsPage, setRequestsPage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function loadData() {
      try {
        const [rentalsRes, paymentsRes] = await Promise.all([
          api.get<RentalRequest[]>("/rentals"),
          api.get<Payment[]>("/payments"),
        ]);

        if (rentalsRes.ok) {
          setRentals(rentalsRes.data || []);
        } else {
          setError(rentalsRes.message);
        }

        if (paymentsRes.ok) {
          setPayments(paymentsRes.data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <div className="space-y-4 pt-8">
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Tenant Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your rental requests and view your payment history.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium text-sm">Total Requests</h3>
          </div>
          <p className="text-3xl font-bold">{rentals.length}</p>
        </div>
        <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="font-medium text-sm">Active Rentals</h3>
          </div>
          <p className="text-3xl font-bold">
            {rentals.filter(r => r.status === "ACTIVE").length}
          </p>
        </div>
        <div className="p-6 border rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <h3 className="font-medium text-sm">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold">
            ${payments.filter(p => p.status === "COMPLETED").reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Requests Section */}
      <section className="space-y-4" id="requests">
        <div className="flex items-center gap-2 border-b pb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">My Rental Requests</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm mb-4">
            Error loading data: {error}
          </div>
        )}

        {rentals.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No requests yet"
            description="You haven't requested any properties."
            action={{ label: "Browse Properties", onClick: () => window.location.href = "/properties" }}
          />
        ) : (
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Move-in Date</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rentals.slice((requestsPage - 1) * itemsPerPage, requestsPage * itemsPerPage).map((rental) => (
                  <tr
                    key={rental.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-base">
                        {rental.property?.title || "Unknown Property"}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {rental.property?.location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <RentalStatusBadge status={rental.status as any} />
                    </td>
                    <td className="px-4 py-4">
                      {rental.moveInDate
                        ? format(new Date(rental.moveInDate), "MMM d, yyyy")
                        : "Not specified"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {rental.status === "APPROVED" && (
                          <Button size="sm" variant="default" asChild>
                            <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
                              Pay Now
                            </Link>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/tenant/requests/${rental.id}`}>
                            View <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination for Rentals */}
            {rentals.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  Showing {(requestsPage - 1) * itemsPerPage + 1} to {Math.min(requestsPage * itemsPerPage, rentals.length)} of {rentals.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRequestsPage(p => Math.max(1, p - 1))}
                    disabled={requestsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRequestsPage(p => Math.min(Math.ceil(rentals.length / itemsPerPage), p + 1))}
                    disabled={requestsPage === Math.ceil(rentals.length / itemsPerPage)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Payments Section */}
      <section className="space-y-4" id="payments">
        <div className="flex items-center gap-2 border-b pb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="You have no payment history at this time."
          />
        ) : (
          <div className="border rounded-lg overflow-hidden bg-card shadow-sm overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Transaction ID</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {payments.slice((paymentsPage - 1) * itemsPerPage, paymentsPage * itemsPerPage).map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-4">
                      {format(new Date(payment.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-4 font-medium">${payment.amount}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          payment.status === "COMPLETED"
                            ? "bg-primary text-primary-foreground dark:bg-primary/60 dark:text-primary-foreground"
                            : payment.status === "PENDING"
                              ? "bg-accent-foreground text-accent-foreground dark:bg-yellow-900/30 dark:text-primary"
                              : "bg-destructive text-destructive-foreground dark:bg-destructive/30 dark:text-destructive-foreground"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-muted-foreground font-mono text-xs">
                      {payment.transactionId || "N/A"}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination for Payments */}
            {payments.length > itemsPerPage && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  Showing {(paymentsPage - 1) * itemsPerPage + 1} to {Math.min(paymentsPage * itemsPerPage, payments.length)} of {payments.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentsPage(p => Math.max(1, p - 1))}
                    disabled={paymentsPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPaymentsPage(p => Math.min(Math.ceil(payments.length / itemsPerPage), p + 1))}
                    disabled={paymentsPage === Math.ceil(payments.length / itemsPerPage)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
