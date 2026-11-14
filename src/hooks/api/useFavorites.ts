import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { Property } from "@/types";

export function useFavorites(enabled = true) {
  return useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await api.get<Property[]>("/favorites");
      if (!res.ok) throw new Error(res.message);
      return res.data ?? [];
    },
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await api.post(`/favorites/${propertyId}`);
      if (!res.ok) throw new Error(res.message);
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await api.delete(`/favorites/${propertyId}`);
      if (!res.ok) throw new Error(res.message);
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}
