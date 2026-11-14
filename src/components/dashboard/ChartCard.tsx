"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export const DynamicResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  {
    ssr: false,
    loading: () => <div className="h-full w-full animate-pulse bg-muted/40 rounded-xl" />,
  }
);

interface ChartCardProps {
  title: string;
  description?: string;
  className?: string;
  hasData?: boolean;
  emptyMessage?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  className,
  hasData = true,
  emptyMessage = "No historical data available to plot.",
  actions,
  children,
}: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden rounded-xl border bg-card shadow-xs flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-bold tracking-tight">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-xs text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </CardHeader>

      <CardContent className="flex-1 pb-6">
        {hasData ? (
          children
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl bg-muted/20">
            <BarChart3 className="h-10 w-10 text-muted-foreground opacity-40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
