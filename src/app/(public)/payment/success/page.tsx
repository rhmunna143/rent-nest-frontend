"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api-client";
import type { RentalRequest } from "@/types";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalId");

  const [status, setStatus] = useState<
    "polling" | "success" | "timeout" | "error"
  >("polling");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!rentalId) {
      setStatus("error");
      setErrorMessage("No rental ID provided. Unable to verify payment.");
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 10; // Poll 10 times (20 seconds max)
    let pollInterval: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        const res = await api.get<RentalRequest>(`/rentals/${rentalId}`);
        if (res.ok && res.data) {
          const rental = res.data;
          // If the webhook has processed the payment, it will be ACTIVE or payment will be COMPLETED
          if (
            rental.status === "ACTIVE" ||
            rental.payment?.status === "COMPLETED"
          ) {
            if (isMounted) setStatus("success");
            clearInterval(pollInterval);
            return;
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }

      pollCount++;
      if (pollCount >= maxPolls) {
        if (isMounted) setStatus("timeout");
        clearInterval(pollInterval);
      }
    };

    // Initial check
    checkPaymentStatus();

    // Setup polling every 2 seconds
    pollInterval = setInterval(checkPaymentStatus, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [rentalId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {status === "polling" && (
        <div className="space-y-6">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Verifying Payment...</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Please wait while we confirm your payment with Stripe. This usually
            takes just a few seconds.
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-6 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your payment has been received and your rental is now active. You
            can contact your landlord to arrange move-in details.
          </p>
          <div className="pt-4">
            <Button size="lg" asChild>
              <Link href={`/dashboard/tenant/requests/${rentalId}`}>
                View Rental Details
              </Link>
            </Button>
          </div>
        </div>
      )}

      {status === "timeout" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Payment Processing
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your payment is taking a bit longer than usual to confirm. Don't
            worry — this is normal! We'll update your dashboard automatically
            once Stripe confirms the transaction.
          </p>
          <div className="pt-4">
            <Button size="lg" asChild>
              <Link href="/dashboard/tenant">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            {errorMessage ||
              "We couldn't verify your payment status. If your card was charged, please contact support."}
          </p>
          <div className="pt-4">
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/tenant">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-muted/10 flex items-center justify-center py-12">
        <div className="bg-card border rounded-2xl shadow-sm p-8 max-w-2xl w-full mx-4">
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            }
          >
            <PaymentSuccessContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
