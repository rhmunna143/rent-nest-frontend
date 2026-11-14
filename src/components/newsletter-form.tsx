"use client";

import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { Loader2, CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return;

    setIsSubmitting(true);
    try {
      const res = await api.post("/newsletter", { email: cleanEmail });
      if (res.ok) {
        setIsSubscribed(true);
        toast.success(res.message || "Thank you for subscribing to RentNest updates!");
        setEmail("");
      } else {
        toast.error(res.message || "Could not subscribe. Please try again.");
      }
    } catch {
      toast.error("Failed to connect to the newsletter service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-success/10 text-success text-sm font-medium max-w-md mx-auto">
        <CheckCircle2 className="h-5 w-5 shrink-0" />
        <span>You are subscribed! Watch your inbox for weekly market updates.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        className="flex-1 h-12 rounded-xl border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        required
      />
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="h-12 rounded-xl px-8 font-medium shrink-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          "Subscribe"
        )}
      </Button>
    </form>
  );
}
