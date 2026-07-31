# 🏡 RentNest Frontend

**Find & List Rental Properties with Ease**

RentNest is a comprehensive rental property marketplace built with modern web technologies. It seamlessly connects **Tenants** looking for their next home, **Landlords** managing property portfolios, and **Admins** overseeing the platform ecosystem.

Built on **Next.js (App Router)** and styled with **Tailwind CSS**, RentNest provides a blazingly fast, accessible, and heavily animated user experience.

---

## 🔗 Backend Information

This frontend connects to a dedicated backend service. You can find the source code and live API here:
- **Backend Repository:** [https://github.com/rhmunna143/rent-nest-backend](https://github.com/rhmunna143/rent-nest-backend)
- **Live Backend API URL:** `https://rent-nest-backend-eight.vercel.app/api`

---

## ✨ Comprehensive Features

### 🌐 Public Marketplace
- **Dynamic Homepage:** Beautiful landing page featuring Lottie animations, animated flow lines, and dynamic stats counters powered by Intersection Observers.
- **Advanced Property Search:** Browse available properties with rich filtering (price, category, bedrooms).
- **Rich Property Details:** View property galleries, landlord information, aggregated reviews, and an integrated "Request to Rent" flow.

### 👤 Tenant Experience
- **Secure Requests:** Safely request to rent a property with custom move-in dates and messages.
- **Stripe Integration:** Seamless payment flow for approved requests using Stripe Checkout.
- **Payment Lifecycle Dashboard:** Track requests through `PENDING` ➔ `APPROVED` ➔ `ACTIVE` ➔ `COMPLETED`. 
- **Review System:** Leave verified ratings and reviews for completed rentals.

### 🏢 Landlord Experience
- **Property Management:** Full CRUD capabilities for properties with instant status toggling (`AVAILABLE`, `RENTED`, `UNAVAILABLE`).
- **Request Moderation:** Approve or reject incoming tenant requests with optimistic UI updates.
- **Analytics Overview:** See at-a-glance metrics for total properties and incoming request volume.

### 🛡️ Admin Experience
- **Live Platform Analytics:** A responsive, multi-column dashboard featuring live charts (built with `recharts`) showing active properties and platform categories.
- **Category Management:** Full CRUD interface for managing global property categories used by landlords.
- **Robust Security:** Strict middleware-level route guarding ensures Admins are the only users who can access platform settings.

---

## 🚀 Unique & Standout Features

- **Bulletproof Stripe Webhook Synchronization:** Stripe checkout sessions redirect immediately, often before the backend webhook has finished updating the database. RentNest implements a smart UI polling strategy on the `/payment/success` page that visually verifies the backend database before showing a success checkmark.
- **Intelligent Payment Fallbacks:** When redirecting back from Stripe, third-party gateways often strip custom query parameters (like `rentalId`). RentNest solves this elegantly by securely caching context in `localStorage` right before checkout, ensuring a flawless post-payment UX regardless of URL parameter stripping.
- **Dynamic Mobile Responsiveness:** Dashboard layouts feature a persistent sidebar on desktop that seamlessly transitions into a sleek, state-aware hamburger `Sheet` drawer on tablets and mobile devices. 
- **Advanced UI Animations:** Includes custom CSS keyframe `flow-line` animations, Lottie animations optimized to prevent React hydration mismatches (via deferred mounting), and scroll-triggered stat counters.
- **Airtight Middleware Security:** Role-based access control isn't just hidden in the UI. Next.js Middleware acts as a unified gatekeeper, strictly routing unauthenticated or unauthorized roles away from protected nested routes.

---

## 🧗 Challenges Faced & Overcome

Throughout the development of RentNest, several complex technical hurdles were overcome to ensure a premium user experience:

1. **Hydration Mismatches with Lottie Animations:**
   - **Challenge:** Implementing advanced Lottie animations (`@lottiefiles/dotlottie-react`) caused Next.js server-side hydration errors because the canvas elements rendered differently on the server versus the client browser.
   - **Solution:** Engineered a deferred-mounting hook (`isMounted` state) that entirely skips Server-Side Rendering (SSR) for the floating Lottie elements, deferring them to client-side only. This completely eliminated console errors while preserving SEO for the rest of the page.

2. **Payment Gateway Parameter Stripping:**
   - **Challenge:** The backend initiated Stripe Checkout sessions without preserving the frontend's `rentalId` in the `successUrl`. When Stripe redirected the user back to the success page, it only provided a `session_id`, leaving the frontend blind as to which rental request to verify.
   - **Solution:** Implemented a robust pre-flight caching mechanism. The exact moment a user clicks "Pay", the frontend saves the `rentalId` into browser `localStorage`. When Stripe redirects back, the success page intelligently falls back to `localStorage` if the URL parameters are stripped, guaranteeing 100% reliability.

3. **Dashboard Layout Squishing on Tablets (1024px):**
   - **Challenge:** The dashboard layout's fixed sidebar was originally set to remain open on medium screens (`md:block`), which severely squished the `recharts` graphs and admin analytics cards on iPad Pro dimensions (1024px).
   - **Solution:** Refactored the Tailwind breakpoint architecture across `layout.tsx`, `MobileSidebar.tsx`, and `page.tsx`. Shifted the persistent sidebar to strictly `lg` (1024px+), while simultaneously expanding the fluid grid columns to `xl` (1280px+). This allowed the layout to gracefully drop into a spacious 2-column view on 1024px screens, providing a flawless tablet experience.

4. **Data Type Casting from Legacy APIs:**
   - **Challenge:** Integrating live data into the Recharts components failed initially because the backend returned numeric values (like total properties) as strings.
   - **Solution:** Implemented strict frontend type-casting and fallback UI skeletons to ensure the charts rendered safely and correctly regardless of backend typing quirks.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4) + Shadcn UI
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Icons & Assets:** Lucide React, DotLottie
- **Data Fetching:** Native fetch API with custom `ApiClient` wrapper

---

## 💻 Local Setup & Installation

Follow these steps to get the RentNest frontend running on your local machine.

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm** or **pnpm** (npm is used in this guide)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/rent-nest-frontend.git
   cd rent-nest-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of the project and add your backend API URL and any other necessary secrets:
   ```env
   # Example .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
   *(Note: Ensure your backend server is running locally on port 8080, or point this to your deployed backend URL).*

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000). You should see the RentNest landing page!

---

> Built with ❤️ by the RentNest Team. [@rhmunna143](https://rhmunna.pro.bd)
