"use client";

import { PageError } from "@/components/ui/page-error";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <PageError
        title="Could not load properties"
        message="We encountered an error while trying to fetch property listings. Please retry or return later."
        onRetry={() => reset()}
      />
    </div>
  );
}
