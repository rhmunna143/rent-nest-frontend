import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { RentalRequest } from "@/types";

export function useRentals(params: { page?: number; limit?: number } = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/rentals${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["rentals", params],
    queryFn: async () => {
      const res = await api.get<RentalRequest[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: ["rental", id],
    queryFn: async () => {
      const res = await api.get<RentalRequest>(`/rentals/${id}`);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateRentalRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      propertyId: string;
      moveInDate?: string;
      message?: string;
    }) => {
      const res = await api.post<RentalRequest>("/rental-requests", data);
      if (!res.ok) {
        const error = new Error(res.message) as Error & {
          status?: number;
          errorDetails?: typeof res.errorDetails;
        };
        error.status = res.status;
        error.errorDetails = res.errorDetails;
        throw error;
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}
