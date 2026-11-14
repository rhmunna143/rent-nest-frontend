import { type NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { dashboardFor, isValidRole } from "@/lib/roles";

const BACKEND_ORIGIN =
  process.env.API_ORIGIN ?? "http://localhost:8080";
const JWT_SECRET =
  process.env.JWT_ACCESS_SECRET ??
  "jask-rthtrhijibigjjrlertnu5y785hfgyugwrt6ggfst3r4rtfrdsfgshyreyryrgdy==vvv";

const encodedSecret = new TextEncoder().encode(JWT_SECRET);

// Protected routes and their required role
const ROLE_ROUTES: Record<string, string> = {
  "/dashboard/tenant": "TENANT",
  "/dashboard/landlord": "LANDLORD",
  "/dashboard/admin": "ADMIN",
};

interface TokenVerificationResult {
  userId: string;
  role: string;
}

async function verifyToken(token: string): Promise<TokenVerificationResult | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    if (payload && typeof payload.role === "string" && isValidRole(payload.role)) {
      return {
        userId: String(payload.userId ?? ""),
        role: payload.role,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function attemptServerRefresh(
  request: NextRequest
): Promise<{ result: TokenVerificationResult; setCookieHeaders: string[] } | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  if (!cookieHeader || !request.cookies.has("refreshToken")) {
    return null;
  }

  try {
    const refreshRes = await fetch(`${BACKEND_ORIGIN}/api/auth/refresh-token`, {
      method: "POST",
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });

    if (!refreshRes.ok) return null;

    // Extract set-cookie headers
    const setCookieHeaders = refreshRes.headers.getSetCookie
      ? refreshRes.headers.getSetCookie()
      : [refreshRes.headers.get("set-cookie")].filter(Boolean) as string[];

    // Extract new accessToken from Set-Cookie or verify it
    let newAccessToken: string | null = null;
    for (const cookieStr of setCookieHeaders) {
      const match = cookieStr.match(/accessToken=([^;]+)/);
      if (match) {
        newAccessToken = match[1];
        break;
      }
    }

    if (!newAccessToken) return null;

    const verified = await verifyToken(newAccessToken);
    if (!verified) return null;

    return { result: verified, setCookieHeaders };
  } catch {
    return null;
  }
}

async function proxyFn(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const matchedPrefix = Object.keys(ROLE_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  // If route is /dashboard/account, any authenticated user can access it
  const isAccountRoute = pathname.startsWith("/dashboard/account");

  // Route is not protected - let it through
  if (!matchedPrefix && !isAccountRoute) {
    return NextResponse.next();
  }

  const requiredRole = matchedPrefix ? ROLE_ROUTES[matchedPrefix] : null;

  // 1️⃣ Verify the httpOnly accessToken cookie with jose
  const accessToken = request.cookies.get("accessToken")?.value;
  let authResult: TokenVerificationResult | null = null;
  let newSetCookies: string[] = [];

  if (accessToken) {
    authResult = await verifyToken(accessToken);
  }

  // 2️⃣ If accessToken is expired/invalid, try silent refresh with refreshToken
  if (!authResult && request.cookies.has("refreshToken")) {
    const refreshData = await attemptServerRefresh(request);
    if (refreshData) {
      authResult = refreshData.result;
      newSetCookies = refreshData.setCookieHeaders;
    }
  }

  // 3️⃣ If still not authenticated, redirect to login with safe returnTo
  if (!authResult) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("returnTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4️⃣ Check role authorization: if route requires specific role, verify
  if (requiredRole && authResult.role !== requiredRole) {
    // Redirect to their own role dashboard
    const destination = dashboardFor(authResult.role);
    const redirectRes = NextResponse.redirect(new URL(destination, request.url));
    newSetCookies.forEach((header) => {
      redirectRes.headers.append("set-cookie", header);
    });
    return redirectRes;
  }

  const response = NextResponse.next();
  newSetCookies.forEach((header) => {
    response.headers.append("set-cookie", header);
  });
  return response;
}

export default proxyFn;

export const config = {
  matcher: ["/dashboard/:path*"],
};
