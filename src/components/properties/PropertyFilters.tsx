"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

interface PropertyFiltersProps {
  categories: Category[];
}

export function PropertyFilters({ categories }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state for instant typing, syncs to URL on blur/submit
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams],
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`/properties?${createQueryString(name, value)}`);
  };

  const clearFilters = () => {
    router.push("/properties");
    setSearch("");
    setLocation("");
  };

  const currentCategory = searchParams.get("categoryId") || "";
  const currentBedrooms = searchParams.get("bedrooms") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Property title..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={(e) => updateFilter("search", e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && updateFilter("search", search)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, area..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onBlur={(e) => updateFilter("location", e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && updateFilter("location", location)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={currentCategory}
          onChange={(e) => updateFilter("categoryId", e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="minPrice">Min Price</Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="$0"
            value={currentMinPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price</Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder="$any"
            value={currentMaxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bedrooms">Bedrooms</Label>
        <select
          id="bedrooms"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={currentBedrooms}
          onChange={(e) => updateFilter("bedrooms", e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
