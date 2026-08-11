export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  date: string;
  author: string;
  category: string;
  readTime: string;
  coverImage?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "tenant-guide-request-flow",
    title: "A Tenant's Guide to the Request Flow",
    excerpt: "Learn how to effectively submit and manage your rental requests on RentNest to secure your dream home quickly.",
    date: "2026-08-10",
    author: "Jane Doe",
    category: "Guides",
    readTime: "4 min read",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: `
      <h2>Understanding the Request Process</h2>
      <p>Securing a rental property in a competitive market can be stressful. RentNest simplifies this with our transparent request flow. Here is what you need to know from submission to moving in.</p>
      
      <h3>1. Submitting a Request</h3>
      <p>Once you find a property you love, hit the "Request to Rent" button. You'll need to specify your desired move-in date and write a brief message to the landlord introducing yourself.</p>
      
      <h3>2. The PENDING State</h3>
      <p>Your request initially enters a <strong>PENDING</strong> state. The landlord is reviewing your profile and message. It's crucial that your RentNest profile is fully fleshed out with verified income and employment details to increase your chances of approval.</p>
      
      <h3>3. Approval and Payment</h3>
      <p>If the landlord accepts, your request moves to <strong>APPROVED</strong>. You will receive a notification prompting you to make your initial payment (first month's rent + security deposit). RentNest securely handles this transaction.</p>
      
      <h3>4. Moving In</h3>
      <p>Once payment clears, the status changes to <strong>ACTIVE</strong>. Congratulations! You can now coordinate move-in logistics with your new landlord directly through the platform.</p>
    `
  },
  {
    id: "2",
    slug: "landlord-pricing-strategy",
    title: "Pricing Your Property for Maximum Yield",
    excerpt: "Discover the best strategies for setting competitive rental prices while maximizing your return on investment.",
    date: "2026-08-05",
    author: "John Smith",
    category: "Landlords",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: `
      <h2>The Art of Pricing</h2>
      <p>Pricing your rental property isn't just about covering your mortgage; it's about finding the sweet spot between maximizing yield and minimizing vacancy periods.</p>
      
      <h3>Analyze the Local Market</h3>
      <p>Before listing on RentNest, research comparable properties in your neighborhood. Look at properties with similar square footage, bedroom counts, and amenities. If you price too high above the median, you risk extended vacancies, which quickly eat into your annual yield.</p>
      
      <h3>Factor in Amenities</h3>
      <p>Does your property offer in-unit laundry, dedicated parking, or a recent renovation? These premium features allow you to price slightly above the market average. Make sure to highlight these explicitly in your RentNest listing description.</p>
      
      <h3>Dynamic Pricing Strategies</h3>
      <p>Consider the seasonality of the rental market. Demand typically peaks in summer and drops in winter. If you're listing in November, you might need to offer a slight discount to secure a quality tenant quickly, whereas a May listing can command top dollar.</p>
    `
  },
  {
    id: "3",
    slug: "understanding-rental-statuses",
    title: "Decoding Rental Statuses on RentNest",
    excerpt: "A quick breakdown of what PENDING, APPROVED, ACTIVE, and COMPLETED mean for your rental journey.",
    date: "2026-08-01",
    author: "RentNest Support",
    category: "Platform Updates",
    readTime: "3 min read",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    content: `
      <h2>Navigating Your Dashboard</h2>
      <p>Whether you're a tenant or a landlord, your RentNest dashboard revolves around the status of rental requests. Here's a definitive guide to what each status means.</p>
      
      <h3>PENDING</h3>
      <p>A tenant has expressed interest and submitted a request. The ball is in the landlord's court to review the tenant's profile and either approve or reject the request.</p>
      
      <h3>APPROVED</h3>
      <p>The landlord has given the green light! The tenant must now complete the initial payment process via RentNest. The property remains reserved for the tenant during this phase.</p>
      
      <h3>ACTIVE</h3>
      <p>Payment has been secured, and the lease is officially ongoing. Both parties can view active rentals in their respective dashboards to track ongoing payments or maintenance requests.</p>
      
      <h3>COMPLETED / REJECTED / CANCELLED</h3>
      <p><strong>COMPLETED:</strong> The lease term has ended successfully.<br/>
      <strong>REJECTED:</strong> The landlord declined the initial request.<br/>
      <strong>CANCELLED:</strong> Either party backed out before the rental became ACTIVE.</p>
    `
  }
];
