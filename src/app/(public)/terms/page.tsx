export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 px-4 sm:px-6 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">Last updated: August 2026</p>
        </div>
        
        <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
          <p>
            Welcome to RentNest. These Terms of Service ("Terms") govern your use of the RentNest platform, website, and related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms.
          </p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By creating an account or otherwise using the Services, you agree to these Terms. If you do not agree, you may not use the Services.
          </p>
          
          <h2>2. User Roles and Responsibilities</h2>
          <p>RentNest facilitates connections between property owners ("Landlords") and individuals seeking to rent ("Tenants").</p>
          <ul>
            <li><strong>Landlords:</strong> You are responsible for ensuring that your property listings are accurate, legal, and non-discriminatory. You agree to honor the terms of any rental agreement established through the platform.</li>
            <li><strong>Tenants:</strong> You agree to provide accurate information in your rental requests and profile. You are responsible for fulfilling payment obligations for any accepted rental requests.</li>
          </ul>

          <h2>3. Payments and Fees</h2>
          <p>RentNest uses third-party payment processors to handle transactions. By initiating a payment, you agree to the processing fees and terms set forth by our payment partners. RentNest may charge a service fee for successful rental connections, which will be clearly disclosed prior to transaction completion.</p>

          <h2>4. Content Guidelines</h2>
          <p>You retain ownership of any content (e.g., photos, descriptions) you upload. However, by uploading, you grant RentNest a worldwide, non-exclusive license to use, display, and distribute this content to operate and promote the Services. We reserve the right to remove any content that violates these Terms or our community guidelines.</p>

          <h2>5. Limitation of Liability</h2>
          <p>RentNest acts solely as a marketplace. We do not own, manage, or inspect the properties listed. We are not a party to the lease agreement between Landlords and Tenants and cannot guarantee the condition of the properties or the behavior of the users.</p>
          
          <h2>6. Termination</h2>
          <p>We may suspend or terminate your account at any time for violations of these Terms, fraud, or other activities that harm the RentNest community.</p>

          <h2>7. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at legal@rentnest.com.</p>
        </div>
      </div>
    </div>
  );
}
