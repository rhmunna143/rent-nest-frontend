export const siteConfig = {
  name: "RentNest",
  description:
    "Modern rental property marketplace connecting verified tenants and landlords directly with secure Stripe payments.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://rentnest.vercel.app",
  policyLastUpdated: "August 15, 2026",
  contact: {
    email: "support@rentnest.com",
    phone: "+1 (800) 555-0199",
    address: "123 Market Street, Suite 400, San Francisco, CA 94105",
  },
  social: {
    github: "https://github.com/rhmunna143/rent-nest-frontend",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
  },
  links: {
    terms: "/terms",
    privacy: "/privacy",
    help: "/help",
    contact: "/contact",
    about: "/about",
    properties: "/properties",
    blog: "/blog",
  },
};
