# PROJECT_UPGRADE.md — RentNest **Frontend**

| | |
|---|---|
| **Repo** | `rhmunna143/rent-nest-frontend` (Next.js 16 App Router · TypeScript · Tailwind v4 · Shadcn/Radix · RHF + Zod · TanStack Query · Recharts) |
| **Source rubric** | *ForegX Project Upgrade with AI instruction.pdf* |
| **Audit date** | 14 Nov 2026 |
| **Author** | Rimo (Frontend Eng.) — for Munna + Antigravity agent |
| **Pairs with** | `backend/PROJECT_UPGRADE.md` (phases **B0–B7**). Each frontend phase lists the backend phase it **requires**. |

> **Audit basis:** findings come from the files in the repo snapshot. 🔍 = could not be verified (file not in snapshot) — the agent must check first. Example: `/dashboard/admin/users` and `/dashboard/admin/moderation` are linked from the sidebar but their pages were not in the snapshot.

---

## 0. How to run this file with Antigravity

1. **One phase per session.** Paste the phase's *Agent Prompt*. The agent ticks boxes, runs the gate, shows evidence, **stops for approval**.
2. **Always-on rules**
   - **DRY first:** search for an existing component/hook/helper before writing one. Delete the duplicates listed in F0.
   - **No dummy content:** no lorem ipsum, no invented statistics, no `href="#"`, no "coming soon" buttons, no `setTimeout` fake API calls. If the backend can't provide data yet, the section is **hidden**, not faked (and logged as a Backend Ask).
   - Use design tokens only (see F0.1) — no raw palette classes such as `bg-blue-100`, `text-emerald-600`.
   - No `any`, no `console.*` (use `toast` / error boundaries), all forms: RHF + Zod + server-error mapping + loading + success.
   - Every data-fetching screen: loading skeleton + error state + empty state.
   - Conventional commits, one per task (`feat(home): …`, `fix(api-client): …`).
3. **Gate commands (every phase):** `npm run typecheck && npm run lint && npm run build`, then the manual checks in the gate (light **and** dark mode, 375 / 768 / 1280 px).

---

## 1. Compliance matrix — ForegX PDF vs current frontend

Legend: ✅ done · 🟡 partial · ❌ missing

| PDF § | Requirement | Status | Evidence / gap |
|---|---|:-:|---|
| 1 | ≤ 3 primary colors (+neutral) | 🟡 | 3 tokens exist (indigo/purple/rose) but JSX uses raw `blue/emerald/purple/green/red/yellow` and `hue-rotate` hacks everywhere |
| 1 | Light + Dark, proper contrast | 🟡 | `next-themes` ✅. Hard-coded light-only colors (`bg-green-50`, `bg-red-100`, `text-green-800`); `--card` = `--background` in dark; tenant payment badge uses `bg-accent-foreground text-accent-foreground` (**invisible text**); toggle ignores `system` |
| 1 | 4/8px spacing system | 🟡 | Mixed `px-2.5`, `py-1.5`, `h-125`, arbitrary values |
| 1 | Unified border-radius | ❌ | `rounded-md/lg/xl/2xl/full` mixed on same screens; Button `md`, Card `xl` |
| 1 | Typography scale | 🟡 | Ad-hoc `text-3xl/4xl/5xl` per page |
| 1 | Reusable: Button, Input, Card, Modal, Dropdown | ✅ | `ui/button, input, card, dialog, dropdown-menu` |
| 1 | Reusable: **Badge, Table** | ❌ | Only `status-badge`; every page hand-writes `<table>` |
| 1 | Responsive, no overflow, hamburger nav | 🟡 | Hamburger ✅; mobile account link points to `/account` (404); hero `h-screen` |
| 1 | Forms: validation/errors/success/loading/labels | 🟡 | RHF+Zod ✅. Server `errorDetails` only toasted (first one), never mapped to fields; some labels lack `htmlFor`; `*` shown on optional fields |
| 1 | Forms exist: Login, Register, Contact, Create, Edit, Profile | 🟡 | All exist; **Contact is fake** (`setTimeout` + `console.log`), Register lacks phone/image |
| 2 | Navbar full-width, sticky, ≥4 routes out / ≥6 in, dropdown | 🟡 | Sticky ✅, 5 routes out ✅, dropdown ✅; logged-in has **no top-level Dashboard link** (only in dropdown) |
| 2 | Hero 60–70 % viewport, CTA, interactive element | 🟡 | `h-screen` (100 %); Lottie only |
| 2 | ≥ 8 meaningful sections w/ **real data** | 🟡 | 10 sections but **Stats "10 000+ users / 5 000+ properties / 99 %" are invented**; no Categories, Testimonials, FAQ; copy claims features that don't exist ("100 % verified", "automated bank payouts") |
| 2 | Footer: working links, contact, social, © | 🟡 | Social links are `href="#"`; phone `1-800-555-0199` is a placeholder |
| 3 | Card: image, title, **short description**, meta, **"View Details" button** | ❌ | No description, no button (card is just a link) |
| 3 | Equal size cards, **4 per row desktop**, skeleton, backend data | 🟡 | Grid is 3-col; skeleton ✅; backend ✅; raw `<img>` instead of `next/image` |
| 4 | Public details page, **gallery/slider**, description, specs, reviews, related | 🟡 | Images stacked (no gallery/lightbox); CTA not disabled for `RENTED/UNAVAILABLE`; no `generateMetadata`; "Joined RentNest" is hard-coded |
| 5 | Search, ≥ 2 filters, sorting, pagination, **backend filtering** | 🟡 | All present **but** page re-filters client-side and **overwrites `meta.total`** (pagination wrong); `Status` filter is dead (API returns only AVAILABLE); no debounce (request per keystroke); no amenities filter |
| 6 | Login/Register, error handling, JWT, protected routes, role middleware | 🟡 | Works, but see security defects S1–S3 |
| 6 | **Password validation** | ❌ | `min(6)` only, no strength feedback |
| 6 | Demo login buttons | 🟡 | Landlord/Tenant demo accounts don't exist in DB (needs B1.8) |
| 6 | Token-expiry handling | 🟡 | Refresh flow exists but is **skipped on bootstrap** (S2) |
| 6 | Google login (bonus) | ❌ | Optional — F6 |
| 7 | User sidebar ≥ 4 · Admin sidebar ≥ 6 | 🟡 | Tenant 4 ✅ · Admin 5 + 2 pages 🔍 |
| 7 | Overview cards dynamic | 🟡 | Tenant/Landlord ✅ (client-computed); Admin: "Operational" is hard-coded; no user/revenue totals |
| 7 | Charts: bar + line + pie, **real data** | 🟡 | All three exist, but admin data = category counts only, and every chart uses `hsl(var(--x))` which is **invalid** with the current full-`hsl()` tokens (S5) |
| 7 | Data tables with pagination + filter + sort + actions (Edit/Delete/View) | ❌ | Landlord tables: no pagination/filter/sort; tenant: client pagination only; categories: none; no **View** action |
| 7 | Profile: editable, **image upload**, password update | 🟡 | Editable ✅; image is a URL input; password change has no confirmation |
| 8 | ≥ 3 additional pages | ✅ | About, Contact, Blog, Privacy, Terms |
| 8 | Contact: working form, **stored in DB**, validation, success | ❌ | Fake submit (needs B4) |
| 10 | Image optimisation, lazy load, code splitting | 🟡 | `next/image` used in only 2 places; Lottie ×4 loaded eagerly (remote); Recharts not code-split |
| 10 | Avoid re-renders; production build | 🟡 | `AuthContext` value not memoised; TanStack Query installed & provided but **unused** |
| 11 | Clean structure, reusable components, **custom hooks** | 🟡 | Only `useWishlist`; repeated fetch/try/catch/toast in ~12 pages |
| 11 | Env vars, **no console logs** | 🟡 | `console.log` in contact page; several `console.error`; README documents the wrong env var |
| 12 | **No localhost API refs in production** | ❌ | Fallback `http://localhost:8080/api` in `api-client.ts`, 4 server pages, `proxy.ts` |
| 13 | README / live link / repo | 🟡 | README stale (Next 15, `NEXT_PUBLIC_API_URL`, `yourusername` clone URL) |

---

## 2. Defects found during audit

### Security & auth
| ID | Sev. | Finding | Fix phase |
|---|:-:|---|:-:|
| S1 | 🔴 | **Route protection is spoofable.** `proxy.ts` trusts the client-writable `rn_role` cookie. Also the backend's `accessToken`/`refreshToken` cookies live on the **backend domain**, so the proxy never sees them (the "slow path" is dead code). Anyone can set `rn_role=ADMIN` and render admin pages (API stays protected, UI shell leaks). | F1 |
| S2 | 🔴 | `apiFetch` returns early on `skipAuthRedirect` **before** attempting refresh → when the 1-day access cookie expires, `AuthProvider` treats the user as logged out even though the refresh token is valid for 30+ days. | F0 |
| S3 | 🟠 | Cross-site cookies (`SameSite=None`) are blocked by Safari/ITP and Chrome's third-party cookie phase-out → login can silently fail on iOS. Fix by proxying `/api/*` through the Next.js domain (**rewrites**) so cookies become first-party. | F1 |
| S4 | 🟡 | `useWishlist` uses one global localStorage key → users share a wishlist per browser; stores stale property snapshots. | F6 |

### UI / logic
| ID | Sev. | Finding | Phase |
|---|:-:|---|:-:|
| S5 | 🟠 | Charts use `hsl(var(--muted))` / `hsl(var(--primary))`; tokens are already `hsl(...)` ⇒ invalid CSS ⇒ lines/grids don't render. Use `var(--primary)`. | F0 |
| S6 | 🟠 | `/properties` overwrites `meta.total` with the **current page's** length and re-applies filters client-side; "Status" filter never matches; min/max price push a URL on every keystroke. | F3 |
| S7 | 🟠 | `RentCTA`: labels say required (`*`) but schema optional; blank values are sent as `""` and the backend rejected them (backend D5); error text for 409 says "active request" (backend says *pending*); button enabled for non-available properties. | F3 |
| S8 | 🟠 | **Type drift vs API:** `User.isActive` (API: `status`), `Payment.rentalId` (API: `rentalRequestId`), `Review.rentalId`, `Category.description/updatedAt` (not in API until B1), `Decimal` values arrive as strings (until B1.1), `averageRating` is `null`. | F0 |
| S9 | 🟡 | Navbar mobile link `/account` → 404; `dashboardHref()` has dead duplicate `case`s; `getInitials` defined twice; `dashboardFor()` copy-pasted 3× (login, register, proxy). | F0 |
| S10 | 🟡 | `ThemeToggle` uses `theme === "light"`; with `defaultTheme="system"` the first click may do nothing. Use `resolvedTheme`. | F0 |
| S11 | 🟡 | Tenant "Payment History" status pill classes produce same-colour text/background. | F4 |
| S12 | 🟡 | Home server fetch doesn't check `res.ok`; `export const dynamic = "force-dynamic"` disables all caching for public data. | F7 |
| S13 | 🟡 | Newsletter form simulates success; blog "Share" buttons do nothing; footer socials `#`; FloatingActions "AI Assistant coming soon" toast. | F2/F5/F6 |
| S14 | 🟡 | `PropertyForm` manages dynamic arrays with `useState` counters + `splice` on `getValues` (index/ordering bugs). Use `useFieldArray`. | F4 |
| S15 | 🟡 | Duplicates to delete: `ui/loading-skeleton` `CardSkeleton` vs `shared/card-skeleton`; `lib/schemas/rental.ts` vs `rental.schema.ts`; `layout/Avatar.tsx` user-menu vs the same block in `Navbar.tsx`. | F0 |

---

## 3. Phase plan (dependency-ordered, independently gated)

```
F0 Foundations ─▶ F1 Auth & security ─▶ F2 Public shell/landing ─▶ F3 Listing & details
        │                                         (needs B3.6b, B1.7)      (needs B1)
        └──────────────▶ F4 Dashboards (needs B1, B3, B5) ─▶ F5 Forms & pages (needs B4)
                                              F6 Wishlist · AI assistant · Google (needs B6, B7)
                                              F7 Performance, SEO, a11y, tests, docs, deploy
```

---

### F0 — Foundations: design system, shared libs, API client *(no visible features)*

**Requires:** B1.1 (numbers) for final types — until then normalise in the client.

- [ ] **F0.1 Design tokens** (`globals.css`): keep **3 brand colors** — `primary` (indigo), `secondary`, `accent` — plus neutrals and semantic `success/warning/destructive`. Remove all raw palette classes and `hue-rotate-*` hacks (grep `bg-(blue|green|red|emerald|purple|yellow)-`). Dark mode: lift `--card` above `--background`, verify AA contrast (≥ 4.5:1) for text and badges.
- [ ] **F0.2 Radius & spacing:** one radius token — `rounded-xl` for Button, Input, Select, Textarea, Card, Dialog, Dropdown; `rounded-full` only for avatars/pills. Spacing on a 4/8px scale (no arbitrary px values).
- [ ] **F0.3 Typography:** add `<PageHeader title description actions />` and `<SectionHeading />`; fixed scale (h1 `text-4xl md:text-5xl`, h2 `text-3xl`, h3 `text-xl`, body `text-base`, caption `text-sm`).
- [ ] **F0.4 New reusable UI:** `ui/badge.tsx` (variants map to tokens; refactor `status-badge.tsx` onto it), `ui/table.tsx`, `ui/select.tsx`, `ui/textarea.tsx`, `ui/tabs.tsx`, `ui/carousel.tsx`, **`DataTable`** (`@tanstack/react-table`; props: `columns`, `data`, optional `meta` for **server** pagination, search box, column sort, filter slot, row-actions menu with View/Edit/Delete). One table implementation for the whole app.
- [ ] **F0.5 Shared libs** (single source of truth — kill duplicates, S9/S15): `lib/roles.ts` (`dashboardFor`, role labels), `lib/format.ts` (`formatCurrency`, `formatDate`, `getInitials`), `lib/errors.ts` (`getErrorMessage(unknown)`, `applyServerErrors(form, errorDetails)`), `lib/env.ts` (Zod-validated `NEXT_PUBLIC_API_BASE_URL`; **throws in production if missing — no localhost fallback**), `lib/server-api.ts` (`serverFetch` with `next: { revalidate, tags }`, used by every server component).
- [ ] **F0.6 `api-client.ts`:** fix S2 — on 401 **always** try refresh once, then honour `skipAuthRedirect`; normalise `Decimal` strings → `number` for known money fields; export typed helpers.
- [ ] **F0.7 Server-state hooks (TanStack Query, already installed):** `hooks/api/` — `useProperties`, `useRentals`, `usePayments`, `useLandlordProperties`, `useLandlordRequests`, `useCategories`, `useStats`… Each wraps `api.*` with query keys, `select`, retry rules and **optimistic mutations** (request approve/reject, property status toggle). Replace the repeated `useEffect + useState + try/catch + toast` blocks.
- [ ] **F0.8 Types:** sync `src/types` with the Postman/Prisma contract (S8): `User.status` (`ACTIVE|BANNED`), `Payment.rentalRequestId`, `Review.rentalRequestId`, `averageRating: number`, `Paginated<T>`; remove `any` in `catch` clauses.
- [ ] **F0.9 Tooling:** ESLint (`next/core-web-vitals`, `no-console`, `@typescript-eslint/no-explicit-any`), Prettier, `npm run lint`; `next.config` → `compiler.removeConsole: { exclude: ["error"] }`; fix `components.json` (no `tailwind.config.ts` in v4).
- [ ] **F0.10** Fix `ThemeToggle` (`resolvedTheme`), memoise `AuthContext` value (`useMemo`/`useCallback`), delete duplicates (S15).

**Gate F0:** `grep -R "bg-\(blue\|green\|red\|emerald\|purple\)-" src` → 0 hits · `grep -R "console\." src` → only allow-listed · app starts with no env → fails with a clear message · leaving the site idle until the access cookie expires, then reloading keeps the user logged in · charts' CSS vars resolve.

> **Agent prompt:** *"Read `PROJECT_UPGRADE.md`. Implement phase F0 only. Before creating any component, search for an existing one. Show `git diff --stat` and the gate greps, then stop."*

---

### F1 — Authentication & route-security hardening

**Requires:** B0.5 (password policy), B1.8 (demo accounts). S1/S3 need **no** backend change.

- [ ] **F1.1 First-party cookies (S3):** `next.config.mjs` `rewrites: /api/:path* → ${API_ORIGIN}/api/:path*`; `NEXT_PUBLIC_API_BASE_URL=/api` in the browser, absolute origin on the server. Backend: cookie `domain`/`sameSite=lax` becomes safe once same-site. Update `.env.example`.
- [ ] **F1.2 Secure `proxy.ts` (S1):** read the httpOnly `accessToken` cookie (now visible), verify the JWT with **`jose`** + server-only `JWT_ACCESS_SECRET`, check `exp` and `role`; on expired access + valid `refreshToken` call refresh then continue. **Stop trusting `rn_role`** (keep it only as a UI hint, never for authorisation). Role mismatch → redirect to own dashboard; unauthenticated → `/auth/login?returnTo=`.
- [ ] **F1.3 Password UX (PDF §6):** shared `passwordSchema` (≥ 8, upper, lower, digit) in `lib/schemas/auth.schema.ts`, `<PasswordInput />` (show/hide) + `<PasswordStrength />` meter on Register, Profile and (later) Reset forms. Profile change requires `currentPassword` + `confirmPassword`.
- [ ] **F1.4 Server-error mapping:** every auth/profile/rental/property form uses `applyServerErrors` so backend `errorDetails[].field` lands under the right input (`setError`), plus one summary toast.
- [ ] **F1.5 Register form:** add optional phone; avatar upload added in F4 (needs B5). Keep role cards, labels `htmlFor`, `aria-invalid`.
- [ ] **F1.6 Demo login:** buttons use the seeded credentials from B1.8; hide them when `NEXT_PUBLIC_ENABLE_DEMO_LOGIN !== "true"`.
- [ ] **F1.7** `returnTo` hardening: accept only same-origin relative paths (open-redirect guard) in login.

**Gate F1:** manually setting `rn_role=ADMIN` as a tenant and visiting `/dashboard/admin` → redirected · logging in on Safari/iOS works (cookies first-party) · weak password blocked client-side **and** server-side with matching messages · demo buttons log in successfully.

> **Agent prompt:** *"Implement F1 only. Explain how the proxy now authenticates before coding it. Do not trust any client-writable cookie for authorisation."*

---

### F2 — Public shell & landing page (real data only)

**Requires:** B3.6b (`/stats`), B1.7 (`/reviews`), B6.3 (`/properties/featured`; fall back to `?limit=4`).

- [ ] **F2.1 Navbar:** logged-out → Home, Properties, About, Blog, Contact + Login/Sign-up. Logged-in → Home, Properties, **Dashboard**, Blog, Contact + avatar dropdown (Profile, Dashboard, Saved, Logout) ⇒ ≥ 6 items. Extract `<UserMenu />` used by both public navbar and dashboard header (delete the duplicate), fix mobile `/account` link (S9), full-width sticky header.
- [ ] **F2.2 Hero 60–70 vh:** `lg:h-[65vh] min-h-[480px]`; real interactive element = **featured-property carousel** (`ui/carousel`) + animated counters bound to `/stats`. Headline/subheading/CTA hierarchy retained.
- [ ] **F2.3 Sections (target 10, every one data- or purpose-backed):**
  1. Hero · 2. **Live stats** (`/stats`) · 3. **Browse by category** (`/categories` with counts → `/properties?categoryId=`) · 4. Featured listings (**4 per row**) · 5. How it works · 6. For tenants / landlords (single `Tabs` section) · 7. **Testimonials** from real reviews (`/reviews`; hide section when empty) · 8. Rental guides (blog) · 9. **FAQ** (accordion, real policy content) · 10. Newsletter (wired in F5) · 11. CTA.
  Remove the invented stats, the duplicate "Features" block, and any claim the product doesn't deliver (verified landlords, bank payouts). Delete `hue-rotate` / `-scale-x-100` hacks.
- [ ] **F2.4 Footer:** real social URLs from `lib/site-config.ts` (env-driven), real support email/phone/address (or omit), remove "Admin Login" link, add FAQ/Help link; every link must resolve (no `#`).
- [ ] **F2.5 About page:** replace hard-coded "10k+ / 25k+ / 99 %" with `/stats`.
- [ ] **F2.6** Lottie: dynamic-import (`ssr:false`) + render only when in viewport; max one per screen.

**Gate F2:** Lighthouse mobile perf ≥ 80 on `/` · no invented numbers (stats change when DB changes) · hero measures 60–70 % of viewport at 1280×800 · footer link-checker finds 0 broken links.

---

### F3 — Explore page, cards & property details

**Requires:** B1.3–B1.5 (filters, meta, details shape), B1.1.

- [ ] **F3.1 `PropertyCard` rewrite:** `next/image` (`fill`, `sizes`, blur placeholder, fallback), image, title, **2-line description** (`line-clamp-2`), meta (price/month, location, beds, baths, rating), **"View Details" button** (`Button asChild`), save button, equal height (`h-full flex-col`, footer pinned). Reuse on home/explore/similar/saved.
- [ ] **F3.2 Grid:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`; move filters into a **top filter bar + mobile Sheet** (sidebar steals the 4th column). `CardSkeleton` mirrors the card; single skeleton component.
- [ ] **F3.3 Filters (URL = source of truth):** search (title/description), location, category, min/max price, bedrooms (`N+`), amenities multi-select, sort (newest / price asc|desc / title). **Debounce 400 ms** (`useDebouncedValue`), no per-keystroke pushes, "Clear all" + active-filter chips. **Delete** the local re-filtering and the dead `status` filter (S6); use the server `meta` untouched.
- [ ] **F3.4 Pagination:** numbered pages + prev/next, page-size 12; preserves filters; scrolls to results.
- [ ] **F3.5 Details page:** `PropertyGallery` (main image + thumbnails + lightbox/keyboard nav, swipe on mobile); specs grid (type, rent, beds, baths, status, listed date); amenities; real landlord card (name, listings count, member-since from API); reviews with avg + distribution; similar properties; breadcrumb; share button (Web Share API / copy link).
- [ ] **F3.6 `RentCTA` (S7):** disabled + explanatory text when `status !== "AVAILABLE"` or viewer is the landlord; remove misleading `*`; strip empty strings before POST; map backend 409 text; link to login with `returnTo`.
- [ ] **F3.7 SEO:** `generateMetadata` per property (title, description, OG image), JSON-LD `Residence`/`Offer`.

**Gate F3:** 4 cards/row at ≥ 1280 px with equal heights · changing filters → one request, URL updates, count/total pagination correct · unavailable property shows disabled CTA · every card has a visible "View Details" button.

---

### F4 — Role dashboards, tables, charts, profile

**Requires:** B1.3 (paginated lists), B3 (admin + stats), B5 (uploads).

- [ ] **F4.1 Sidebars:** Tenant — Overview, My Requests, Payments, Saved, Profile (≥ 4). Landlord — Overview, Properties, Requests, Earnings, Profile. **Admin (≥ 6)** — Overview, Users, Properties, Rental Requests, Payments, Categories, Messages, Settings. Make sure every link has a page (🔍 confirm `/dashboard/admin/users` & `/moderation`; rename *Moderation* → *Properties* if merged). Use `#hash` links only for real anchors.
- [ ] **F4.2 `DataTable` adoption (PDF §7):** replace every hand-written table: landlord properties/requests, tenant requests/payments, admin users/properties/rentals/payments/categories/messages. Each has **pagination + sort + search/filter + row actions (View / Edit / Delete)**; server-side where the API returns `meta`, client-side otherwise.
- [ ] **F4.3 Admin overview:** cards from `/admin/stats.totals` (users, properties, rentals, revenue); **Bar** (properties by category), **Line** (monthly users/rentals/revenue), **Pie** (rentals by status). Remove the hard-coded "Operational" card and the "Dashboard Scope" note.
- [ ] **F4.4 Admin pages:** **Users** (search, role/status filters, Ban/Unban with `ConfirmDialog` + optimistic update + toast); **Properties** moderation (unpublish, feature toggle, delete); **Rentals/Payments** read-only tables; **Messages** (status chips: New/Read/Resolved).
- [ ] **F4.5 Landlord:** cards + line chart from `/landlord/stats` (earnings = real payments, not `rentAmount` estimates); requests table keeps optimistic approve/reject/complete; `PropertyForm` migrated to **`useFieldArray`** (S14) and an `ImageUploader`.
- [ ] **F4.6 Tenant:** add a **spend-per-month bar chart** from payments; fix status pill (S11) via `PaymentStatusBadge`; request detail unchanged.
- [ ] **F4.7 Charts:** one `<ChartCard>` wrapper using `var(--primary)` tokens (S5), responsive, empty-state, `ResponsiveContainer` dynamic-imported (code splitting).
- [ ] **F4.8 Profile page:** `ImageUploader` (preview, progress, remove) using `POST /uploads/sign` → direct Cloudinary upload (`useImageUpload` hook, 2 MB limit, jpeg/png/webp); password section with current/new/confirm + strength meter; unsaved-changes guard.
- [ ] **F4.9** Route-level `loading.tsx` + `error.tsx` for `landlord`, `admin`, `account`; global `app/error.tsx` and `global-error.tsx`.

**Gate F4:** each role's sidebar meets the minimum and every link renders a page · every table sorts/paginates/filters and exposes row actions · charts match `/admin/stats` numbers · banning a user from the UI blocks their next request · avatar upload persists after refresh.

---

### F5 — Forms standard, additional pages, newsletter

**Requires:** B4.

- [ ] **F5.1 Contact page:** call `POST /contact` via a mutation hook; honeypot field; field-level server errors; success state; remove `setTimeout` and `console.log`; use `FormField` + a new `FormTextarea` for DRY.
- [ ] **F5.2 Newsletter:** `useNewsletter` → `POST /newsletter`; inline validation, loading, success/duplicate messages.
- [ ] **F5.3 Help/FAQ page** (`/help`): searchable accordion, linked from navbar/footer; reuse the landing FAQ data from `lib/data/faq.ts` (one source).
- [ ] **F5.4 Blog:** real **Share** (X/Facebook/LinkedIn/copy-link) replacing dead buttons; fix content that references non-existent statuses (`CANCELLED`, "verified income"); typed `content: string`; `generateMetadata` per post.
- [ ] **F5.5 Forms audit (PDF §1)** — tick each of Login, Register, Contact, Create property, Edit property, Profile for: client validation · server errors on fields · success message · loading state · `label htmlFor` · `aria-invalid/aria-describedby` · disabled-while-submitting.
- [ ] **F5.6** Privacy/Terms: make company name/address/email come from `site-config`; keep "last updated" in one constant.

**Gate F5:** a contact submission appears in `/dashboard/admin/messages` · all six forms pass the audit checklist.

---

### F6 — Wishlist (server-backed), AI assistant, optional Google login

**Requires:** B6 (favorites). Google needs B7.1. Both extras are optional; ship in this order.

- [ ] **F6.1 Wishlist → server:** replace localStorage hook with `useFavorites` (React Query + optimistic toggle). One-time migration of the old `rentnest_wishlist` key on first login, then delete it. Saved page shows live status (RENTED badge etc.) (S4). Landlord/admin never see the heart.
- [ ] **F6.2 AI property assistant (replaces the "coming soon" placeholder, S13):** `app/api/assistant/route.ts` (server-only `GEMINI_API_KEY`, per-IP rate limit) → model converts a natural-language request ("2-bed under 20k near Gulshan with wifi") into **validated filter JSON** (Zod) → we call the real `/properties` API → UI renders property cards inside the chat panel (`FloatingActions` opens a `Sheet`). No fabricated listings: the model only produces filters/explanations. Hide the button if the key is missing.
- [ ] **F6.3 Google login (PDF bonus, optional):** Google Identity Services button on Login/Register → `POST /auth/google`; first-time users choose Tenant/Landlord in a dialog.

**Gate F6:** favorites persist across devices · assistant answers "2 bedroom under 20000" with real cards and handles "no results" · no AI key ⇒ button hidden, no console errors.

---

### F7 — Performance, SEO, accessibility, quality, deployment

- [ ] **F7.1 Images:** zero raw `<img>` for remote content (`grep "<img"`) → `next/image` with `sizes`; hero/LCP image `priority`; `loading="lazy"` below the fold; logo `priority`.
- [ ] **F7.2 Caching (S12):** drop `force-dynamic` on `/`; use `serverFetch` with `revalidate: 60` and tags for categories/stats/featured; keep `no-store` only for `searchParams`-driven lists; check `res.ok`.
- [ ] **F7.3 Code-splitting:** `next/dynamic` for Recharts, Lottie, Carousel lightbox, assistant panel; analyse with `@next/bundle-analyzer` (target: first-load JS of `/` < 200 kB gz).
- [ ] **F7.4 Re-renders:** memoised context values, `React.memo` for `PropertyCard`, stable query keys, `useDeferredValue` for table search.
- [ ] **F7.5 SEO:** `app/sitemap.ts` (static + properties), `app/robots.ts`, canonical URLs, OG defaults, `lang`, structured data.
- [ ] **F7.6 Accessibility:** skip-link, focus-visible rings, `aria-label` on every icon-only button, dialogs focus-trap (Radix ✅), colour contrast AA in both themes, `prefers-reduced-motion` for Lottie/counters.
- [ ] **F7.7 Quality:** Vitest for Zod schemas + `lib/*` helpers; Playwright smoke (login → request → pay-stub → dashboard) in CI; GitHub Action: `typecheck`, `lint`, `test`, `build`.
- [ ] **F7.8 Deployment:** required env on Vercel (`NEXT_PUBLIC_API_BASE_URL`, `API_ORIGIN`, `JWT_ACCESS_SECRET`, `GEMINI_API_KEY`, site-config vars); **no localhost anywhere** (`grep -R "localhost" src` → 0); Stripe success/cancel pages verified with the backend's new redirect + `POST /payments/sync` fallback (poll → sync after 6 s).
- [ ] **F7.9 README rewrite:** correct env table, Next 16, real clone URL, architecture, scripts, demo credentials, screenshots, "ForegX compliance" checklist, live links.

**Gate F7:** Lighthouse (mobile) Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95 on `/`, `/properties`, `/properties/[id]` · CI green · production build has no console output on happy paths.

---

## 4. Backend contract the frontend depends on (Backend Asks)

| # | Need | Backend phase | Frontend usage | If missing, the UI… |
|---|---|:-:|---|---|
| A1 | Money fields as numbers; `meta` on list endpoints | B1.1 / B1.3 | all tables/cards | normalises client-side (temporary) |
| A2 | `bedrooms ≥`, `amenities`, sort whitelist, parsed query | B1.4 | F3 filters | hides amenities filter |
| A3 | Seeded demo landlord/tenant + real data | B1.8 | F1.6, F2 | hides demo buttons |
| A4 | Frontend redirect + `rentalId` + `POST /payments/sync` | B2 | payment pages | polling only (legacy) |
| A5 | `/admin/*`, `/admin/stats`, `/landlord/stats`, `/stats` | B3 | F2, F4 | **hides** the section (never fake) |
| A6 | `/reviews`, `/properties/featured` | B1.7 / B6.3 | landing | hides testimonials / uses newest |
| A7 | `/contact`, `/newsletter` | B4 | F5 | form disabled with notice |
| A8 | `/uploads/sign` | B5 | profile/property images | falls back to URL input |
| A9 | `/favorites` | B6 | F6.1 | wishlist stays local |
| A10 | `/auth/google`, forgot/reset | B7 | F6.3 | button hidden |

---

## 5. Definition of Done (frontend)

- [ ] Compliance matrix: no ❌ remaining; every 🟡 resolved or justified in README.
- [ ] Only the 3 brand tokens (+ semantic) in use; light/dark verified on every page; 375/768/1280 px with no horizontal scroll.
- [ ] One `DataTable`, one `Badge`, one skeleton, one `UserMenu`, one rental schema — no duplicates.
- [ ] No dummy/fake/placeholder content, no `localhost`, no `console.*`, no `any`.
- [ ] All six required forms pass the forms audit.
- [ ] Live site verified with the **live backend** (login, request, Stripe test payment, review, admin ban).
- [ ] README rewritten; 20+ meaningful commits; Lighthouse targets met.
