"use client";

import { notFound, useParams } from "next/navigation";
import { format } from "date-fns";
import {
  MapPin,
  Calendar,
  CheckCircle2,
  MessageSquare,
  Building,
  CreditCard,
} from "lucide-react";
import {
  PropertyStatusBadge,
  RentalStatusBadge,
} from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import type { RentalRequest } from "@/types";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TenantRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [rental, setRental] = useState<RentalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get<RentalRequest>(
          `/rentals/${unwrappedParams.id}`,
        );
        if (res.ok) {
          setRental(res.data);
        } else {
          setError(res.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [unwrappedParams.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <Skeleton className="h-10 w-64 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <h2 className="text-2xl font-bold">Request not found</h2>
        <p className="text-muted-foreground mt-2">
          {error || "Could not load this request."}
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/tenant">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const property = rental.property;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Request Details</h1>
            <RentalStatusBadge status={rental.status as any} />
          </div>
          <p className="text-muted-foreground flex items-center gap-1.5">
            Submitted on {format(new Date(rental.createdAt), "MMMM d, yyyy")}
          </p>
        </div>

        {rental.status === "APPROVED" && !rental.payment && (
          <Button size="lg" className="w-full md:w-auto" asChild>
            <Link href={`/dashboard/tenant/requests/${rental.id}/pay`}>
              Pay Now to Confirm
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Request & Property Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 border rounded-xl bg-card space-y-4">
            <h2 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Request Preferences
            </h2>
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Desired Move-in Date
                </p>
                <p className="text-lg">
                  {rental.moveInDate
                    ? format(new Date(rental.moveInDate), "MMMM d, yyyy")
                    : "Not specified"}
                </p>
              </div>

              {rental.message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
                    <MessageSquare className="h-4 w-4" /> Message to Landlord
                  </p>
                  <p className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap border border-dashed">
                    {rental.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {property && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" /> Property Details
              </h2>

              <div className="flex gap-4 pt-2">
                {property.images && property.images.length > 0 && (
                  <div className="w-32 h-32 shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {property.location}
                  </p>
                  <p className="font-bold text-primary">
                    ${property.rentAmount}{" "}
                    <span className="font-normal text-sm text-muted-foreground">
                      / month
                    </span>
                  </p>

                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/properties/${property.id}`}>
                      View full listing
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Payment */}
        <div className="space-y-6">
          <div className="p-6 border rounded-xl bg-card">
            <h3 className="font-semibold mb-4">Request Status Tracker</h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
              <div className="relative flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background z-10 shrink-0 mt-0.5 ${rental.status !== "REJECTED" ? "border-primary text-primary" : "border-muted text-muted-foreground"}`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="flex-1 p-4 rounded-xl border bg-card shadow-sm">
                  <div className="font-bold text-foreground mb-1">
                    Requested
                  </div>
                  <div className="text-sm text-muted-foreground">
                    You submitted a rental request.
                  </div>
                </div>
              </div>

              {rental.status === "REJECTED" && (
                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-red-500 bg-background z-10 shrink-0 mt-0.5 text-red-500">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl border border-red-200 bg-red-50 shadow-sm">
                    <div className="font-bold text-red-700 mb-1">Rejected</div>
                    <div className="text-sm text-red-600">
                      The landlord declined this request.
                    </div>
                  </div>
                </div>
              )}

              {(rental.status === "APPROVED" ||
                rental.status === "ACTIVE" ||
                rental.status === "COMPLETED") && (
                <div className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background z-10 shrink-0 mt-0.5 border-primary text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 p-4 rounded-xl border bg-card shadow-sm">
                    <div className="font-bold text-foreground mb-1">
                      Approved
                    </div>
                    <div className="text-sm text-muted-foreground">
                      The landlord approved your request!
                    </div>
                  </div>
                </div>
              )}

              {(rental.status === "ACTIVE" || rental.status === "COMPLETED") &&
                rental.payment && (
                  <div className="relative flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 bg-background z-10 shrink-0 mt-0.5 border-green-500 text-green-500">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 p-4 rounded-xl border bg-card shadow-sm">
                      <div className="font-bold text-foreground mb-1">
                        Paid & Active
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Payment of ${rental.payment.amount} was received.
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {rental.payment && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Receipt
              </h3>
              <div className="text-sm space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">{rental.payment.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">${rental.payment.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction</span>
                  <span className="font-mono text-xs">
                    {rental.payment.transactionId || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
