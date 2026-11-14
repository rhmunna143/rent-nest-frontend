export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Tenants" | "Landlords" | "Payments" | "Security";
}

export const faqs: FAQItem[] = [
  {
    id: "how-rentnest-works",
    question: "How does RentNest work?",
    answer:
      "RentNest is a modern rental marketplace connecting tenants and landlords directly. Tenants can browse verified listings, submit rental requests, and pay securely online. Landlords can list properties, review incoming tenant applications, and manage leases with complete transparency.",
    category: "General",
  },
  {
    id: "how-to-apply",
    question: "How do I apply for a rental property?",
    answer:
      "Once you find a property you like, click 'View Details' and submit a rental request specifying your desired lease start date and duration. The landlord reviews your request and can approve or decline it through their dashboard.",
    category: "Tenants",
  },
  {
    id: "payment-security",
    question: "How are rental payments handled and secured?",
    answer:
      "RentNest integrates with Stripe Checkout for end-to-end payment encryption. Once a landlord approves your rental request, you can complete payment directly using your card. We do not store sensitive payment card details on our servers.",
    category: "Payments",
  },
  {
    id: "landlord-listing-fees",
    question: "Are there any upfront fees for landlords to list properties?",
    answer:
      "Creating an account and listing your rental properties on RentNest is free. You have full control over your listing pricing, availability, and tenant selection without hidden recurring listing charges.",
    category: "Landlords",
  },
  {
    id: "rental-approval-timeline",
    question: "How long does it take for a landlord to respond to a request?",
    answer:
      "Landlords typically review and respond to rental requests within 24 to 48 hours. You can monitor the real-time status of all your applications in your Tenant Dashboard under 'My Requests'.",
    category: "Tenants",
  },
  {
    id: "property-availability",
    question: "What happens when a property is rented?",
    answer:
      "Once a tenant's rental request is approved and payment is completed, the property status automatically updates to 'RENTED', preventing duplicate applications and keeping search results accurate for other renters.",
    category: "Security",
  },
  {
    id: "reviews-policy",
    question: "Can I review a property or landlord?",
    answer:
      "Yes. Tenants with an active or completed rental agreement can submit verified reviews and ratings (1 to 5 stars) along with their feedback to help future renters make informed decisions.",
    category: "Tenants",
  },
];
