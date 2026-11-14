import { env } from "@/lib/env";
import type { ApiResult, PaginationMeta } from "@/types";

const BASE_URL = env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "");

// ─── Number Normalizer ──────────────────────────────────────
const NUMBER_FIELDS = new Set([
  "rentAmount",
  "amount",
  "averageRating",
  "rating",
  "price",
  "totalRevenue",
  "totalAmount",
  "earnings",
  "revenue",
  "total",
  "count",
  "bedrooms",
  "bathrooms",
]);

function normalizeNumbers<T>(data: T): T {
  if (data === null || data === undefined) return data;

  if (Array.isArray(data)) {
    return data.map((item) => normalizeNumbers(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const copy: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (typeof val === "string" && NUMBER_FIELDS.has(key) && val.trim() !== "") {
        const num = Number(val);
        copy[key] = isNaN(num) ? val : num;
      } else if (typeof val === "object" && val !== null) {
        copy[key] = normalizeNumbers(val);
      } else {
        copy[key] = val;
      }
    }
    return copy as T;
  }

  return data;
}

// ─── Helpers ────────────────────────────────────────────────

async function parseResponse<T>(res: Response): Promise<ApiResult<T>> {
  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return {
      ok: false,
      message: "Invalid response from server",
      status: res.status,
    };
  }

  if (typeof body !== "object" || body === null) {
    return {
      ok: false,
      message: "Unexpected response shape",
      status: res.status,
    };
  }

  const envelope = body as Record<string, unknown>;

  if (envelope.success === true) {
    const rawData = envelope.data as T;
    const normalizedData = normalizeNumbers(rawData);

    return {
      ok: true,
      data: normalizedData,
      meta: envelope.meta as PaginationMeta | undefined,
      message: String(envelope.message ?? ""),
    };
  }

  return {
    ok: false,
    message: String(envelope.message ?? "Something went wrong"),
    errorDetails: envelope.errorDetails as
      | { field?: string; message: string }[]
      | undefined,
    status: res.status,
  };
}

// ─── Silent Token Refresh ───────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ─── Core Fetch Wrapper ─────────────────────────────────────

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** If true, skip the 401 → refresh → retry flow (used internally to avoid loops) */
  _isRetry?: boolean;
  /**
   * If true, a 401 response (after refresh fails) will NOT trigger a redirect to /auth/login.
   * Use this for "silent" auth checks where an unauthenticated response is expected.
   */
  skipAuthRedirect?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  const {
    body,
    _isRetry = false,
    skipAuthRedirect = false,
    headers: extraHeaders,
    ...rest
  } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string> | undefined),
  };

  const fetchOptions: RequestInit = {
    ...rest,
    credentials: "include",
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
  } catch {
    return {
      ok: false,
      message: "Network error — could not reach the server",
      status: 0,
    };
  }

  // 401 → fix S2: ALWAYS try refresh once before deciding to redirect or return
  if (res.status === 401 && !_isRetry) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, _isRetry: true });
    }

    // Refresh failed:
    if (skipAuthRedirect) {
      return { ok: false, message: "Unauthenticated", status: 401 };
    }

    // Refresh failed and auth is required → redirect to login (client-side only)
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/")) {
        const returnTo = encodeURIComponent(
          currentPath + window.location.search
        );
        window.location.href = `/auth/login?returnTo=${returnTo}`;
      }
    }

    return {
      ok: false,
      message: "Session expired. Please log in again.",
      status: 401,
    };
  }

  return parseResponse<T>(res);
}

// ─── Convenience Helpers ────────────────────────────────────

export const api = {
  get: <T>(path: string, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "GET" }),

  post: <T>(
    path: string,
    body?: unknown,
    init?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...init, method: "POST", body }),

  patch: <T>(
    path: string,
    body?: unknown,
    init?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...init, method: "PATCH", body }),

  put: <T>(
    path: string,
    body?: unknown,
    init?: Omit<FetchOptions, "method" | "body">
  ) => apiFetch<T>(path, { ...init, method: "PUT", body }),

  delete: <T>(path: string, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};
