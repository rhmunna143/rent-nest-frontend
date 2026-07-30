"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, FileText, CreditCard } from "lucide-react";
import {
  PropertyStatusBadge,
  RentalStatusBadge,
} from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import type { RentalRequest, Payment } from "@/types";
import { api } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TenantDashboardPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      {/* Requests Section */}
      <section className="space-y-4">
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
          <div className="text-center py-12 border rounded-lg bg-muted/20 border-dashed">
            <h3 className="text-lg font-medium mb-2">No requests yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't requested any properties.
            </p>
            <Button asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
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
                {rentals.map((rental) => (
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
          </div>
        )}
      </section>

      {/* Payments Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/20 border-dashed">
            <p className="text-muted-foreground">No payments found.</p>
          </div>
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
                {payments.map((payment) => (
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
          </div>
        )}
      </section>
    </div>
  );
}
