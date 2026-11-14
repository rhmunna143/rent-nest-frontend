"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 text-center p-6">
      <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Admin System Error</h2>
      <p className="text-sm text-muted-foreground max-w-md">
        {error.message || "Failed to retrieve administrative data. Please check authorization permissions."}
      </p>
      <div className="flex gap-3 mt-2">
        <Button variant="outline" className="rounded-xl" onClick={() => (window.location.href = "/")}>
          Back to Home
        </Button>
        <Button className="rounded-xl" onClick={() => reset()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
