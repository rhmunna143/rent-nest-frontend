import type { ApiResult, PaginationMeta } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

// ─── Helpers ────────────────────────────────────────────────

/** Normalize the backend's success/error envelope into ApiResult<T> */
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
    return { ok: false, message: "Unexpected response shape", status: res.status };
  }

  const envelope = body as Record<string, unknown>;

  if (envelope.success === true) {
    return {
      ok: true,
      data: envelope.data as T,
      meta: envelope.meta as PaginationMeta | undefined,
      message: String(envelope.message ?? ""),
    };
  }

  return {
    ok: false,
    message: String(envelope.message ?? "Something went wrong"),
    errorDetails: envelope.errorDetails as { field?: string; message: string }[] | undefined,
    status: res.status,
  };
}

// ─── Silent token refresh ─────────────────────────────────

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

// ─── Core fetch wrapper ───────────────────────────────────

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** If true, skip the 401 → refresh → retry flow (used internally to avoid loops) */
  _isRetry?: boolean;
  /**
   * If true, a 401 response will NOT trigger a redirect to /auth/login.
   * Use this for "silent" auth checks where an unauthenticated response is expected.
   */
  skipAuthRedirect?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  const { body, _isRetry = false, skipAuthRedirect = false, headers: extraHeaders, ...rest } = options;

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

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, fetchOptions);
  } catch {
    return { ok: false, message: "Network error — could not reach the server", status: 0 };
  }

  // 401 → try refresh → retry once
  if (res.status === 401 && !_isRetry) {
    // If caller opted out of redirects, just return the error (e.g. bootstrap auth check)
    if (skipAuthRedirect) {
      return { ok: false, message: "Unauthenticated", status: 401 };
    }
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, _isRetry: true });
    }
    // Refresh failed → redirect to login (client-side only)
    // Guard: never redirect if we're already on an auth page (prevents redirect loops)
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/auth/")) {
        const returnTo = encodeURIComponent(currentPath + window.location.search);
        window.location.href = `/auth/login?returnTo=${returnTo}`;
      }
    }
    return { ok: false, message: "Session expired. Please log in again.", status: 401 };
  }

  return parseResponse<T>(res);
}

// ─── Convenience helpers ──────────────────────────────────

export const api = {
  get: <T>(path: string, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, body?: unknown, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "POST", body }),

  patch: <T>(path: string, body?: unknown, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "PATCH", body }),

  put: <T>(path: string, body?: unknown, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "PUT", body }),

  delete: <T>(path: string, init?: Omit<FetchOptions, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};
