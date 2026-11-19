"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, Users, CircleUserRound, ArrowRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function HomeTabs() {
  return (
    <section className="py-20 bg-muted/30" aria-label="Solutions for tenants and landlords">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Built for Everyone in the Rental Journey
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Whether you are searching for your next home or managing residential properties, RentNest simplifies the entire lifecycle.
          </p>
        </div>

        <Tabs defaultValue="tenants" className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md h-12 p-1 rounded-xl bg-card border">
              <TabsTrigger value="tenants" className="rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                For Tenants
              </TabsTrigger>
              <TabsTrigger value="landlords" className="rounded-lg text-sm font-semibold flex items-center justify-center gap-2">
                <CircleUserRound className="h-4 w-4" />
                For Landlords
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tenants Content */}
          <TabsContent value="tenants" className="focus-visible:outline-none">
            <div className="rounded-2xl border bg-card p-6 sm:p-10 shadow-xs">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Seamless Renting
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Find and lease your dream space with full peace of mind.
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Browse hundreds of verified properties, submit digital rental applications, and complete payments securely online without intermediaries or surprise fees.
                  </p>
                  <div className="pt-2">
                    <Button asChild size="lg" className="rounded-xl">
                      <Link href="/properties">
                        Explore Listings <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/40 p-6 rounded-xl border">
                  {[
                    "Accurate pricing with no hidden broker markups",
                    "Direct rental request submissions to landlords",
                    "Secure payments powered by Stripe Checkout",
                    "Authentic reviews and ratings from past renters",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Landlords Content */}
          <TabsContent value="landlords" className="focus-visible:outline-none">
            <div className="rounded-2xl border bg-card p-6 sm:p-10 shadow-xs">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                    Property Management
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Manage listings, screen requests, and track your revenue.
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    Gain full visibility over your property portfolio. List units in minutes, approve or decline tenant requests with one click, and track rental earnings in real time.
                  </p>
                  <div className="pt-2">
                    <Button asChild size="lg" className="rounded-xl">
                      <Link href="/auth/register">
                        List Your Property <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 bg-muted/40 p-6 rounded-xl border">
                  {[
                    "Quick and flexible property listing creation",
                    "Centralized dashboard for all tenant applications",
                    "Real-time revenue and earnings reporting",
                    "Zero recurring listing charges or hidden costs",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
