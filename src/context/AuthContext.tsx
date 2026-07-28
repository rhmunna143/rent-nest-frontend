"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { api } from "@/lib/api-client";
import type { User } from "@/types";

// ─── Types ──────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  /** Refresh the user from the server (call after login / profile update) */
  refreshUser: () => Promise<void>;
  /** Clear local user state (call after logout) */
  clearUser: () => void;
}

// ─── Context ─────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // skipAuthRedirect: a 401 here means "not logged in" — don't redirect to login
    const result = await api.get<User>("/auth/me", { skipAuthRedirect: true });
    if (result.ok) {
      setUser(result.data);
      document.cookie = `rn_role=${result.data.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
    } else {
      setUser(null);
      document.cookie = "rn_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    document.cookie = "rn_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  // Bootstrap: attempt to load the current user on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      // skipAuthRedirect: a 401 here means "not logged in" — perfectly normal for public pages
      const result = await api.get<User>("/auth/me", { skipAuthRedirect: true });
      if (!cancelled) {
        if (result.ok) {
          setUser(result.data);
          document.cookie = `rn_role=${result.data.role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        } else {
          setUser(null);
          document.cookie = "rn_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
