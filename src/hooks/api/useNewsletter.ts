import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export function useNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post<{ id?: string; email?: string }>("/newsletter", { email });
      if (!res.ok) {
        throw new Error(res.message || "Failed to subscribe to newsletter");
      }
      return res;
    },
  });
}
