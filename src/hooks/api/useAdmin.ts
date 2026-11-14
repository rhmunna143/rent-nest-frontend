import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  User,
  Property,
  RentalRequest,
  Payment,
  ContactMessage,
  NewsletterSubscriber,
  UserRole,
  UserStatus,
  ContactStatus,
} from "@/types";

export function useAdminUsers(
  params: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.role) queryParams.set("role", params.role);
  if (params.status) queryParams.set("status", params.status);
  if (params.search) queryParams.set("search", params.search);

  const qs = queryParams.toString();
  const endpoint = `/admin/users${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const res = await api.get<User[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: { status?: UserStatus; role?: UserRole };
    }) => {
      const res = await api.patch<User>(`/admin/users/${userId}`, data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ userId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "users"] });
      const previous = queryClient.getQueriesData({
        queryKey: ["admin", "users"],
      });

      queryClient.setQueriesData(
        { queryKey: ["admin", "users"] },
        (old: { data?: User[]; meta?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((u) =>
              u.id === userId ? { ...u, ...data } : u
            ),
          };
        }
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAdminProperties(
  params: { page?: number; limit?: number; search?: string } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.search) queryParams.set("search", params.search);

  const qs = queryParams.toString();
  const endpoint = `/admin/properties${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "properties", params],
    queryFn: async () => {
      const res = await api.get<Property[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useModerateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      propertyId,
      data,
    }: {
      propertyId: string;
      data: Partial<Property>;
    }) => {
      const res = await api.patch<Property>(`/admin/properties/${propertyId}`, data);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useAdminDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await api.delete(`/admin/properties/${propertyId}`);
      if (!res.ok) throw new Error(res.message);
      return propertyId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useAdminRentals(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/admin/rentals${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "rentals", params],
    queryFn: async () => {
      const res = await api.get<RentalRequest[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useAdminPayments(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/admin/payments${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "payments", params],
    queryFn: async () => {
      const res = await api.get<Payment[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useAdminContacts(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/admin/contact${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "contact", params],
    queryFn: async () => {
      const res = await api.get<ContactMessage[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      status,
    }: {
      contactId: string;
      status: ContactStatus;
    }) => {
      const res = await api.patch<ContactMessage>(`/admin/contact/${contactId}`, {
        status,
      });
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "contact"] });
    },
  });
}

export function useAdminNewsletters(
  params: { page?: number; limit?: number } = {}
) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));

  const qs = queryParams.toString();
  const endpoint = `/admin/newsletter${qs ? `?${qs}` : ""}`;

  return useQuery({
    queryKey: ["admin", "newsletter", params],
    queryFn: async () => {
      const res = await api.get<NewsletterSubscriber[]>(endpoint);
      if (!res.ok) throw new Error(res.message);
      return { data: res.data ?? [], meta: res.meta };
    },
  });
}
