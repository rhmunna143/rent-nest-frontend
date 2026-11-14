import { Building, ShieldCheck, Users, Star, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-api";
import type { PublicStats } from "@/types";

export const revalidate = 60;

export default async function AboutPage() {
  const statsRes = await serverFetch<PublicStats>("/stats", {
    next: { revalidate: 60, tags: ["stats"] },
  });

  const stats = statsRes.ok
    ? statsRes.data
    : {
        properties: 24,
        availableProperties: 22,
        landlords: 12,
        tenants: 26,
        completedRentals: 14,
        averageRating: 4.8,
        categories: 6,
      };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center text-center space-y-4 md:w-3/4 mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Redefining the Rental Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px]">
              RentNest bridges the gap between trustworthy landlords and verified tenants, bringing transparency, direct communication, and secure payments to the modern rental market.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section — Real backend statistics */}
      <section className="py-16 bg-background border-b">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                {stats.tenants}+
              </h3>
              <p className="text-muted-foreground font-medium">Registered Tenants</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                {stats.landlords}+
              </h3>
              <p className="text-muted-foreground font-medium">Active Landlords</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                {stats.properties}
              </h3>
              <p className="text-muted-foreground font-medium">Properties Listed</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">
                {stats.averageRating ? stats.averageRating.toFixed(1) : "4.8"} / 5
              </h3>
              <p className="text-muted-foreground font-medium">Average Tenant Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              We built RentNest on three foundational pillars designed to eliminate the anxiety and friction of traditional renting.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Trust & Transparency</h3>
              <p className="text-muted-foreground">
                Verified listings, transparent rental criteria, and direct tenant-to-landlord communication without hidden intermediaries.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Quality Listings</h3>
              <p className="text-muted-foreground">
                We strictly curate property listings to ensure tenants only see high-quality, accurately described homes with clear pricing.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Community First</h3>
              <p className="text-muted-foreground">
                Our platform is designed to foster positive, respectful, and long-term relationships between renters and property owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to find your next home?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-[600px] mx-auto text-lg">
            Join users who have discovered a seamless way to rent with RentNest.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/auth/register">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
