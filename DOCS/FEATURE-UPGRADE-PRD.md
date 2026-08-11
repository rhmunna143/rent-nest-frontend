# FEATURE-UPGRADE-PRD.md
**RentNest — Squid Game-7 "Project Update-1" Upgrade**
Draft v1.0 · Owner: Munna (Frontend) · Author: Rimo

---

## 1. Purpose

RentNest (frontend: `rent-nest-frontend`, backend: `rent-nest-backend`, live at `rent-nest-frontend-sigma.vercel.app`) is a **shipped** rental marketplace covering public browsing, tenant requests/payments/reviews, landlord property + request management, and an admin category/analytics dashboard.

The attached **Squid Game-7 Project Update-1** brief asks every team to upgrade an existing project into a "feature-rich, production-ready, professional application" against a fixed rubric (design system, listing/detail UX, auth, role-based dashboards, additional pages, forms, backend hygiene, code quality, submission checklist).

This document is **not a rewrite of the original PRD** — it is a **gap-closing upgrade PRD**. It:
1. Maps every rubric item to RentNest's current state (`Met` / `Partial` / `Gap`).
2. Where a rubric item doesn't fit RentNest's domain (rental marketplace) or is blocked by backend limitations, proposes a **unique substitute feature** that satisfies the spirit of the rubric in a way that's native to RentNest, rather than bolting on a generic clone of the example.
3. Organizes remediation into dependency-ordered phases for agentic implementation via **Antigravity**, each with its own acceptance gate — same discipline as the original `PRD.md`.

## 2. Scope & Ground Rules

- **Frontend-only**, same as before. Where a gap requires a new backend endpoint, it is listed under **Backend Asks** (§6) and the phase is marked `blocked-until-backend` rather than silently building fake data.
- No dummy/lorem-ipsum content anywhere — including new pages (Blog, About, Contact).
- DRY: shared primitives (card shell, form field, skeleton, badge, empty-state) get built once in `/components/shared` in Phase U0 and reused everywhere, rather than re-implemented per page.
- Every phase ends with its own testable acceptance criteria; a phase cannot start until its dependencies are marked done.
- Source documents: `RentNest-Frontend-requirement-instructions.md` (original brief), `rent-nest-backend.postman_collection.json` (API contract), existing `PRD.md`, live repo `github.com/rhmunna143/rent-nest-frontend`, and `Project_1_Upgrade_TR.pdf` (this upgrade's rubric).

## 3. Current State Snapshot (from repo + README)

Already shipped and reusable as-is:
- Public marketplace: home page with animated hero, property grid, filters (price/category/bedrooms), property details with gallery, landlord info, reviews, "Request to Rent".
- Tenant: request flow, Stripe Checkout, `/payment/success` with polling-based webhook verification, `/payment/cancel`, request history with status badges, review submission.
- Landlord: property CRUD, status toggles, request approve/reject with optimistic UI.
- Admin: category CRUD, recharts-based overview (active properties, category distribution).
- Infra: Next.js 15 App Router, TypeScript, Tailwind v4 + Shadcn, React Hook Form + Zod, middleware-based RBAC, responsive dashboard shell (sidebar → Sheet drawer on mobile).

This is a strong base — the upgrade work below is genuinely incremental, not a rebuild.

## 4. Rubric Gap Analysis

Legend: ✅ Met · 🟡 Partial (exists but doesn't meet the rubric's specifics) · 🔴 Gap (not present) · 🔁 Substituted (rubric item swapped for a native alternative)

### 4.1 Global UI & Design Rules
| Rubric item | Status | Notes / Action |
|---|---|---|
| Max 3 primary colors + neutral | 🟡 | Audit current palette; consolidate into a documented token set (Phase U0). |
| Light & Dark mode, proper contrast | 🟡 | Dark mode exists via Shadcn/Tailwind defaults but hasn't been contrast-audited on charts, badges, gradients. |
| Consistent card/spacing system | 🟡 | Property cards are consistent; dashboard cards, blog cards (new), and admin cards need to share one `<Card>` primitive. |
| Forms: validation, error, success, loaders | 🟡 | Zod + RHF already standard; success states and button loading spinners are inconsistent across forms — standardize in Phase U0. |
| No placeholder/dummy content | ✅ | Maintain for all new pages. |

### 4.2 Home / Landing Page
| Rubric item | Status | Notes |
|---|---|---|
| Navbar: 4+ routes logged-out, 6+ logged-in, sticky, dropdown | 🟡 | Confirm logged-in nav count reaches 6 (Home, Properties, Dashboard, Blog, Profile dropdown, Logout) — Blog is new (§4.7). |
| Hero 60–70vh, interactive, clear flow | ✅ | Existing Lottie/animated hero qualifies; verify height clamp. |
| 8+ meaningful sections | 🟡 | Likely short of 8. Add: Categories, Featured Properties, How It Works, Stats (exists), Testimonials, Why RentNest, Blog Preview, Newsletter, CTA — pick 8. |
| Functional footer w/ working links + contact/social | 🟡 | Audit for dead links; wire to real About/Contact/Blog/Privacy pages once built. |

### 4.3 Core Listing / Card Section
| Rubric item | Status | Notes |
|---|---|---|
| Image, title, description, meta, "View Details" | ✅ | Property card already covers this. |
| Uniform size/radius/layout, 3+ per row desktop | ✅ | Confirm 3-column breakpoint explicitly (`xl:grid-cols-3`). |
| Skeleton loader | 🟡 | Confirm present on `/properties`, home featured grid, and dashboard tables uniformly — unify into one `<CardSkeleton>`. |

### 4.4 Details Page
| Rubric item | Status | Notes |
|---|---|---|
| Public access, multi-image gallery | ✅ | Exists. |
| Description/Overview section | ✅ | Exists. |
| Key info / specifications section | 🟡 | Bedrooms/bathrooms/amenities exist inline; formalize as a distinct "Specifications" block. |
| Reviews/ratings section | ✅ | Exists with `averageRating`. |
| Related items | 🔴 | **Gap.** Add "Similar Properties" (same category or location, excluding current) using `GET /api/properties?categoryId=...` — pure frontend composition, no backend change. |

### 4.5 Listing / Explore Page
| Rubric item | Status | Notes |
|---|---|---|
| Search bar | 🟡 | Confirm `search` query param is wired to a visible search input (API supports it). |
| Filtering, 2+ fields | ✅ | location, categoryId, minPrice/maxPrice, bedrooms all supported by the API. |
| Sorting | 🟡 | API supports `sortBy`/`sortOrder`; confirm UI control exists. |
| Pagination or infinite scroll | 🟡 | API returns `meta` pagination; confirm UI pager/infinite-scroll is implemented, not just fetched-and-ignored. |

### 4.6 Authentication System
| Rubric item | Status | Notes |
|---|---|---|
| Login/Register pages | ✅ | Exists, role selection included. |
| Demo login button (auto-fill) | 🔴 | **Gap, easy win.** Add "Try as Tenant / Landlord / Admin" buttons that pre-fill seeded demo credentials (admin already documented; add seeded tenant/landlord demo accounts). |
| Social login (Google/Facebook) | 🔁 | **Substituted.** Backend (`rent-nest-backend`) only exposes email/password JWT auth — no OAuth endpoint exists in the Postman collection. Real Google/Facebook login would require a new backend flow (out of frontend scope) and is tracked as a **Backend Ask** (§6). Until/unless the backend adds it, the equivalent rubric slot is filled by the **Demo Login** buttons above plus a **"Saved Properties / Wishlist"** feature (see §4.9) — a genuinely useful, frontend-buildable feature that raises the auth section's perceived polish without faking a non-functional "Sign in with Google" button. |
| Clean, professional UI | ✅ | Existing forms qualify; apply Phase U0 form-state standard. |

### 4.7 Dashboard (Role-Based)
| Rubric item | Status | Notes |
|---|---|---|
| Sidebar: User ≥4 items, Admin ≥6 items | 🟡 | Tenant/Landlord likely at 4 (Overview, Requests/Properties, Payments/Requests, Profile) — confirm. Admin needs 6: Overview, Categories, **Moderation** (new, see §4.9), Analytics, **Users** (see §4.9 substitute), Settings. |
| Profile dropdown in dashboard navbar | 🟡 | Confirm present in all three dashboards, not just one. |
| Overview cards | ✅ | Exists for landlord/admin; confirm tenant overview has them too. |
| Charts (Bar/Line/Pie) with real dynamic data | 🟡 | Admin has bar-ish charts today. **Backend constraint:** admin has no platform-wide `properties`/`rentals`/`payments` endpoint — only `categories` (with counts) is global; landlord/tenant data is scope-limited to the logged-in user. So genuinely platform-wide charts (e.g., total bookings over time) need a new backend endpoint — tracked in §6. In the meantime, build what real data supports: **Bar** = properties per category (public categories endpoint), **Pie** = category share of total listings, **Line** = landlord's own request volume over time (available today per-landlord). Do not fabricate platform-wide numbers. |
| Data tables | ✅ | Landlord requests table, tenant history table exist. |
| Profile page, editable | ✅ | `PATCH /api/auth/me` supports this already. |
| Table filtering + pagination | 🟡 | Status filters exist server-side (`?status=`); confirm client pagination/search-within-table for larger datasets. |

### 4.8 Additional Pages
| Rubric item | Status | Notes |
|---|---|---|
| 2–3 extra pages (About/Contact/Blog/Help/Privacy) | 🔴 | **Gap.** Build: **About**, **Contact** (real form, see §4.10), and **Rental Guides** (blog — see §4.9 for why this is the chosen "unique" one over a generic blog), plus a lightweight **Privacy/Terms** page for footer-link completeness. |

### 4.9 Unique Feature Substitutions

Two rubric items don't map cleanly onto RentNest's actual backend capabilities. Rather than fake them, they're replaced with features that are (a) native to a rental marketplace, and (b) fully buildable against the existing API:

1. **Social Login → Saved Properties / Wishlist.**
   Tenants can heart a property from the grid or details page. Persisted via `localStorage` (namespaced per logged-in user id) in v1 since there's no `/api/favorites` endpoint; flagged in §6 as a nice-to-have backend addition for cross-device sync in v2. Surfaced as a new "Saved" tab in the tenant dashboard.

2. **Admin "Ban/Unban Users" → Content Moderation Queue.**
   The Postman collection has **no** admin user-management endpoint (only `admin/categories` CRUD exists) — this was already flagged as an open question in the original PRD and remains unresolved. Rather than block the whole Admin Upgrade phase on a backend endpoint that may not land, Admin gets a **Moderation Queue** built from data the API already exposes at platform scope: newly created categories, and (once the backend ask in §6 is fulfilled) a cross-landlord properties feed for spotting listings that need review. If/when the backend adds `PATCH /api/admin/users/:id/ban`, the User Management table from the original rubric gets built as an additive Phase U4b — this doc will not block on it.

3. **Blog → "Rental Living Guides."**
   Instead of a generic blog, ship a small set of genuinely useful, statically-authored (MDX/JSON, no backend) articles aimed at RentNest's actual users: "A Tenant's Guide to the RentNest Request → Payment Flow," "Pricing Your Property as a Landlord," "Understanding Rental Statuses (Pending → Active → Completed)." This satisfies "no placeholder content" far better than lorem-ipsum blog posts, and doubles as in-product help content.

### 4.10 Forms Handling
| Form | Status | Notes |
|---|---|---|
| Login | ✅ | Add demo-login prefill (§4.6). |
| Registration | ✅ | — |
| Contact | 🔴 | **Gap.** New page + form (Zod-validated); since there's no backend `/contact` endpoint, submit via a serverless-friendly approach — e.g., `mailto:` fallback or a lightweight email API (Resend/Formspree) — flagged as an implementation choice, not a backend blocker. |
| Create/Edit property | ✅ | Exists (landlord). |
| Profile update | ✅ | Exists. |

All forms get the Phase U0 standard: inline Zod errors, disabled+spinner submit state, success toast, accessible `<label htmlFor>` bindings.

### 4.11 Backend Requirements (§11 of the rubric)
Out of frontend scope by project rule — `rent-nest-backend` already satisfies the architecture (Express-style layering, JWT, RBAC, bcrypt, CORS) per the existing Postman collection description. This upgrade does not touch backend code; gaps discovered here are logged as **Backend Asks** (§6) for the backend engineer, not silently worked around with mock data.

### 4.12 Code Quality & Submission
Handled procedurally in Phase U7 (§5) rather than per-feature: lint pass, no `console.log`, env var audit, README refresh, demo credentials confirmed for all three roles (tenant/landlord demo accounts currently undocumented — need seeding), live URL + both repo links.

---

## 5. Phased Implementation Plan (Antigravity-ready)

Each phase lists **Depends on**, **Scope**, and an **Acceptance Gate**. Work strictly in order; a phase's gate must pass before the next starts.

### Phase U0 — Design System & Shared Primitives
**Depends on:** none.
**Scope:** Define the 3-color + neutral token set (light/dark) in Tailwind config; build/consolidate shared `Card`, `Skeleton`, `Badge`, `FormField`, `SubmitButton` (loading state), `EmptyState`, and `Toast` usage conventions in `/components/shared`; contrast-audit dark mode.
**Acceptance Gate:** All existing pages still render correctly against the new tokens; no page uses a hard-coded color outside the token set; Storybook-less visual check across home, properties, dashboard in both themes.

### Phase U1 — Home & Marketing Upgrade
**Depends on:** U0.
**Scope:** Reach 8+ home sections; confirm/adjust hero height clamp; expand navbar route counts (logged-out ≥4, logged-in ≥6, incl. Blog); rebuild footer with working links to new pages (§U5).
**Acceptance Gate:** Navbar route counts verified per auth state; footer has zero dead links; hero measured within 60–70vh across breakpoints.

### Phase U2 — Listing, Filtering & Details Upgrade
**Depends on:** U0.
**Scope:** Wire visible search input to `search` param; add sort control (`sortBy`/`sortOrder`) to `/properties`; implement pagination UI (or infinite scroll) against `meta`; add "Specifications" section and "Similar Properties" (related items) to the details page.
**Acceptance Gate:** Changing search/filter/sort/page updates the grid and URL query state; details page shows related properties for every listing that has category peers.

### Phase U3 — Auth Upgrade
**Depends on:** U0.
**Scope:** Demo-login buttons (Tenant/Landlord/Admin) with seeded credentials; standardize form states per §4.10; ship the Wishlist substitute feature's auth-adjacent UI (heart icon, "Saved" tab shell — logic lands in U6).
**Acceptance Gate:** One click logs in as each of the three demo roles and lands on the correct dashboard; all auth forms show consistent loading/error/success states.

### Phase U4 — Dashboard Upgrade (Tenant / Landlord / Admin)
**Depends on:** U0, U2 (tenant "Saved" tab needs U6 data model decided first — see note).
**Scope:** Confirm/pad sidebar item counts (User ≥4, Admin ≥6, adding "Moderation" placeholder tab); profile dropdown in all three dashboard navbars; standardize overview cards; rebuild Admin charts to only use real, available data — Bar (properties per category), Pie (category share), Line (per-landlord request volume, or per-tenant payment history over time as an alternative if more broadly demoable); add client-side table filtering/pagination where lists can grow large.
**Acceptance Gate:** Every chart's data traces to a real API call (no mocked numbers); Admin sidebar has ≥6 working items; Tenant/Landlord sidebars have ≥4.

### Phase U5 — New Standalone Pages
**Depends on:** U0.
**Scope:** About, Contact (with working form per §4.10), Rental Living Guides (blog index + 3 articles minimum), Privacy/Terms. Link all from footer/nav.
**Acceptance Gate:** All four pages responsive, real content (no lorem ipsum), Contact form validates and submits successfully end-to-end.

### Phase U6 — Unique Feature Build-Out
**Depends on:** U3 (auth UI shell), U4 (dashboard tab shell).
**Scope:** Implement Wishlist/Saved Properties (localStorage-backed, per-user-id namespaced, heart toggle on card + details page, "Saved" dashboard tab); implement Admin Moderation Queue using currently-available data (categories, and cross-landlord properties once/if the backend ask lands).
**Acceptance Gate:** Saving/unsaving a property persists across reloads and is scoped to the logged-in user; Moderation Queue renders real records with zero mock data, clearly labeled as "pending backend expansion" where the platform-wide feed is limited.

### Phase U7 — QA, Responsiveness, Code Quality & Submission Prep
**Depends on:** U1–U6.
**Scope:** Full responsive pass (mobile/tablet/desktop) across every route touched above; lint + remove `console.log`s; `.env.example` audit; seed and document tenant/landlord demo credentials alongside the existing admin ones; refresh `README.md` with the upgraded feature list and both repo links.
**Acceptance Gate:** Rubric checklist (§4, this document) is fully ✅ or explicitly ✅-via-substitution or ✅-blocked-on-backend-ask; live URL, both repos, and all three demo credential sets are ready to submit.

---

## 6. Backend Asks (tracked, not blocking frontend work)

These would upgrade the "substituted" items from §4.9/§4.7 into the original rubric items if the backend engineer has bandwidth — none of them block the phases above, which are designed to ship real value without them:

1. `GET /api/admin/properties` and `GET /api/admin/rentals` (platform-wide, admin-only) — would unlock true platform-wide Admin charts and a real cross-landlord Moderation Queue.
2. `PATCH /api/admin/users/:id/ban` (and a `GET /api/admin/users` list) — would replace the Moderation Queue substitute with the original rubric's User Management table.
3. `POST /api/favorites` / `GET /api/favorites` — would upgrade Wishlist from localStorage-only to cross-device synced.
4. OAuth (Google) support on `/api/auth/*` — would replace the Demo Login + Wishlist substitution with real social login.
5. Seeded demo `TENANT` and `LANDLORD` accounts (admin's already seeded) — needed for Phase U3's demo-login buttons and Phase U7's submission credentials.

## 7. Open Questions Carried Over From Original PRD

- Landlord earnings aggregation approach (still unresolved — affects whether a genuine "earnings" line can be added to the Landlord Line chart in U4).
- Payment gateway is confirmed as Stripe (already live) — SSLCommerz is not in scope for this upgrade.
- Webhook timing on `/payment/success` is already solved via the polling strategy in the current build; no further action needed here.

## 8. Non-Goals

- No backend code changes as part of this upgrade (requests are logged in §6 only).
- No migration off Stripe.
- No redesign of already-rubric-compliant flows (payment, request approval) beyond the shared Phase U0 design-token pass.
