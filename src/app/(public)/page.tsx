import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  CreditCard,
  Home as HomeIcon,
  Building2,
  Users,
  Star,
  CheckCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HomeTabs } from "@/components/home/HomeTabs";
import { NewsletterForm } from "@/components/newsletter-form";
import { Counter } from "@/components/ui/counter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/format";
import { faqs } from "@/lib/data/faq";
import { blogPosts } from "@/lib/data/blog";
import { serverFetch } from "@/lib/server-api";
import type { Property, Category, PublicStats, Review } from "@/types";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "RentNest | Find & List Rental Properties",
  description:
    "Browse, list, and manage rental properties with ease. RentNest connects tenants and landlords on a seamless, transparent marketplace.",
};

export default async function HomePage() {
  const [statsRes, categoriesRes, propertiesRes, reviewsRes] = await Promise.all([
    serverFetch<PublicStats>("/stats", { next: { revalidate: 60, tags: ["stats"] } }),
    serverFetch<Category[]>("/categories", { next: { revalidate: 60, tags: ["categories"] } }),
    serverFetch<Property[]>("/properties?limit=4", { next: { revalidate: 60, tags: ["properties"] } }),
    serverFetch<Review[]>("/reviews?limit=6", { next: { revalidate: 60, tags: ["reviews"] } }),
  ]);

  const stats = statsRes.ok ? statsRes.data : null;
  const categories = categoriesRes.ok
    ? (categoriesRes.data ?? []).filter((c) => (c._count?.properties ?? 0) > 0)
    : [];
  const featuredProperties = propertiesRes.ok ? (propertiesRes.data ?? []) : [];
  const reviews = reviewsRes.ok ? (reviewsRes.data ?? []) : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION (60-70vh constraint) */}
      <section
        className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background py-12 lg:py-0 lg:h-[65vh] min-h-[520px] flex items-center border-b"
        aria-label="Hero section"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3.5 py-1 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Generation Rental Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Rent Smarter. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                  List Easier.
                </span>
              </h1>

              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Connect directly with landlords, submit transparent applications, and complete payments securely with Stripe. No hidden fees or cumbersome paperwork.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Button
                  size="lg"
                  className="rounded-xl h-12 px-6 text-base font-semibold shadow-md shadow-primary/20"
                  asChild
                  id="browse-properties-hero-btn"
                >
                  <Link href="/properties">
                    Browse Properties <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl h-12 px-6 text-base font-semibold border-2"
                  asChild
                  id="list-property-hero-btn"
                >
                  <Link href="/auth/register">List Your Property</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Stripe-Protected Payments
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  Verified Leases
                </span>
              </div>
            </div>

            {/* Right Carousel */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <HeroCarousel properties={featuredProperties} />
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl"
        />
      </section>

      {/* 2. LIVE STATS SECTION */}
      {stats && (
        <section className="py-12 bg-card border-b" aria-label="Platform Statistics">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                  <Counter end={stats.availableProperties || stats.properties} />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Available Properties
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                  <Counter end={stats.landlords + stats.tenants} suffix="+" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Active Community
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold text-foreground">
                  <Counter end={stats.completedRentals} suffix="+" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Completed Leases
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold text-primary flex items-center justify-center gap-1">
                  <span>{stats.averageRating ? stats.averageRating.toFixed(1) : "5.0"}</span>
                  <Star className="h-5 w-5 fill-warning text-warning" />
                </div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  Average Rating
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BROWSE BY CATEGORY SECTION */}
      {categories.length > 0 && (
        <section className="py-20 bg-background" aria-label="Browse by category">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Explore by Category
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Find living spaces tailored to your preferred style and needs.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-xl">
                <Link href="/properties">
                  All categories <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/properties?categoryId=${category.id}`}
                  className="group rounded-xl border bg-card p-4 text-center hover:border-primary/50 hover:shadow-md transition-all flex flex-col items-center justify-center"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                  <span className="text-xs text-muted-foreground mt-1">
                    {category._count?.properties ?? 0} {category._count?.properties === 1 ? "listing" : "listings"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED LISTINGS (4 PER ROW) */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-muted/20 border-y" aria-label="Featured rental listings">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                  Hand-Picked Units
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Featured Properties
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-1">
                  Top-rated rental options with premium amenities and verified landlords.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href="/properties">
                  View all properties <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.slice(0, 4).map((property, idx) => (
                <PropertyCard key={property.id} property={property} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW IT WORKS SECTION */}
      <section className="py-20 bg-background" aria-label="How RentNest works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              How RentNest Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              A frictionless rental process from initial search to key handover.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card/60 shadow-xs">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-bold">Search & Discover</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Filter by neighborhood, budget, amenities, and room configurations to find spaces that match your lifestyle.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card/60 shadow-xs">
              <div className="h-14 w-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-bold">Request & Review</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submit rental dates with one click. The property owner reviews your application and responds within 48 hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border bg-card/60 shadow-xs">
              <div className="h-14 w-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-bold">Pay & Move In</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Complete your lease payment safely through Stripe Checkout. Receive full confirmation and move into your new home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOR TENANTS / LANDLORDS (SINGLE TABS COMPONENT) */}
      <HomeTabs />

      {/* 7. TESTIMONIALS FROM REAL REVIEWS */}
      {reviews.length > 0 && (
        <section className="py-20 bg-background" aria-label="Tenant reviews">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                Loved by Renters
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Real feedback from tenants who completed their rental leases on RentNest.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col justify-between p-6 rounded-2xl border bg-card shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "fill-warning" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-foreground/90 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={review.tenant?.profileImage ?? undefined}
                        alt={review.tenant?.name || "Renter"}
                      />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {getInitials(review.tenant?.name || "Renter")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold truncate">
                        {review.tenant?.name || "Verified Tenant"}
                      </p>
                      {review.property && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {review.property.title} • {review.property.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. RENTAL LIVING GUIDES */}
      <section className="py-20 bg-muted/20 border-y" aria-label="Rental guides">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Rental Living Guides
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Insights, market trends, and practical advice for renters and property owners.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/blog">
                Read all articles <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                className="group flex flex-col rounded-2xl overflow-hidden border bg-card shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video w-full bg-muted overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <BookOpen className="h-8 w-8 opacity-40" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-3 border-t">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-primary inline-flex items-center hover:underline"
                    >
                      Read full article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="py-20 bg-background" aria-label="Frequently Asked Questions">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Everything you need to know about renting and listing on RentNest.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-xl px-4 bg-card shadow-2xs"
              >
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 10. NEWSLETTER SECTION */}
      <section className="py-16 bg-muted/30 border-y" aria-label="Newsletter subscription">
        <div className="container mx-auto px-4 max-w-2xl text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Stay Updated with RentNest
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Get market insights, exclusive listing notifications, and rental guides delivered straight to your inbox.
          </p>
          <div className="pt-2">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA BANNER */}
      <section className="py-20 bg-card border-b" aria-label="Call to action">
        <div className="container mx-auto px-4 text-center max-w-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Find Your Next Home?
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Join thousands of satisfied tenants and landlords who rely on RentNest for straightforward, transparent property rentals.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold rounded-xl shadow-md"
              asChild
              id="get-started-landing-cta"
            >
              <Link href="/auth/register">
                Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
