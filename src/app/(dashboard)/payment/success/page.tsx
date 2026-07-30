"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Payment } from "@/types";

export default function PaymentSuccessPage() {
  const [isConfirming, setIsConfirming] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    let mounted = true;
    let pollInterval: NodeJS.Timeout;

    // poll /api/payments to check if the most recent payment is COMPLETED
    const checkPaymentStatus = async () => {
      try {
        const res = await api.get<Payment[]>("/payments");
        if (res.ok && res.data) {
          const payments = res.data;
          if (payments.length > 0) {
            // Sort by newest first
            payments.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            );
            const latestPayment = payments[0];

            if (latestPayment.status === "COMPLETED") {
              if (mounted) {
                setIsConfirming(false);
                setIsConfirmed(true);
                clearInterval(pollInterval);
              }
            }
          }
        }
      } catch (err) {
        console.error("Polling payment status failed", err);
      }
    };

    // Check immediately
    checkPaymentStatus();

    // Then poll every 3 seconds
    pollInterval = setInterval(checkPaymentStatus, 3000);

    // Stop polling after 30 seconds to prevent infinite loops (webhook might have failed)
    const timeout = setTimeout(() => {
      if (mounted && isConfirming) {
        setIsConfirming(false);
        setIsConfirmed(false); // Indicates timeout/pending
        clearInterval(pollInterval);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [isConfirming]);

  return (
    <div className="container mx-auto max-w-lg mt-20 text-center space-y-6 p-8 border rounded-xl bg-card shadow-sm">
      {isConfirming ? (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Confirming Payment...</h1>
          <p className="text-muted-foreground">
            Please wait while we verify your payment with the server. This
            usually takes a few seconds.
          </p>
        </>
      ) : isConfirmed ? (
        <>
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-green-700">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Your rental request is now ACTIVE! You can view the full details on
            your dashboard.
          </p>
          <div className="pt-6">
            <Button size="lg" asChild>
              <Link href="/dashboard/tenant">Go to Dashboard</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-yellow-700">
            Payment Pending
          </h1>
          <p className="text-muted-foreground">
            We are still waiting for confirmation from the payment provider.
            Your dashboard will update automatically once the payment is
            processed.
          </p>
          <div className="pt-6">
            <Button size="lg" asChild>
              <Link href="/dashboard/tenant">Check Dashboard</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
