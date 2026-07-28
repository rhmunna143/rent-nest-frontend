import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a RentNest account as a tenant or landlord.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
