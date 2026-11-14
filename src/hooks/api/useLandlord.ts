import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  Property,
  RentalRequest,
  Payment,
  LandlordStats,
  RentalStatus,
  PropertyStatus,
} from "@/types";

export function useLandlordProperties(
  params: { page?: number; limit?: number; status?: PropertyStatus } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.status) queryParams.set("status", params.status);

  const qs = queryParams.toString();
  const endpoint = `/landlord/properties${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["landlord", "properties", params],
    queryFn: async () => {
      const res = await api.get<Property[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useLandlordRequests(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/landlord/requests${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["landlord", "requests", params],
    queryFn: async () => {
      const res = await api.get<RentalRequest[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useLandlordPayments(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/landlord/payments${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["landlord", "payments", params],
    queryFn: async () => {
      const res = await api.get<Payment[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useLandlordStats() {
  return useQuery({
    queryKey: ["landlord", "stats"],
    queryFn: async () => {
      const res = await api.get<LandlordStats>("/landlord/stats");
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useUpdateLandlordRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: {
      requestId: string;
      status: RentalStatus;
    }) => {
      const res = await api.patch<RentalRequest>(
        `/landlord/requests/${requestId}`,
        { status }
      );
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ requestId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["landlord", "requests"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["landlord", "requests"],
      });

      queryClient.setQueriesData(
        { queryKey: ["landlord", "requests"] },
        (old: { data?: RentalRequest[]; meta?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((req) =>
              req.id === requestId ? { ...req, status } : req
            ),
          };
        }
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "requests"] });
      queryClient.invalidateQueries({ queryKey: ["landlord", "stats"] });
    },
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Property>) => {
      const res = await api.post<Property>("/landlord/properties", data);
      if (!res.ok) {
        const error = new Error(res.message) as Error & {
          errorDetails?: typeof res.errorDetails;
        };
        error.errorDetails = res.errorDetails;
        throw error;
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Property>;
    }) => {
      const res = await api.put<Property>(`/landlord/properties/${id}`, data);
      if (!res.ok) {
        const error = new Error(res.message) as Error & {
          errorDetails?: typeof res.errorDetails;
        };
        error.errorDetails = res.errorDetails;
        throw error;
      }
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/landlord/properties/${id}`);
      if (!res.ok) throw new Error(res.message);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
