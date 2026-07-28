import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your RentNest profile and account preferences.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
