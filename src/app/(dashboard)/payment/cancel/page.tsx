"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-lg mt-20 text-center space-y-6 p-8 border rounded-xl bg-card shadow-sm">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-10 h-10" />
      </div>
      <h1 className="text-2xl font-bold">Payment Cancelled</h1>
      <p className="text-muted-foreground">
        You cancelled the payment process. Your request has not been confirmed
        yet, but you can try again anytime.
      </p>

      <div className="flex gap-4 justify-center pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button asChild>
          <Link href="/dashboard/tenant">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
