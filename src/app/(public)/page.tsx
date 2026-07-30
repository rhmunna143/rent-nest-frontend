import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { Metadata } from "next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "RentNest | Find & List Rental Properties",
  description:
    "Browse, list, and manage rental properties with ease. RentNest connects tenants and landlords on a seamless marketplace.",
};

const features = [
  {
    icon: Search,
    title: "Browse Listings",
    description:
      "Search hundreds of rental properties by location, price, size, and category - all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Pay for approved rentals securely via Stripe Checkout. Your payment is always protected.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    description:
      "Read honest reviews from tenants who have actually lived in the property.",
  },
];

export default async function HomePage() {
  let featuredProperties: any[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"}/properties?limit=3`,
      {
        cache: "no-store",
      },
    );
    const json = await res.json();
    if (json.success) {
      featuredProperties = json.data;
    }
  } catch (error) {
    console.error("Failed to fetch featured properties", error);
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-background"
        aria-label="Hero section"
      >
        <div className="container flex mx-auto flex-col md:flex-row items-center justify-between gap-12 px-4 lg:px-0">
          <div className="container mx-auto px-4 lg:px-0 py-24 md:py-36 text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium">
              🏠 Find your perfect home
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
              Rent Smarter. <span className="text-primary">List Easier.</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              RentNest connects tenants with the perfect rental property and
              gives landlords the tools to manage listings effortlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild id="browse-properties-cta">
                <Link href="/properties">
                  Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                id="list-property-cta"
              >
                <Link href="/auth/register">List Your Property</Link>
              </Button>
            </div>
          </div>

          <DotLottieReact
            src="https://lottie.host/9ddae27f-81ac-4221-b043-f60a6de269ff/rDDX4YO8qp.lottie"
            loop
            autoplay
          />
        </div>

        {/* Decorative gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section
          className="container mx-auto px-4 py-12 md:py-20"
          aria-label="Featured Properties"
        >
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">
                Discover some of our best rental properties.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/properties">
                View all <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild className="w-full">
              <Link href="/properties">View all properties</Link>
            </Button>
          </div>
        </section>
      )}

      {/* Features */}
      <section
        className="container mx-auto px-4 py-12 md:py-20"
        aria-label="Features section"
      >
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need, in one place
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center gap-4 rounded-xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-7 w-7 text-primary" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section
        className="bg-primary text-primary-foreground py-16"
        aria-label="Call to action"
      >
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to find your next home?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-md mx-auto">
            Join thousands of tenants and landlords already using RentNest.
          </p>
          <Button size="lg" variant="secondary" asChild id="get-started-cta">
            <Link href="/auth/register">
              Get started for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
