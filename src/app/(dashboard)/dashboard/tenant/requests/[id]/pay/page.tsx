"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentInitiationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initPayment() {
      try {
        const res = await api.post<{ checkoutUrl: string }>(
          "/payments/create",
          { 
            rentalRequestId: id,
            successUrl: `${window.location.origin}/payment/success?rentalId=${id}`,
            cancelUrl: `${window.location.origin}/payment/cancel?rentalId=${id}`
          },
        );

        if (!mounted) return;

        if (res.ok) {
          if (res.data?.checkoutUrl) {
            window.location.href = res.data.checkoutUrl;
          } else {
            setError("Invalid response: missing checkout URL.");
            toast.error("Invalid response from server");
          }
        } else {
          if (res.status === 409) {
            setError("This request has already been paid for.");
          } else {
            setError(
              res.message || "Failed to initiate payment. Please try again.",
            );
          }
          toast.error(res.message || "Payment initiation failed");
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "An unexpected error occurred.");
          toast.error("An unexpected error occurred.");
        }
      }
    }

    initPayment();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="container mx-auto max-w-lg mt-20 text-center space-y-6 p-8 border rounded-xl bg-card shadow-sm">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Payment Error</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button asChild className="mt-4">
          <Link href={`/dashboard/tenant/requests/${id}`}>
            Return to Request
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg mt-32 text-center space-y-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      <h1 className="text-2xl font-bold">Redirecting to Secure Checkout...</h1>
      <p className="text-muted-foreground">
        Please wait while we prepare your payment session.
      </p>
    </div>
  );
}
