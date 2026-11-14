import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Property, PaginationMeta } from "@/types";

export interface PropertyFilterParams {
  search?: string;
  location?: string;
  categoryId?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  amenities?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export function useProperties(params: PropertyFilterParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.location) queryParams.set("location", params.location);
  if (params.categoryId) queryParams.set("categoryId", params.categoryId);
  if (params.minPrice) queryParams.set("minPrice", String(params.minPrice));
  if (params.maxPrice) queryParams.set("maxPrice", String(params.maxPrice));
  if (params.bedrooms) queryParams.set("bedrooms", String(params.bedrooms));
  if (params.bathrooms) queryParams.set("bathrooms", String(params.bathrooms));
  if (params.amenities) queryParams.set("amenities", params.amenities);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const queryString = queryParams.toString();
  const endpoint = `/properties${queryString ? `?${queryString}` : ""}`;

  return useQuery({
    queryKey: ["properties", params],
    queryFn: async () => {
      const res = await api.get<Property[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
    staleTime: 60 * 1000,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await api.get<Property>(`/properties/${id}`);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useFeaturedProperties(limit = 4) {
  return useQuery({
    queryKey: ["properties", "featured", limit],
    queryFn: async () => {
      const res = await api.get<Property[]>(`/properties/featured?limit=${limit}`);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
