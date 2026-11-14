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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
          <FloatingActions />
        </Providers>
      </body>
    </html>
  );
}
