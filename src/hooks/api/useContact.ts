import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiErrorDetail } from "@/types";

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (payload: ContactPayload) => {
      const res = await api.post<{ id?: string; message?: string }>("/contact", payload);
      if (!res.ok) {
        const error = new Error(res.message || "Failed to send message") as Error & {
          errorDetails?: ApiErrorDetail[];
        };
        error.errorDetails = res.errorDetails;
        throw error;
      }
      return res.data;
    },
  });
}
