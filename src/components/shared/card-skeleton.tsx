import * as React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

export interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  withImage?: boolean;
}

export function CardSkeleton({ withImage = true, className, ...props }: CardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden flex flex-col", className)} {...props}>
      {withImage && (
        <div className="aspect-video w-full bg-muted overflow-hidden">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
      )}
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-6 pt-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </CardFooter>
    </Card>
  );
}
