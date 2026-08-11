import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Star,
  CheckCircle,
  CreditCard,
  Home as HomeIcon,
  Building2,
  Users,
  CircleUserRound,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { type Property } from "@/types";
import type { Metadata } from "next";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Counter } from "@/components/ui/counter";

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
  let featuredProperties: Property[] = [];
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
        className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/5 h-screen flex items-center py-12 lg:py-0"
        aria-label="Hero section"
      >
        <div className="container flex mx-auto flex-col lg:flex-row items-center justify-between gap-12 px-4 sm:px-6 lg:px-8">
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold tracking-wide uppercase">
              <span className="animate-pulse">
                <Building2 />
              </span>{" "}
              Welcome to the future of renting
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
              Rent Smarter. <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                List Easier.
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto lg:mx-0">
              RentNest connects tenants with the perfect rental property and
              gives landlords the tools to manage listings effortlessly. Say
              goodbye to the hassle of traditional renting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-1"
                asChild
                id="browse-properties-cta"
              >
                <Link href="/properties">
                  Browse Properties <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-2 hover:bg-primary/5 transition-all hover:-translate-y-1"
                asChild
                id="list-property-cta"
              >
                <Link href="/auth/register">List Your Property</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> No hidden
                fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> Verified
                Landlords
              </div>
            </div>
          </div>

          <div className="flex-1 w-full relative z-10">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <DotLottieReact
              src="https://lottie.host/3cfcbdbf-6602-4989-ab0b-d24f6aee3294/5tajUe8fVj.lottie"
              loop
              autoplay
              className="w-full h-auto drop-shadow-2xl scale-110 relative z-10"
            />
          </div>
        </div>

        {/* Decorative linear blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-125 w-125 rounded-full bg-primary/5 blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-125 w-125 rounded-full bg-blue-500/5 blur-[100px]"
        />
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How RentNest Works
            </h2>
            <p className="text-lg text-muted-foreground">
              The simplest way to find your next home or manage your property
              portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative py-10">
            {/* Animated Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-muted rounded-full -translate-y-1/2 z-0 overflow-hidden">
              <div className="w-1/3 h-full bg-primary/60 blur-[1px] animate-flow-line rounded-full"></div>
            </div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 group bottom-6">
              <div className="w-32 h-32 bg-card rounded-full shadow-xl border-4 border-background flex items-center justify-center p-4 transition-transform group-hover:scale-110 duration-300">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Search className="w-10 h-10" />
                </div>
              </div>

              <div>
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Search & Discover</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse thousands of verified listings with advanced filters to
                  find the perfect match.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 group bottom-6">
              <div className="w-32 h-32 bg-card rounded-full shadow-xl border-4 border-background flex items-center justify-center p-4 transition-transform group-hover:scale-110 duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-10 h-10" />
                </div>
              </div>

              <div>
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Request & Pay securely
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Send a rental request directly to the landlord and pay
                  securely via Stripe once approved.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 group bottom-6">
              <div className="w-32 h-32 bg-card rounded-full shadow-xl border-4 border-background flex items-center justify-center p-4 transition-transform group-hover:scale-110 duration-300">
                <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-10 h-10" />
                </div>
              </div>

              <div>
                <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Move In</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get your keys and move into your new dream home without any of
                  the traditional hassle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="bg-muted/30 py-24" aria-label="Featured Properties">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Featured Listings
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover some of our highest-rated and most requested rental
                  properties available right now.
                </p>
              </div>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="hidden sm:flex rounded-full"
              >
                <Link href="/properties">
                  View all properties <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            <div className="mt-10 text-center sm:hidden">
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full rounded-full"
              >
                <Link href="/properties">View all properties</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* For Tenants Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 w-full">
              <DotLottieReact
                src="https://lottie.host/2aaaeb91-2e33-4c1f-822e-229fe49c5eb7/SPedm53EAu.lottie"
                loop
                autoplay
                className="w-full drop-shadow-xl hue-rotate-90"
              />
            </div>

            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold tracking-wide uppercase">
                <Users /> For Tenants
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Find your happy place, faster.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We've eliminated the friction from renting. Browse verified
                listings, apply with a single click, and securely pay your rent
                online. Your dashboard keeps all your rental history, payments,
                and landlord communications neatly organized in one place.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">100% verified properties</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Secure Stripe payment integration
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Real reviews from past tenants
                  </span>
                </li>
              </ul>
              <div className="pt-6">
                <Button size="lg" asChild className="rounded-full">
                  <Link href="/properties">Start Browsing</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Landlords Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold tracking-wide uppercase">
                <CircleUserRound /> For Landlords
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Manage your properties effortlessly.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Put your property management on autopilot. List your homes,
                review tenant requests, and receive automated payouts directly
                to your bank account. Our dedicated Landlord portal gives you
                complete control over your portfolio.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Instant listing publishing
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Approve or reject requests in 1 click
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="font-medium">
                    Track your estimated earnings
                  </span>
                </li>
              </ul>
              <div className="pt-6">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="rounded-full border-2"
                >
                  <Link href="/auth/register">List Your Property</Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <DotLottieReact
                src="https://lottie.host/c4e0c755-4546-4309-a09c-c31f1b836ff9/QeFTQOPw12.lottie"
                loop
                autoplay
                className="w-full drop-shadow-xl hue-rotate-180 -scale-x-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-24"
        aria-label="Features section"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need, in one place
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide all the tools necessary for a safe, modern renting
            experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex flex-col items-center text-center gap-6 rounded-2xl border bg-card p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon
                  className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors"
                  aria-hidden
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-primary text-primary-foreground py-20 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">
            Trusted by thousands of renters.
          </h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-32">
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black mb-3">
                <Counter end={10000} suffix="+" />
              </span>
              <span className="text-sm md:text-base uppercase tracking-widest font-semibold opacity-90">
                Active Users
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black mb-3">
                <Counter end={5000} suffix="+" />
              </span>
              <span className="text-sm md:text-base uppercase tracking-widest font-semibold opacity-90">
                Properties Listed
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl font-black mb-3">
                <Counter end={99} suffix="%" />
              </span>
              <span className="text-sm md:text-base uppercase tracking-widest font-semibold opacity-90">
                Satisfaction Rate
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Blog / Rental Guides Preview Section */}
      <section className="bg-muted/30 py-24" aria-label="Rental Guides">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Rental Living Guides</h2>
              <p className="text-lg text-muted-foreground">Expert advice, market insights, and practical tips for renting and managing properties.</p>
            </div>
            <Button variant="outline" size="lg" asChild className="hidden sm:flex rounded-full">
              <Link href="/blog">View all guides <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col rounded-2xl overflow-hidden border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="h-48 bg-muted w-full relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground"><BookOpen className="w-12 h-12 opacity-20" /></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-sm text-primary font-medium mb-2">Guide</span>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">How to Price Your Rental Property in {new Date().getFullYear()}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">A comprehensive guide to understanding local market trends and setting a competitive price for your property.</p>
                  <div className="mt-auto pt-4 border-t">
                    <Link href="/blog" className="text-primary font-medium hover:underline inline-flex items-center">Read article <ArrowRight className="ml-1 w-4 h-4" /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-background border-t" aria-label="Newsletter subscribe">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 bg-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Stay updated with RentNest</h2>
            <p className="text-lg text-muted-foreground">Get the latest rental market insights, property management tips, and platform updates delivered straight to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="flex-1 h-12 rounded-full border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required />
              <Button size="lg" className="h-12 rounded-full px-8">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-card py-24 border-b" aria-label="Call to action">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Ready to find your next home?
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Join thousands of tenants and landlords already using RentNest to
            revolutionize the way they rent.
          </p>
          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-lg"
              asChild
              id="get-started-cta"
            >
              <Link href="/auth/register">
                Get started for free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
