import { type NextRequest, NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

// Route ---> required role map

const ROLE_ROUTES: Record<string, string> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
};

function dashboardFor(role: string): string {
  switch (role) {
    case "TENANT":
      return "/dashboard/tenant";
    case "LANDLORD":
      return "/dashboard/landlord";
    case "ADMIN":
      return "/dashboard/admin";
    default:
      return "/";
  }
}

// Fast path: read rn_role cookie 
//
// After login/register the client sets a lightweight readable cookie
// `rn_role` so the proxy can determine the user's role without making
// a network round-trip to the backend on every navigation.
// The JWT httpOnly cookies still protect actual data - the backend
// validates the token on every API call regardless.

const VALID_ROLES = new Set(["TENANT", "LANDLORD", "ADMIN"]);

function readRoleCookie(request: NextRequest): string | null {
  const role = request.cookies.get("rn_role")?.value;
  return role && VALID_ROLES.has(role) ? role : null;
}

// Slow path: ask the backend (fallback only)
//
// Used only when `rn_role` is absent but JWT cookies are present
// (e.g. old session from before this cookie was introduced, or
// the cookie was cleared manually).

async function fetchRoleFromBackend(
  request: NextRequest,
): Promise<string | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  if (!cookieHeader) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (res.status === 401) {
      // Attempt a silent refresh
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });
      if (!refreshRes.ok) return null;

      // Retry /auth/me after refresh
      const retryRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { cookie: cookieHeader },
        cache: "no-store",
      });
      if (!retryRes.ok) return null;
      const body = await retryRes.json();
      return (body as { data?: { role?: string } }).data?.role ?? null;
    }

    if (!res.ok) return null;
    const body = await res.json();
    return (body as { data?: { role?: string } }).data?.role ?? null;
  } catch {
    return null;
  }
}

// Proxy 

async function proxyFn(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix),
  );

  // Route is not protected - let it through
  if (!matchedPrefix) return NextResponse.next();

  const requiredRole = ROLE_ROUTES[matchedPrefix];

  // 1️⃣  Fast path - rn_role cookie (set by client after login)
  let userRole = readRoleCookie(request);

  // 2️⃣  Slow path - backend call (only if JWT cookies present but rn_role is missing)
  if (!userRole) {
    const hasJwt =
      request.cookies.has("accessToken") || request.cookies.has("refreshToken");
    if (hasJwt) {
      userRole = await fetchRoleFromBackend(request);
    }
  }

  // Not authenticated - redirect to login
  if (!userRole) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Wrong role - redirect to their own dashboard
  if (userRole !== requiredRole) {
    return NextResponse.redirect(new URL(dashboardFor(userRole), request.url));
  }

  return NextResponse.next();
}

export default proxyFn;

export const config = {
  matcher: ["/dashboard/:path*"],
};
