"use client";

import * as React from "react";
import Link from "next/link";
import { Search, HelpCircle, ArrowRight, Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs, type FAQItem } from "@/lib/data/faq";

export default function HelpPage() {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const categories = ["All", "General", "Tenants", "Landlords", "Payments", "Security"];

  const filteredFaqs = React.useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <PageHeader
        title="Help & Support Center"
        description="Find answers to common questions about leasing, listing properties, payments, and account security."
      />

      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search articles, policies, or questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 rounded-xl pl-11 pr-4 border bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-xs"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 rounded-xl border bg-card/50 space-y-3">
            <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-semibold text-base">No matching questions found</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              We couldn't find any questions matching "{search}". Try searching for something else or contact our support team.
            </p>
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {filteredFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border rounded-xl px-5 bg-card shadow-2xs"
              >
                <AccordionTrigger className="text-left font-semibold text-sm sm:text-base hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-normal">
                      {faq.category}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>

      {/* Support CTA Banner */}
      <div className="rounded-2xl border bg-primary/5 p-8 text-center space-y-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Mail className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">Still have questions?</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Our customer support team is available around the clock to help resolve any inquiry.
        </p>
        <Button asChild className="rounded-xl">
          <Link href="/contact">
            Get in touch <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
