"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MapPin, Phone, CheckCircle2, MessageSquare } from "lucide-react";

import { FormField, FormTextarea, SubmitButton } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useSubmitContact } from "@/hooks/api/useContact";
import { applyServerErrors } from "@/lib/errors";
import { siteConfig } from "@/lib/site-config";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  // Honeypot field for bot suppression
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const contactMutation = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ContactFormValues) => {
    // Honeypot detection: bots auto-fill hidden website field
    if (data.website && data.website.trim().length > 0) {
      setIsSuccess(true);
      reset();
      return;
    }

    try {
      await contactMutation.mutateAsync({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });

      setIsSuccess(true);
      toast.success("Message sent successfully! We will get back to you soon.");
      reset();
    } catch (err: unknown) {
      const errorWithDetails = err as {
        message?: string;
        errorDetails?: Array<{ field?: string; message: string }>;
      };

      if (errorWithDetails.errorDetails && errorWithDetails.errorDetails.length > 0) {
        applyServerErrors(form.setError, errorWithDetails.errorDetails);
      } else {
        toast.error(errorWithDetails.message || "Failed to send message. Please try again later.");
      }
    }
  };

  const isLoading = isSubmitting || contactMutation.isPending;

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-muted-foreground">
          Have a question about RentNest? Whether you're a tenant looking for your dream home or a landlord wanting to list a property, we're here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
        {/* Contact Information */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Get in Touch</h2>
            <p className="text-muted-foreground">
              Fill out the form and our team will get back to you within 24 hours. For urgent matters, please reach out directly via phone or email.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Headquarters</h3>
                <p className="text-muted-foreground">{siteConfig.contact.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Email Support</h3>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Phone Support</h3>
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/[^0-9+]/g, "")}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {siteConfig.contact.phone}
                </a>
                <p className="text-sm text-muted-foreground">Mon-Fri, 9am-6pm PST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form or Success State */}
        <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold">Message Received</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Thank you for reaching out. One of our property specialists will review your inquiry and follow up within one business day.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsSuccess(false)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Honeypot field (hidden from real users) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input
                  id="contact-website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                />
              </div>

              <FormField
                id="name"
                label="Full Name"
                error={errors.name?.message}
                placeholder="Jane Doe"
                disabled={isLoading}
                {...register("name")}
              />

              <FormField
                id="email"
                label="Email Address"
                error={errors.email?.message}
                type="email"
                placeholder="jane@example.com"
                disabled={isLoading}
                {...register("email")}
              />

              <FormField
                id="subject"
                label="Subject"
                error={errors.subject?.message}
                placeholder="Inquiry about rental listing or property management"
                disabled={isLoading}
                {...register("subject")}
              />

              <FormTextarea
                id="message"
                label="Message"
                error={errors.message?.message}
                placeholder="Please describe your question or issue in detail..."
                rows={5}
                disabled={isLoading}
                {...register("message")}
              />

              <SubmitButton
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? "Sending Message..." : "Send Message"}
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
