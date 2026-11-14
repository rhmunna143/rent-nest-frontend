import type { UserRole } from "@/types";

export const VALID_ROLES = new Set<string>(["TENANT", "LANDLORD", "ADMIN"]);

export const ROLE_LABELS: Record<UserRole, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Administrator",
};

export function dashboardFor(role?: string | null): string {
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

export function isValidRole(role: unknown): role is UserRole {
  return typeof role === "string" && VALID_ROLES.has(role);
}
