import { Home, ShieldCheck, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | RentNest",
  description: "Learn more about RentNest, our mission, and our values.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary/5 py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Redefining the <span className="text-primary">Rental Experience</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            At RentNest, we believe finding a home should be as comfortable as living in one. Our platform bridges the gap between trustworthy landlords and verified tenants, creating a seamless, transparent, and secure rental marketplace.
          </p>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 sm:px-6 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are driven by a commitment to make the rental process better for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 border rounded-2xl bg-card shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold">Trust & Security</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Every landlord and tenant is vetted to ensure a safe community. Secure payments are integrated directly into our platform.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-card shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold">Frictionless Experience</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                From browsing properties to signing the lease and paying rent, everything happens smoothly in one centralized dashboard.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-card shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold">Community First</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We foster a community based on respect and transparency. Read real reviews from previous tenants before you move.
              </p>
            </div>

            <div className="p-6 border rounded-2xl bg-card shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <Home className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold">Quality Homes</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We enforce high standards for our listings, ensuring you only see properties that are truly ready to become your next home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to join the RentNest community?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Whether you are looking for your next dream apartment, or looking to list your property to verified renters, we have you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto">
              <Link href="/properties">
                Find a Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/auth/register">
                List a Property
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
