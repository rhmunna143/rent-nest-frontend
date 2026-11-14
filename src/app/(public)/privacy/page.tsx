import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentNest",
  description: "Learn how RentNest collects, protects, and handles personal data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 px-4 sm:px-6 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {siteConfig.policyLastUpdated}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
          <p>
            At {siteConfig.name}, we take your privacy seriously. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information when you visit our website and
            use our platform.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when registering on
            the platform, expressing an interest in obtaining information about us or our products
            and services, when participating in activities on the platform (such as posting
            properties or rental requests), or otherwise contacting us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with
            us and the platform, the choices you make, and the products and features you use.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our platform for a variety of business purposes
            described below. We process your personal information in reliance on legitimate business
            interests, in order to perform a contract with you, and for compliance with our legal
            obligations.
          </p>
          <ul>
            <li>To facilitate secure account creation, authentication, and session handling.</li>
            <li>To manage user accounts and property listings.</li>
            <li>To fulfill and manage rental requests and secure Stripe transactions.</li>
            <li>To send administrative notifications, alerts, and platform updates.</li>
          </ul>

          <h2>3. Will Your Information Be Shared with Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, or to deliver the
            requested rental service. For example, when a tenant submits a rental request, their
            profile information is shared with the respective landlord to facilitate tenant review.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement state-of-the-art security measures including encrypted TLS transmission,
            token-based authentication, and role-based access control to protect your personal
            information.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">
              {siteConfig.contact.email}
            </a>{" "}
            or write to:
          </p>
          <address className="not-italic text-muted-foreground">
            {siteConfig.name} Inc.
            <br />
            {siteConfig.contact.address}
          </address>
        </div>
      </div>
    </div>
  );
}
