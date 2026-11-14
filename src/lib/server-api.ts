import { env } from "@/lib/env";
import type { ApiResult, PaginationMeta } from "@/types";

const BASE_URL = env.API_ORIGIN
  ? `${env.API_ORIGIN.replace(/\/$/, "")}/api`
  : env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    let body: unknown;
    try {
      body = await res.json();
    } catch {
      return {
        ok: false,
        message: `Invalid JSON response (status ${res.status})`,
        status: res.status,
      };
    }

    if (typeof body !== "object" || body === null) {
      return {
        ok: false,
        message: "Malformed response shape",
        status: res.status,
      };
    }

    const envelope = body as Record<string, unknown>;

    if (res.ok && envelope.success === true) {
      return {
        ok: true,
        data: envelope.data as T,
        meta: envelope.meta as PaginationMeta | undefined,
        message: String(envelope.message ?? ""),
      };
    }

    return {
      ok: false,
      message: String(envelope.message ?? "Server request failed"),
      status: res.status,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Network error",
      status: 0,
    };
  }
}
