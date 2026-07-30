"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalId");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <XCircle className="w-10 h-10" />
      </div>

      <h1 className="text-3xl font-bold text-foreground">Payment Canceled</h1>

      <p className="text-muted-foreground max-w-md mx-auto">
        You've canceled the checkout process. Don't worry, your rental request
        is still approved. You can try paying again whenever you are ready.
      </p>

      <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
        {rentalId ? (
          <Button size="lg" asChild>
            <Link href={`/dashboard/tenant/requests/${rentalId}`}>
              Return to Request
            </Link>
          </Button>
        ) : (
          <Button size="lg" asChild>
            <Link href="/dashboard/tenant">Return to Dashboard</Link>
          </Button>
        )}

        <Button size="lg" variant="outline" asChild>
          <Link href="/properties">
            <ArrowLeft className="w-4 h-4 mr-2" /> Continue Browsing
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow bg-muted/10 flex items-center justify-center py-12">
        <div className="bg-card border rounded-2xl shadow-sm p-8 max-w-2xl w-full mx-4">
          <Suspense
            fallback={
              <div className="flex justify-center p-12">
                <div className="animate-pulse h-8 w-8 bg-muted rounded-full"></div>
              </div>
            }
          >
            <PaymentCancelContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
