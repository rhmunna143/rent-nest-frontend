import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RentNest",
  description: "Terms and conditions governing the use of the RentNest marketplace.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {siteConfig.policyLastUpdated}
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
          <p>
            Welcome to {siteConfig.name}. These Terms of Service ("Terms") govern your use of the{" "}
            {siteConfig.name} platform, website, and related services (collectively, the "Services").
            By accessing or using our Services, you agree to be bound by these Terms.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or otherwise using the Services, you agree to these Terms. If you
            do not agree, you may not use the Services.
          </p>

          <h2>2. User Roles and Responsibilities</h2>
          <p>
            {siteConfig.name} facilitates connections between property owners ("Landlords") and
            individuals seeking to rent ("Tenants").
          </p>
          <ul>
            <li>
              <strong>Landlords:</strong> You are responsible for ensuring that your property
              listings are accurate, legal, and non-discriminatory. You agree to honor the terms of
              any rental agreement established through the platform.
            </li>
            <li>
              <strong>Tenants:</strong> You agree to provide accurate information in your rental
              requests and profile. You are responsible for fulfilling payment obligations for any
              accepted rental requests.
            </li>
          </ul>

          <h2>3. Payments and Fees</h2>
          <p>
            {siteConfig.name} uses certified third-party payment processors (Stripe) to handle
            transactions. By initiating a payment, you agree to the processing terms set forth by
            our payment partners. {siteConfig.name} charges a service fee for rental connections,
            which is clearly disclosed prior to payment completion.
          </p>

          <h2>4. Content Guidelines</h2>
          <p>
            You retain ownership of any content (e.g., photos, descriptions) you upload. However, by
            uploading, you grant {siteConfig.name} a worldwide, non-exclusive license to use,
            display, and distribute this content to operate the platform.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            {siteConfig.name} acts solely as a marketplace. We do not own, manage, or physically
            inspect properties. We are not a party to the lease agreement between Landlords and
            Tenants.
          </p>

          <h2>6. Termination</h2>
          <p>
            We may suspend or terminate your account at any time for violations of these Terms,
            fraud, or other activities that harm the {siteConfig.name} community.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
