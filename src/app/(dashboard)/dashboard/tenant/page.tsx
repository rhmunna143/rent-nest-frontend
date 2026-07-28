import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenant Dashboard",
};

export default function TenantDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Your rentals and payments will appear here. (Phase 2)
      </p>
    </div>
  );
}
