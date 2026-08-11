import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { SortControl } from "@/components/properties/SortControl";
import { Pagination } from "@/components/ui/pagination-controls";
import type { Category, Property } from "@/types";

interface PropertiesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const dynamic = "force-dynamic";

export default async function PropertiesPage(props: PropertiesPageProps) {
  const searchParams = await props.searchParams;
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

  // Build query string from searchParams
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
  }

  // Fetch Categories for Sidebar
  let categories: Category[] = [];
  try {
    const catRes = await fetch(`${BASE_URL}/categories`, { cache: "no-store" });
    const catData = await catRes.json();
    if (catData.success) {
      categories = catData.data;
    }
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }

  // Fetch Properties
  let properties: Property[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
  try {
    const propRes = await fetch(`${BASE_URL}/properties?${params.toString()}`, {
      cache: "no-store",
    });
    const propData = await propRes.json();
    if (propData.success) {
      properties = propData.data;
      
      // Fallback local filtering in case the mock API doesn't support these advanced filters
      const minPrice = Number(searchParams.minPrice) || 0;
      const maxPrice = Number(searchParams.maxPrice) || Infinity;
      const status = searchParams.status as string;
      const categoryId = searchParams.categoryId as string;
      const search = searchParams.search as string;

      properties = properties.filter((p) => {
        let match = true;
        if (p.rentAmount < minPrice || p.rentAmount > maxPrice) match = false;
        if (status && p.status !== status) match = false;
        if (categoryId && p.categoryId !== categoryId) match = false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) match = false;
        return match;
      });

      if (propData.meta) {
        meta = propData.meta;
        // Adjust meta total to reflect local filtering
        meta.total = properties.length;
        meta.totalPages = Math.ceil(meta.total / meta.limit);
      }
    }
  } catch (error) {
    console.error("Failed to fetch properties", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Properties</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <PropertyFilters categories={categories} />
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {meta.total} {meta.total === 1 ? "Result" : "Results"}
            </h2>
            <SortControl />
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-24 border rounded-lg bg-muted/20 border-dashed">
              <h3 className="text-xl font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
              <Pagination meta={meta} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
