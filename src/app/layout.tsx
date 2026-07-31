import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { FloatingActions } from "@/components/layout/FloatingActions";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RentNest | Find & List Rental Properties",
    template: "%s | RentNest",
  },
  description:
    "Browse, list, and manage rental properties with ease. RentNest connects tenants and landlords on a seamless marketplace.",
  keywords: ["rental", "property", "rent", "apartment", "landlord", "tenant"],
  openGraph: {
    type: "website",
    siteName: "RentNest",
    title: "RentNest | Find & List Rental Properties",
    description: "Browse, list, and manage rental properties with ease.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
