import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilterBar } from "@/components/properties/PropertyFilterBar";
import { Pagination } from "@/components/ui/pagination-controls";
import { PageHeader } from "@/components/shared/page-header";
import { serverFetch } from "@/lib/server-api";
import type { Category, Property, Paginated } from "@/types";
import type { Metadata } from "next";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Explore Rental Properties | RentNest",
  description:
    "Discover apartments, houses, studios, and condominiums for rent. Filter by location, price, bedroom count, and amenities.",
};

export default async function PropertiesPage(props: PropertiesPageProps) {
  const searchParams = await props.searchParams;

  // Build query string for the backend API
  const params = new URLSearchParams();
  if (!searchParams.limit) {
    params.set("limit", "12");
  }

  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
  }

  // Fetch categories for filter dropdown
  const [categoriesRes, propertiesRes] = await Promise.all([
    serverFetch<Category[]>("/categories", { next: { revalidate: 60, tags: ["categories"] } }),
    serverFetch<Property[]>(`/properties?${params.toString()}`, { cache: "no-store" }),
  ]);

  const categories = categoriesRes.ok ? (categoriesRes.data ?? []) : [];
  const properties = propertiesRes.ok ? (propertiesRes.data ?? []) : [];
  const meta = (propertiesRes.ok && propertiesRes.meta)
    ? propertiesRes.meta
    : {
        page: 1,
        limit: 12,
        total: properties.length,
        totalPages: Math.max(1, Math.ceil(properties.length / 12)),
      };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Explore Properties"
        description="Find verified rental accommodations matching your lifestyle and budget."
      />

      {/* Top Filter Bar with Debounced Search and Mobile Sheet */}
      <PropertyFilterBar categories={categories} />

      {/* Results Header */}
      <div id="results-heading" className="flex items-center justify-between pt-2">
        <p className="text-sm font-semibold text-foreground">
          Showing {properties.length > 0 ? (meta.page - 1) * meta.limit + 1 : 0}–
          {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} properties
        </p>
      </div>

      {/* Main Grid: 4 columns on xl desktop */}
      {properties.length === 0 ? (
        <div className="text-center py-20 border rounded-2xl bg-card/60 border-dashed space-y-3">
          <h3 className="text-lg font-bold">No properties match your criteria</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Try adjusting your search terms, broadening the price range, or clearing active filters.
          </p>
        </div>
      ) : (
        <>
          <div
            id="property-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {properties.map((prop, idx) => (
              <PropertyCard key={prop.id} property={prop} priority={idx < 4} />
            ))}
          </div>

          {/* Numbered Pagination */}
          <Pagination meta={meta} targetId="results-heading" />
        </>
      )}
    </div>
  );
}
