import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  withImage?: boolean;
}

export function CardSkeleton({ withImage = true, className, ...props }: CardSkeletonProps) {
  return (
    <Card className={cn("h-full flex flex-col overflow-hidden rounded-xl bg-card border-border/80 shadow-xs", className)} {...props}>
      {withImage && (
        <div className="relative aspect-video w-full bg-muted overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      )}
      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-5 w-3/5 rounded-md" />
            <Skeleton className="h-5 w-1/4 rounded-md" />
          </div>
          <Skeleton className="h-3.5 w-2/5 rounded-md" />
          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-3.5 w-full rounded-md" />
            <Skeleton className="h-3.5 w-4/5 rounded-md" />
          </div>
        </div>
        <div className="pt-2 border-t flex items-center justify-between">
          <div className="flex gap-3">
            <Skeleton className="h-3.5 w-12 rounded-md" />
            <Skeleton className="h-3.5 w-12 rounded-md" />
          </div>
          <Skeleton className="h-4 w-14 rounded-full" />
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0">
        <Skeleton className="h-9 w-full rounded-xl" />
      </CardFooter>
    </Card>
  );
}
