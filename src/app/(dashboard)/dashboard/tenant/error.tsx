"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function TenantDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <h2 className="text-2xl font-bold tracking-tight">Dashboard Error</h2>
      <p className="text-muted-foreground max-w-md">
        Failed to load your dashboard data. This might be a temporary issue or
        your session may have expired.
      </p>
      <div className="flex gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/auth/login")}
        >
          Login Again
        </Button>
        <Button onClick={() => reset()}>Try Again</Button>
      </div>
    </div>
  );
}
