import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landlord Dashboard",
};

export default function LandlordDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Your properties and rental requests will appear here. (Phase 4)
      </p>
    </div>
  );
}
