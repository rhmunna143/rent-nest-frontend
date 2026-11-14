"use client";

import * as React from "react";

export default function RootGlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased flex items-center justify-center p-6 text-foreground">
        <div className="max-w-md w-full text-center space-y-4 p-8 border rounded-2xl bg-card shadow-lg">
          <h1 className="text-2xl font-bold tracking-tight text-destructive">Application Error</h1>
          <p className="text-sm text-muted-foreground">
            A critical error interrupted the application.
          </p>
          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Reload Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
