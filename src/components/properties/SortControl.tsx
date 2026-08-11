"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function SortControl() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // We combine sortBy and sortOrder into a single value for the select dropdown
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";
  const currentValue = `${currentSortBy}-${currentSortOrder}`;

  const handleSortChange = useCallback(
    (value: string) => {
      const [sortBy, sortOrder] = value.split("-");
      const params = new URLSearchParams(searchParams.toString());
      
      if (sortBy) params.set("sortBy", sortBy);
      if (sortOrder) params.set("sortOrder", sortOrder);
      
      // Reset to page 1 when sorting changes
      params.delete("page");
      
      router.push(`/properties?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
      <select
        className="flex h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        value={currentValue}
        onChange={(e) => handleSortChange(e.target.value)}
      >
        <option value="createdAt-desc">Newest Listings</option>
        <option value="createdAt-asc">Oldest Listings</option>
        <option value="rentAmount-asc">Price: Low to High</option>
        <option value="rentAmount-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
