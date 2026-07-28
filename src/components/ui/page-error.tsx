"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  message = "Something went wrong. Please try again.",
  onRetry,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" aria-hidden />
      <div className="space-y-1">
        <p className="text-lg font-semibold">Error</p>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
