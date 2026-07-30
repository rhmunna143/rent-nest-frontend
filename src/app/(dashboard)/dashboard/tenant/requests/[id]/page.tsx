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
  Star,
  ArrowLeft,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/lib/schemas/review.schema";
import { toast } from "sonner";

export default function TenantRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const [rental, setRental] = useState<RentalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasReviewed, setHasReviewed] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0 as any, // force user to pick
      comment: "",
    },
  });

  const selectedRating = watch("rating");

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

  const onSubmitReview = async (data: ReviewInput) => {
    setIsSubmittingReview(true);
    try {
      const payload = { ...data, rentalRequestId: rental?.id };
      const res = await api.post("/reviews", payload);
      if (res.ok) {
        toast.success("Review submitted successfully!");
        setHasReviewed(true);
      } else {
        if (res.status === 409) {
          toast.error("You have already reviewed this stay.");
          setHasReviewed(true); // Hide form since it's already done
        } else {
          toast.error(res.message || "Failed to submit review");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
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
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {/* back button */}
            <Button variant="ghost" asChild>
              <Link href="/dashboard/tenant">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold">Request Details</h1>
            <RentalStatusBadge status={rental.status as any} />
          </div>

          <p className="text-muted-foreground flex items-center gap-1.5 ml-15">
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

          {rental.status === "COMPLETED" && (
            <div className="p-6 border rounded-xl bg-card space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2 flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Review Your Stay
              </h2>

              {hasReviewed ? (
                <div className="p-6 bg-green-50 text-green-800 border border-green-200 rounded-lg text-center shadow-sm">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-medium">Thank you for your review!</p>
                  <p className="text-sm mt-1">
                    Your feedback helps others make great decisions.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmitReview)}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      How was your stay?
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setValue("rating", star as any, {
                              shouldValidate: true,
                            })
                          }
                          className={`p-1 transition-colors ${
                            selectedRating >= star
                              ? "text-yellow-400"
                              : "text-muted-foreground/30 hover:text-yellow-400/50"
                          }`}
                        >
                          <Star
                            className={`w-8 h-8 ${selectedRating >= star ? "fill-current" : ""}`}
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.rating.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Share your experience (optional)
                    </label>
                    <textarea
                      className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="What did you love about this property? How was the landlord?"
                      {...register("comment")}
                    />
                    {errors.comment && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.comment.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingReview || selectedRating === 0}
                  >
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              )}
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
