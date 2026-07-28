# PRD — RentNest Frontend
**Find & List Rental Properties with Ease**

| | |
|---|---|
| **Owner** | Rimo (Frontend Engineer) |
| **Status** | Draft v1.1 — phased for agentic implementation |
| **Type** | Frontend-only (Next.js) consuming an existing REST API |
| **Backend Base URL (prod)** | `https://rent-nest-backend-eight.vercel.app` |
| **Backend Base URL (dev)** | `http://localhost:8080` |

---

## 1. Summary

RentNest is a rental property marketplace with three roles — **Tenant**, **Landlord**, **Admin** — sharing one Next.js (App Router) frontend. Tenants browse and rent properties and pay via Stripe Checkout; landlords list and manage properties and approve/reject requests; admins moderate users, listings, and categories. This document defines the frontend scope, routes, data contracts (from the backend Postman collection), UI/UX requirements, and a **phased implementation plan** intended to be executed by an agentic coding tool (Antigravity), one phase at a time, with review gates between phases.

## 2. Goals

- Ship a fast, accessible, responsive marketplace UI (public browsing + 3 protected dashboards) on top of the existing API.
- Make role-based access airtight via Next.js Middleware — no client-only gating.
- Provide a trustworthy payment experience (Stripe Checkout redirect + success/cancel states) with correct status-driven UI at every step of the rental lifecycle.
- Keep the codebase DRY: one API client, shared Zod schemas, shared status-badge/table/form primitives reused across all three dashboards.
- Build in independently shippable, independently reviewable phases so an agent's output can be checked before the next phase begins.

## 3. Non-Goals

- No backend/API changes — the Postman collection is treated as a fixed contract.
- No native mobile app.
- No multi-currency / multi-language support in v1.
- No in-app messaging between tenant and landlord (only the request `message` field).

## 4. Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **UI:** Tailwind CSS (Shadcn UI, DaisyUI, or custom components allowed)
- **Forms/Validation:** React Hook Form + Zod
- **Data fetching:** Fetch, with TanStack Query (React Query) or SWR for server state
- **Auth:** Auth.js or custom JWT Middleware for protected routes
- **Payments:** Stripe.js or SSLCommerz JS (frontend gateway integration)
- **Deployment:** Vercel

---

## 5. Roles & Access Control

| Role | Summary | Protected Areas |
|---|---|---|
| **TENANT** | Browses, requests rentals, pays, reviews | `/dashboard/tenant/**` |
| **LANDLORD** | Lists properties, manages requests | `/dashboard/landlord/**` |
| **ADMIN** | Moderates users/categories/platform | `/dashboard/admin/**` |

- Role is chosen at registration (`TENANT` or `LANDLORD` only — `ADMIN` is not self-serve; seeded credential `admin@rentnest.com` / `admin123`).
- Auth is **httpOnly cookie based** (`accessToken` / `refreshToken` set by the backend on register/login); a Bearer-token fallback exists but the frontend should rely on cookies and let the browser forward them automatically.
- **Next.js Middleware** must:
  - Redirect unauthenticated users away from any `/dashboard/**` route to `/auth/login`.
  - Redirect authenticated users to the correct dashboard if they hit another role's dashboard (403 page or redirect to their own dashboard).
  - Attempt a silent `POST /api/auth/refresh-token` on expired access token before forcing logout.
- Client UI (nav links, buttons, forms) must also hide role-inappropriate actions — middleware is the source of truth, client hiding is UX polish only.

---

## 6. Information Architecture / Routes

| Route | Purpose | Primary API Calls | Access | Phase |
|---|---|---|---|---|
| `/` | Home, featured properties | `GET /api/properties` | Public | 1 |
| `/properties` | Browse + filter | `GET /api/properties`, `GET /api/categories` | Public | 1 |
| `/properties/[id]` | Details + gallery + "Request to Rent" CTA | `GET /api/properties/:id` | Public | 1 |
| `/auth/register` | Role selection + registration | `POST /api/auth/register` | Public | 0 |
| `/auth/login` | Login | `POST /api/auth/login` | Public | 0 |
| `/account` | Shared profile settings | `GET/PATCH /api/auth/me` | Any authenticated | 0 |
| `/dashboard/tenant` | Request history, payments, reviews | `GET /api/rentals`, `GET /api/payments` | Tenant | 2 |
| `/dashboard/tenant/requests/[id]` | Single request detail | `GET /api/rentals/:id` | Tenant | 2 |
| `/dashboard/tenant/requests/[id]/pay` | Payment initiation | `POST /api/payments/create` | Tenant | 3 |
| `/payment/success` | Stripe return (success) | reads query params, reconciles via `GET /api/payments` | Tenant | 3 |
| `/payment/cancel` | Stripe return (cancel) | UI only | Tenant | 3 |
| `/dashboard/landlord` | Overview: properties, active requests, earnings | `GET /api/landlord/properties`, `GET /api/landlord/requests` | Landlord | 4 |
| `/dashboard/landlord/properties` | Property list (all statuses) | `GET /api/landlord/properties` | Landlord | 4 |
| `/dashboard/landlord/properties/new` | Create property | `POST /api/landlord/properties` | Landlord | 4 |
| `/dashboard/landlord/properties/[id]/edit` | Edit / delete / toggle availability | `PUT/DELETE /api/landlord/properties/:id` | Landlord | 4 |
| `/dashboard/landlord/requests` | Approve/reject incoming requests | `GET /api/landlord/requests`, `PATCH /api/landlord/requests/:id` | Landlord | 4 |
| `/dashboard/admin` | Platform overview | `GET /api/admin/users` + aggregates | Admin | 6 |
| `/dashboard/admin/users` | User table, ban/unban | `GET /api/admin/users`, `PATCH /api/admin/users/:id` | Admin | 6 |
| `/dashboard/admin/categories` | Category CRUD | `GET/POST/PUT/DELETE .../categories` | Admin | 6 |
| `/dashboard/admin/properties` & `/requests` | Cross-platform moderation views | `GET /api/properties`, rentals data (read-only) | Admin | 6 |

---

## 7. API Contract Reference (from Postman collection)

**Envelope:** success → `{ success, message, data, meta? }`; error → `{ success, message, errorDetails }`. The frontend API client must normalize both shapes into a single typed result.

### Auth (`/api/auth`)
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/auth/register` | Public | `role`: `TENANT` \| `LANDLORD` only |
| POST | `/auth/login` | Public | Sets cookies, returns tokens |
| GET | `/auth/me` | Authenticated | Current profile |
| PATCH | `/auth/me` | Authenticated | Partial update: name, phone, profileImage, password |
| POST | `/auth/refresh-token` | Public (cookie or body) | Silent refresh |
| POST | `/auth/logout` | Authenticated | Clears cookies |

### Properties (`/api/properties`, `/api/landlord/properties`)
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/properties` | Public | Filters: `location, search, categoryId, minPrice, maxPrice, bedrooms, page, limit, sortBy, sortOrder`; only `AVAILABLE`; paginated via `meta` |
| GET | `/properties/:id` | Public | Includes category, landlord, reviews, `averageRating` |
| GET | `/landlord/properties` | Landlord | Own listings, all statuses |
| POST | `/landlord/properties` | Landlord | Body: title, description, location, rentAmount, bedrooms, bathrooms, amenities[], images[], categoryId |
| PUT | `/landlord/properties/:id` | Landlord (own) | Partial update incl. `status`: `AVAILABLE \| RENTED \| UNAVAILABLE` |
| DELETE | `/landlord/properties/:id` | Landlord (own) | 409 if a rental is `ACTIVE` |

### Categories (`/api/categories`, `/api/admin/categories`)
| Method | Path | Access | Notes |
|---|---|---|---|
| GET | `/categories` | Public | Includes property counts |
| POST | `/admin/categories` | Admin | 409 on duplicate name |
| PUT | `/admin/categories/:id` | Admin | |
| DELETE | `/admin/categories/:id` | Admin | 409 if properties reference it |

### Rental Requests (`/api/rentals`, `/api/landlord/requests`)
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/rentals` | Tenant | Property must be `AVAILABLE`; 409 on duplicate pending request; `message`/`moveInDate` optional |
| GET | `/rentals` | Tenant | Own history; filter by `status`; includes property + payment summary |
| GET | `/rentals/:id` | Tenant (own) | Includes full payment record |
| GET | `/landlord/requests` | Landlord | Requests on own properties, incl. tenant contact info; filter by `status` |
| PATCH | `/landlord/requests/:id` | Landlord (own property) | `APPROVED`/`REJECTED` only from `PENDING`; `COMPLETED` only from `ACTIVE` (frees property); `ACTIVE` is webhook-only |

**Status lifecycle:** `PENDING → APPROVED → (payment) → ACTIVE → COMPLETED`, or `PENDING → REJECTED`.

### Payments (`/api/payments`)
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/payments/create` | Tenant (own request, `APPROVED`) | Returns `checkoutUrl`; 409 if already paid; test card `4242 4242 4242 4242` |
| GET | `/payments` | Tenant | Own history; status `PENDING \| COMPLETED \| FAILED` + transaction id |
| GET | `/payments/:id` | Tenant (own) | |
| POST | `/payments/webhook` | Stripe → backend only | Not called by frontend. On `checkout.session.completed`: payment → `COMPLETED`, rental → `ACTIVE`, property → `RENTED`, other pending requests on that property → `REJECTED`. |

### Reviews (`/api/reviews`)
| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/reviews` | Tenant (own rental, `COMPLETED`) | `rating` 1–5 int; one review per rental (409 on duplicate); shown on property detail via `averageRating` |

---

## 8. Implementation Phases

Each phase is intended to be a self-contained agentic build task with its own review gate before the next phase starts. Later phases assume earlier phases are merged and working.

### Phase 0 — Foundations
**Depends on:** nothing
**Build:**
- Project scaffold (Next.js App Router + TypeScript + Tailwind), env config for backend base URL.
- Central typed API client: cookie-credentialed fetch wrapper, response-envelope normalizer, 401 → refresh-then-retry-once → logout.
- Shared Zod schema library (auth, property, rental, review) reused across all forms.
- Shared UI primitives: `StatusBadge`, `DataTable`, `ConfirmDialog`, toast setup.
- `/auth/register`, `/auth/login`, `/account` (profile view/edit).
- Next.js Middleware for route protection and role-based redirects (§5).
**Phase acceptance criteria:**
- [ ] Register/login work against the real API and set/refresh cookies correctly.
- [ ] Middleware blocks unauthenticated and wrong-role access to every `/dashboard/**` path (even though those pages don't exist yet, the guard logic is testable via placeholder routes).
- [ ] API client handles success/error envelope, 401 refresh, and surfaces typed errors.

### Phase 1 — Public Marketplace
**Depends on:** Phase 0 (API client)
**Build:**
- `/` featured properties.
- `/properties` with filter bar/sidebar (location, price range, category, bedrooms) synced to URL query params, pagination via `meta`, skeleton loaders, `error.tsx`.
- `/properties/[id]`: gallery, description, amenities, landlord card, reviews + `averageRating`, "Request to Rent" CTA (prompts login if unauthenticated).
**Phase acceptance criteria:**
- [ ] Filters map correctly to all documented query params and update the URL.
- [ ] Loading and error states present on both list and detail views.
- [ ] Unauthenticated CTA correctly redirects to login and returns the user afterward.

### Phase 2 — Tenant Core
**Depends on:** Phase 0, 1
**Build:**
- Rental request modal/form (Zod-validated `moveInDate` + optional `message`), success/409-duplicate toast handling.
- `/dashboard/tenant`: request list with `StatusBadge`, payment history table.
- `/dashboard/tenant/requests/[id]` detail view.
**Phase acceptance criteria:**
- [ ] Request submission handles the `AVAILABLE`-only and duplicate-pending (409) backend rules with clear messaging.
- [ ] Status badges match §9 exactly for all five statuses.
- [ ] Tenant dashboard correctly scopes to the logged-in tenant's own data only.

### Phase 3 — Payments
**Depends on:** Phase 2
**Build:**
- `/dashboard/tenant/requests/[id]/pay`: calls `POST /payments/create`, redirects to Stripe `checkoutUrl`.
- `/payment/success`: reconciles actual status via `GET /api/payments` (don't trust query params alone, since the webhook may lag); polling/retry UI while pending.
- `/payment/cancel`: clear "you can try again" UI, link back to the request.
**Phase acceptance criteria:**
- [ ] "Pay Now" only appears on `APPROVED` requests and is disabled once already paid (409 handled gracefully).
- [ ] Success page never shows a false "paid" state — it waits for/polls confirmed payment status.
- [ ] Full lifecycle testable end-to-end with Stripe test card `4242 4242 4242 4242`.

### Phase 4 — Landlord
**Depends on:** Phase 0 (Phase 1 patterns reusable, not blocking)
**Build:**
- `/dashboard/landlord` overview (counts from `GET /api/landlord/properties` + `/api/landlord/requests`).
- Property CRUD: `/dashboard/landlord/properties`, `/new`, `/[id]/edit` (create/edit/delete, availability toggle, confirm dialog, 409 "active rental" messaging on delete).
- `/dashboard/landlord/requests`: Approve/Reject with optimistic UI + rollback on failure, "Complete" action once `ACTIVE`.
**Phase acceptance criteria:**
- [ ] Property forms validate all required fields (title, description, location, rentAmount, bedrooms, bathrooms, amenities, images, categoryId) via shared Zod schema.
- [ ] Approve/Reject only enabled from `PENDING`; Complete only enabled from `ACTIVE`; UI reflects backend's state-machine rules without a full page reload.
- [ ] Delete blocked with a clear message when a rental is `ACTIVE` (409).

### Phase 5 — Reviews
**Depends on:** Phase 2, 3 (needs `COMPLETED` rentals to exist)
**Build:**
- Review form (1–5 star rating + comment) on `COMPLETED` rentals in the tenant dashboard.
- Duplicate-review prevention (client-side disable + 409 handling).
- Review + `averageRating` display wired into the Phase 1 property detail page.
**Phase acceptance criteria:**
- [ ] Review only submittable on `COMPLETED` rentals without an existing review.
- [ ] Property detail page reflects new reviews and updated `averageRating` after submission.

### Phase 6 — Admin
**Depends on:** Phase 0; category CRUD has no other dependency, user/moderation views depend on backend confirming endpoints (§11)
**Build:**
- `/dashboard/admin/categories`: full CRUD against `/api/admin/categories`, duplicate-name and in-use-delete errors surfaced.
- `/dashboard/admin` overview: aggregate counts (client-computed if no summary endpoint).
- `/dashboard/admin/users`: table with search, pagination, ban/unban — **build only once backend confirms the endpoint** (not in current Postman collection).
- `/dashboard/admin/properties` & `/requests`: read-only cross-platform moderation views.
**Phase acceptance criteria:**
- [ ] Category CRUD fully functional and covers both error cases (409 duplicate, 409 in-use).
- [ ] Admin dashboard and user management ship only after §11 open questions are resolved; category CRUD may ship independently in the meantime.

---

## 9. Shared UI Conventions

**Rental status badges**
| Status | Badge | Extra UI |
|---|---|---|
| `PENDING` | Yellow/Orange | — |
| `APPROVED` | Blue | "Pay Now" button |
| `REJECTED` | Red | — |
| `ACTIVE` | Green | "Leave Review" button |
| `COMPLETED` | Gray | Review shown if left |

**Property status:** `AVAILABLE` / `RENTED` / `UNAVAILABLE` — badge + toggle in landlord property list.
**Payment status:** `PENDING` / `COMPLETED` / `FAILED` — badge in tenant payment history.

**Cross-cutting patterns**
- Skeleton loaders for all list/detail fetches; typed `error.tsx` boundaries per route segment.
- Toast notifications for every mutation (create/update/delete/approve/reject/ban).
- Optimistic updates for landlord request approve/reject and admin ban/unban, with rollback on failure.
- All forms: React Hook Form + Zod resolver, disabled submit + spinner while in-flight, field-level errors.
- One central typed API client (base URL from env, cookie credentials included, 401 → refresh-then-retry-once → logout).

---

## 10. Non-Functional Requirements

- **Performance:** route-level code splitting (App Router default), `next/image` for all property/gallery images, pagination over large lists (never unbounded fetch).
- **Accessibility:** semantic HTML, keyboard-navigable modals/menus, labeled form fields, color-contrast-safe status badges (not color-only — include text/icon).
- **Security:** rely on httpOnly cookies (no tokens in localStorage); never expose Stripe secret keys client-side (only the returned `checkoutUrl` is used); role checks enforced in Middleware, not just components.
- **Resilience:** handle 401 (refresh/redirect), 403 (friendly "not allowed" page), 404, and 409 (business-rule conflicts: duplicate request, already paid, category in use, active rental) with specific, human-readable messaging — not generic error dumps.
- **Code quality:** DRY — shared Zod schemas between register/login/property/rental forms where fields overlap; shared `<StatusBadge>`, `<DataTable>`, `<ConfirmDialog>` components reused across all three dashboards and all phases.

---

## 11. Open Questions / Risks

1. **Admin endpoints:** ban/unban and platform-wide aggregate/moderation endpoints are referenced in the requirements doc but not present in the current Postman collection — needs confirmation from backend before Phase 6 user management work begins.
2. **Landlord earnings figure:** no dedicated "earnings" endpoint in the collection — confirm whether it's computed client-side from payments tied to the landlord's properties, or backend will add a summary endpoint (affects Phase 4).
3. **Payment gateway:** requirements doc mentions Stripe *or* SSLCommerz; Postman collection only documents Stripe — SSLCommerz is out of scope for Phase 3 unless confirmed otherwise.
4. **Webhook timing:** `/payment/success` may load before the Stripe webhook has processed — Phase 3 must include a polling/refresh strategy so the UI doesn't show stale `APPROVED` status.
5. **Image uploads:** current API accepts image **URLs**, not file uploads — confirm whether a hosting step (e.g., ImgBB, as seen in the register example) is expected client-side for Phase 4, or URLs are pasted manually.

---

## 12. Overall Acceptance Criteria (v1 Definition of Done)

- [ ] Phases 0–5 complete and merged (Tenant + Landlord flows fully functional end-to-end).
- [ ] Phase 6 category CRUD complete; user management/moderation shipped once §11.1 is resolved.
- [ ] All routes in §6 implemented and protected per §5 via Middleware.
- [ ] Tenant can register, log in, submit a rental request, pay via Stripe test card, and see status update through `PENDING → APPROVED → ACTIVE → COMPLETED`.
- [ ] Landlord can create/edit/delete properties and approve/reject requests with optimistic UI + toasts.
- [ ] All list/detail views have loading skeletons and error boundaries.
- [ ] All forms are Zod-validated with inline errors.
- [ ] No token/secret ever stored in localStorage or exposed client-side beyond what the API already returns.
