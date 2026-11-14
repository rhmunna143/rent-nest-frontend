# 🏡 RentNest Frontend

**Modern Rental Property Marketplace — Built with Next.js 16, TypeScript & Tailwind CSS**

RentNest is a production-grade rental property marketplace platform connecting verified **Tenants**, **Landlords**, and **Admins**. Engineered with the **Next.js 16 App Router**, **React 19**, and a cohesive **design token system**, RentNest provides real-time rental listings, Stripe payments, server-backed wishlists, Cloudinary media uploads, role-based dashboards, and an AI-powered property assistant.

---

## 🔗 Project Overview & Live Demo

- **Frontend Repository:** [https://github.com/rhmunna143/rent-nest-frontend](https://github.com/rhmunna143/rent-nest-frontend)
- **Live Frontend:** [https://rent-nest-frontend-sigma.vercel.app](https://rent-nest-frontend-sigma.vercel.app)
- **Live Backend API:** `https://rent-nest-backend-eight.vercel.app/api` (Local: `http://localhost:8080/api`)
- **Backend Repository:** [https://github.com/rhmunna143/rent-nest-backend](https://github.com/rhmunna143/rent-nest-backend)
- **Demo Video Walkthrough:** [https://youtu.be/z8wbl2pG3k8](https://youtu.be/z8wbl2pG3k8)

---

## 🔐 Seeded Demo Credentials

One-click demo login buttons are provided on `/auth/login` to explore each role instantly:

| Role | Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@rentnest.com` | `admin123` | Platform analytics, User management (ban/unban), Property moderation, Categories CRUD, Contact inquiries, Rentals & Payments audit |
| **Landlord** | `landlord@rentnest.com` | `Demo@1234` | Earnings overview, Property CRUD with Cloudinary image upload, Rental request approvals/declines |
| **Tenant** | `tenant@rentnest.com` | `Demo@1234` | Explore listings, Submit rent requests, Stripe checkout & payment sync, Server-backed Wishlist, Reviews |

---

## 📐 Architecture & Engineering Highlights

### 1. Design Token System & WCAG AA Contrast
- **3 Brand Tokens:** Defined strictly in `src/app/globals.css` using HSL CSS variables:
  - `--primary` (Indigo / Primary brand actions)
  - `--secondary` (Muted action accents)
  - `--accent` (Interactive highlights & badges)
- **Semantic Tokens:** `--success`, `--warning`, `--destructive`, `--background`, `--card`, `--muted`, `--border`.
- **Zero Raw Tailwind Palette Colors:** All raw color classes (`bg-blue-*`, `text-red-*`, `bg-emerald-*`) eliminated in favor of semantic token utility classes.
- **Unified Corner Radius:** Consistent `rounded-xl` token for all Cards, Buttons, Inputs, Dialogs, Selects, and Dropdowns (`rounded-full` reserved for avatars and status pills).

### 2. Cryptographic Route Security (`src/proxy.ts`)
- Edge-compatible Next.js 16 proxy middleware inspecting `accessToken` and `refreshToken` cookies.
- **Signature Verification:** Uses `jose` with `jwtVerify` and `HS256` against `JWT_ACCESS_SECRET`.
- **Role Isolation:** Verifies role-based access rules for `/dashboard/admin/*`, `/dashboard/landlord/*`, and `/dashboard/tenant/*`. Invalid or manipulated tokens are instantly cleared and redirected to `/auth/login?returnTo=...`.

### 3. Unified Data Table (`DataTable`)
- Powered by `@tanstack/react-table` in `src/components/ui/data-table.tsx`.
- Single reusable table component serving every tabular view across Admin, Landlord, and Tenant portals.
- Supports client/server sorting, fuzzy search filtering, status facets, pagination, and dropdown row actions (View, Edit, Ban, Moderate, Delete).

### 4. Direct Cloudinary Uploads (`ImageUploader`)
- Signed directly from the backend via `POST /api/uploads/sign`.
- Strict 2MB image limit, client-side format validation (JPEG, PNG, WebP), upload progress feedback, and manual URL input fallback.

### 5. Server-Backed Wishlist (`useFavorites`)
- Replaces legacy local storage hooks with TanStack Query hooks (`useFavorites`, `useAddFavorite`, `useRemoveFavorite`).
- Automated one-time migration of existing `rentnest_wishlist` items on first tenant login.
- Status badge indicators for favorited properties (e.g. `AVAILABLE`, `RENTED`).
- Heart actions automatically suppressed for Landlords and Admins.

### 6. AI Property Assistant (Gemini)
- Integrated in `src/app/api/assistant/route.ts` with per-IP rate limiting (10 req/min).
- Natural language query extraction into validated search filter JSON via Zod (`search`, `minPrice`, `maxPrice`, `bedrooms`).
- Queries the real `/api/properties` endpoint with extracted parameters and streams live property cards into the interactive chat `Sheet`.
- Clean fallback: If `GEMINI_API_KEY` is omitted, the assistant trigger button is cleanly hidden with zero client console errors.

### 7. Performance & SEO
- **Zero Raw `<img>`:** All media rendered via `next/image` with responsive `sizes`, `fill` or explicit dimensions, and priority loading on above-the-fold hero elements.
- **Dynamic SEO:**
  - `src/app/sitemap.ts`: Dynamic sitemap generated for all static pages, blog articles, and active properties.
  - `src/app/robots.ts`: Crawling rules protecting private dashboard routes.
  - JSON-LD Structured Data: `Residence` and `Offer` schema on property detail pages; `WebSite` search schema on home page.
  - Skip-to-content accessibility link and full ARIA keyboard navigation.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.2.12 (App Router with Turbopack)
- **Library:** React 19.2.8 & React DOM 19.2.8
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS v4, PostCSS, Class Variance Authority (`cva`), `tailwind-merge`
- **Component Primitives:** Radix UI (`@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-accordion`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-popover`)
- **State & Data Fetching:** TanStack React Query v5, TanStack Table v8
- **Forms & Validation:** React Hook Form v7, Zod v4, `@hookform/resolvers`
- **Security & JWT:** `jose` (HS256 cryptographic verification)
- **Charts:** Recharts v3 (Dynamic SSR-safe code-splitting)
- **Icons & Animation:** Lucide React, DotLottie (`@lottiefiles/dotlottie-react`)
- **Notifications:** Sonner Toast

---

## 📦 Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/rhmunna143/rent-nest-frontend.git
cd rent-nest-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:

```env
# Client API Route Base (Proxied through Next.js rewrites)
NEXT_PUBLIC_API_BASE_URL=/api

# Live Backend Origin
API_ORIGIN=http://localhost:8080

# Secret for cryptographic token verification (must match backend)
JWT_ACCESS_SECRET=jask-rthtrhijibigjjrlertnu5y785hfgyugwrt6ggfst3r4rtfrdsfgshyreyryrgdy==vvv

# Seeded Demo Login Visibility
NEXT_PUBLIC_ENABLE_DEMO_LOGIN=true

# Optional: Google Gemini API key for AI Assistant
GEMINI_API_KEY=
```

### 4. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Quality Assurance & Build Commands

All code must pass strict quality checks:

```bash
# 1. TypeScript Verification (0 errors)
npm run typecheck

# 2. ESLint Validation (0 warnings, 0 errors)
npm run lint

# 3. Next.js Production Build (exits code 0)
npm run build
```

---

## 📄 License

This project is licensed under the ISC License.
