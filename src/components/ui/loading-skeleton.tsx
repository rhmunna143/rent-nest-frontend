import { cn } from "@/lib/cn";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

/** Animated shimmer skeleton for loading states */
export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-md bg-muted",
            className
          )}
        />
      ))}
    </>
  );
}

/** Card skeleton — mimics a property card */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <LoadingSkeleton className="h-48 w-full rounded-lg" />
      <LoadingSkeleton className="h-5 w-3/4" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-6 w-16 rounded-full" />
        <LoadingSkeleton className="h-6 w-20 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-full rounded-md" />
    </div>
  );
}

/** Table row skeleton */
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}
