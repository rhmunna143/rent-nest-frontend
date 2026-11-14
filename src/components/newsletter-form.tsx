"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNewsletter } from "@/hooks/api/useNewsletter";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const newsletterMutation = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    try {
      const res = await newsletterMutation.mutateAsync(cleanEmail);
      setIsSubscribed(true);
      toast.success(res.message || "Thank you for subscribing to RentNest updates!");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not subscribe. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-success/10 text-success text-sm font-medium max-w-md mx-auto">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>You are subscribed! Watch your inbox for weekly rental insights.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md mx-auto" noValidate>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={newsletterMutation.isPending}
            className={`w-full h-12 rounded-xl border bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 ${
              error ? "border-destructive focus-visible:ring-destructive" : "border-input"
            }`}
            aria-label="Email address for newsletter"
            aria-invalid={!!error}
            aria-describedby={error ? "newsletter-error" : undefined}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={newsletterMutation.isPending}
          className="h-12 rounded-xl px-8 font-medium shrink-0"
        >
          {newsletterMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
      {error && (
        <p id="newsletter-error" className="text-xs text-destructive font-medium text-left px-1">
          {error}
        </p>
      )}
    </form>
  );
}
