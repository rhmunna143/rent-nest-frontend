import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Payment } from "@/types";

export function usePayments(params: { page?: number; limit?: number } = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/payments${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["payments", params],
    queryFn: async () => {
      const res = await api.get<Payment[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async (data: { rentalRequestId: string }) => {
      const res = await api.post<{ checkoutUrl: string; paymentId: string }>(
        "/payments/create",
        data
      );
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useSyncPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { sessionId?: string; rentalRequestId?: string }) => {
      const res = await api.post<{ status: string; payment: Payment }>(
        "/payments/sync",
        data
      );
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });
}
