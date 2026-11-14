import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { PublicStats, AdminStats } from "@/types";

export function usePublicStats() {
  return useQuery({
    queryKey: ["stats", "public"],
    queryFn: async () => {
      const res = await api.get<PublicStats>("/stats");
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await api.get<AdminStats>("/admin/stats");
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}
