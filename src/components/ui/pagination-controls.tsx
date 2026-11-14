"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
  targetId?: string;
}

export function Pagination({ meta, targetId = "results-heading" }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!meta || meta.totalPages <= 1) return null;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageClick = (pageNumber: number) => {
    router.push(createPageURL(pageNumber));
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Generate numbered pages array
  const total = meta.totalPages;
  const current = meta.page;
  const pages: (number | "dots")[] = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("dots");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push("dots");
    pages.push(total);
  }

  return (
    <nav
      className="flex items-center justify-center gap-1.5 mt-10"
      aria-label="Pagination Navigation"
    >
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-xl"
        disabled={current <= 1}
        onClick={() => handlePageClick(current - 1)}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Numbered pages */}
      {pages.map((p, idx) => {
        if (p === "dots") {
          return (
            <span
              key={`dots-${idx}`}
              className="h-9 w-9 flex items-center justify-center text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          );
        }

        const isCurrent = p === current;
        return (
          <Button
            key={p}
            variant={isCurrent ? "default" : "outline"}
            size="icon"
            className="h-9 w-9 rounded-xl text-xs font-semibold"
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => handlePageClick(p)}
          >
            {p}
          </Button>
        );
      })}

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-xl"
        disabled={current >= total}
        onClick={() => handlePageClick(current + 1)}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
