import { Building, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 md:w-3/4 mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Redefining the Rental Experience
            </h1>
            <p className="text-xl text-muted-foreground max-w-[700px]">
              RentNest bridges the gap between trustworthy landlords and verified tenants, bringing transparency and ease to the modern rental market.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background border-b">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">10k+</h3>
              <p className="text-muted-foreground font-medium">Active Tenants</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">5k+</h3>
              <p className="text-muted-foreground font-medium">Verified Landlords</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">25k+</h3>
              <p className="text-muted-foreground font-medium">Properties Listed</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">99%</h3>
              <p className="text-muted-foreground font-medium">Secure Payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              We built RentNest on three foundational pillars designed to eliminate the anxiety and friction of traditional renting.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Trust & Safety</h3>
              <p className="text-muted-foreground">
                Every landlord and tenant is vetted to ensure a secure and reliable community.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Quality Listings</h3>
              <p className="text-muted-foreground">
                We strictly curate properties to ensure tenants only see high-quality, accurately described homes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Community First</h3>
              <p className="text-muted-foreground">
                Our platform is designed to foster positive, long-term relationships between renters and property owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to find your next home?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-[600px] mx-auto text-lg">
            Join thousands of users who have already discovered a better way to rent with RentNest.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/auth/register">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
