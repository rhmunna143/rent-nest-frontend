"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  RotateCcw,
  DollarSign,
  BedDouble,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/useDebounce";
import type { Category } from "@/types";

const COMMON_AMENITIES = [
  "Wi-Fi",
  "Parking",
  "Air Conditioning",
  "Gym",
  "Pool",
  "Balcony",
  "Pet Friendly",
  "Furnished",
  "Elevator",
  "Security",
];

interface PropertyFilterBarProps {
  categories: Category[];
}

export function PropertyFilterBar({ categories }: PropertyFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL State values
  const urlSearch = searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlCategory = searchParams.get("categoryId") || "";
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";
  const urlBedrooms = searchParams.get("bedrooms") || "";
  const urlAmenities = searchParams.getAll("amenities");
  const urlSortBy = searchParams.get("sortBy") || "createdAt";
  const urlSortOrder = searchParams.get("sortOrder") || "desc";

  // Local state for debounced text inputs
  const [searchValue, setSearchValue] = React.useState(urlSearch);
  const [locationValue, setLocationValue] = React.useState(urlLocation);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const debouncedSearch = useDebounce(searchValue, 400);
  const debouncedLocation = useDebounce(locationValue, 400);

  // Sync state if URL changes externally
  React.useEffect(() => {
    setSearchValue(urlSearch);
  }, [urlSearch]);

  React.useEffect(() => {
    setLocationValue(urlLocation);
  }, [urlLocation]);

  // Update URL helper
  const updateQuery = React.useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // Reset page on filter change

      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          params.delete(key);
        } else if (Array.isArray(val)) {
          params.delete(key);
          val.forEach((item) => params.append(key, item));
        } else {
          params.set(key, val);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  // Trigger search update on debounce
  React.useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateQuery({ search: debouncedSearch || null });
    }
  }, [debouncedSearch, urlSearch, updateQuery]);

  // Trigger location update on debounce
  React.useEffect(() => {
    if (debouncedLocation !== urlLocation) {
      updateQuery({ location: debouncedLocation || null });
    }
  }, [debouncedLocation, urlLocation, updateQuery]);

  const handleClearAll = () => {
    setSearchValue("");
    setLocationValue("");
    router.push(pathname);
    setMobileOpen(false);
  };

  const handleToggleAmenity = (amenity: string) => {
    const next = urlAmenities.includes(amenity)
      ? urlAmenities.filter((a) => a !== amenity)
      : [...urlAmenities, amenity];
    updateQuery({ amenities: next });
  };

  // Determine active filters
  const activeFiltersCount =
    (urlSearch ? 1 : 0) +
    (urlLocation ? 1 : 0) +
    (urlCategory ? 1 : 0) +
    (urlMinPrice ? 1 : 0) +
    (urlMaxPrice ? 1 : 0) +
    (urlBedrooms ? 1 : 0) +
    urlAmenities.length;

  const currentCategoryName = categories.find((c) => c.id === urlCategory)?.name;

  return (
    <div className="space-y-4 mb-8">
      {/* Top Filter Bar */}
      <div className="rounded-2xl border bg-card p-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          {/* Search Input (4 cols on lg) */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, features..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background border-input"
            />
          </div>

          {/* Location Input (3 cols on lg) */}
          <div className="lg:col-span-3 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="City, area, zip..."
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background border-input"
            />
          </div>

          {/* Category Select (2 cols on lg) */}
          <div className="lg:col-span-2">
            <select
              value={urlCategory}
              onChange={(e) => updateQuery({ categoryId: e.target.value || null })}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat._count?.properties ?? 0})
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms Select (1 col on lg) */}
          <div className="lg:col-span-1">
            <select
              value={urlBedrooms}
              onChange={(e) => updateQuery({ bedrooms: e.target.value || null })}
              className="w-full h-10 rounded-xl border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">Beds</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>
          </div>

          {/* Sort Select (2 cols on lg) */}
          <div className="lg:col-span-2 flex items-center gap-2">
            <select
              value={`${urlSortBy}-${urlSortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                updateQuery({ sortBy, sortOrder });
              }}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="rentAmount-asc">Price: Low to High</option>
              <option value="rentAmount-desc">Price: High to Low</option>
            </select>

            {/* Mobile Sheet Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden shrink-0 h-10 w-10 rounded-xl relative"
                  aria-label="Open filter settings"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left font-bold text-lg">Filter Properties</SheetTitle>
                </SheetHeader>

                <div className="py-6 space-y-6">
                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Monthly Rent Budget
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Min $"
                        value={urlMinPrice}
                        onChange={(e) => updateQuery({ minPrice: e.target.value || null })}
                        className="rounded-xl"
                      />
                      <Input
                        type="number"
                        placeholder="Max $"
                        value={urlMaxPrice}
                        onChange={(e) => updateQuery({ maxPrice: e.target.value || null })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amenities
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMON_AMENITIES.map((amenity) => {
                        const isSelected = urlAmenities.includes(amenity);
                        return (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => handleToggleAmenity(amenity)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-accent"
                            }`}
                          >
                            {amenity}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <SheetFooter className="flex flex-col gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleClearAll}
                    className="w-full rounded-xl"
                  >
                    Clear All Filters
                  </Button>
                  <Button
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl"
                  >
                    View Results
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filter Chips & Clear All */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted-foreground font-medium">Active filters:</span>

          {urlSearch && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              Search: "{urlSearch}"
              <button
                type="button"
                onClick={() => {
                  setSearchValue("");
                  updateQuery({ search: null });
                }}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {urlLocation && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              Location: "{urlLocation}"
              <button
                type="button"
                onClick={() => {
                  setLocationValue("");
                  updateQuery({ location: null });
                }}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {currentCategoryName && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              Category: {currentCategoryName}
              <button
                type="button"
                onClick={() => updateQuery({ categoryId: null })}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {urlBedrooms && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              {urlBedrooms}+ Bedrooms
              <button
                type="button"
                onClick={() => updateQuery({ bedrooms: null })}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {(urlMinPrice || urlMaxPrice) && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full">
              Price: ${urlMinPrice || "0"} - ${urlMaxPrice || "any"}
              <button
                type="button"
                onClick={() => updateQuery({ minPrice: null, maxPrice: null })}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {urlAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full"
            >
              {amenity}
              <button
                type="button"
                onClick={() => handleToggleAmenity(amenity)}
                className="hover:text-primary/70"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 text-xs rounded-full px-2.5 text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
