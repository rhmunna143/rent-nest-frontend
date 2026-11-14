"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showBrowseProperties?: boolean;
}

export function PageError({
  title = "Something went wrong",
  message = "We encountered an issue loading this information. Please retry or browse available properties.",
  onRetry,
  showBrowseProperties = true,
}: PageErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="h-7 w-7" aria-hidden />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{message}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {onRetry && (
          <Button variant="default" onClick={onRetry} className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
        {showBrowseProperties && (
          <Button variant="outline" asChild className="rounded-xl">
            <Link href="/properties">
              <Home className="w-4 h-4 mr-2" />
              Browse Properties
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
