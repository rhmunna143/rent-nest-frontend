"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function GlobalAppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-md mb-6 leading-relaxed">
        {error.message || "An unexpected error occurred while processing your request. Please try again."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => reset()} className="rounded-xl">
          <RotateCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
