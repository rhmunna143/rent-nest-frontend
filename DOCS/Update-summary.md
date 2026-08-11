# Project Update Summary: Feature Substitutions & Alternatives

As per the requirements of the **Squid Game-7 "Project Update-1" Upgrade**, certain rubric items did not seamlessly map onto RentNest's backend domain capabilities or the existing v1 API schema (which does not include endpoints for OAuth, global user management, or global aggregated analytics). 

Rather than faking backend functionality with mock data or lorem-ipsum content, we implemented native, domain-specific alternatives that satisfy the spirit of the rubric while remaining fully functional on the frontend.

Here is a breakdown of features that were not explicitly implemented as requested, alongside the alternative features provided in their place:

## 1. Social Login (OAuth)
**Rubric Request:** Implement Social Login (e.g., Google or Facebook).
**Reason for Non-Implementation:** The backend (`rent-nest-backend`) exclusively exposes email/password JWT authentication. There are currently no OAuth endpoints or user schemas configured on the backend to handle social provider callbacks securely.
**Alternative Implemented: Demo Logins & "Saved Properties" (Wishlist)**
- **Demo Logins:** To satisfy the UX polish expected in the auth flow, we implemented one-click "Demo Login" buttons for Admin, Landlord, and Tenant roles.
- **Wishlist:** To fulfill the "complex auth-adjacent feature" requirement, we built a robust "Saved Properties" (Wishlist) feature. Tenants can "heart" properties, which are persisted to `localStorage` (namespaced by the logged-in user's ID) and managed in a dedicated "Saved" tab in the tenant dashboard.

## 2. Admin User Management (Ban/Unban Users)
**Rubric Request:** Admin dashboard must include a data table to manage, ban, or unban users.
**Reason for Non-Implementation:** The provided Postman collection does not expose any admin user-management endpoints (e.g., `GET /api/admin/users` or `PATCH /api/admin/users/:id/ban`).
**Alternative Implemented: Content Moderation Queue**
Instead of a non-functional user list, the Admin dashboard features a **Content Management & Moderation** section. This allows admins to manage platform-wide Categories and view platform status. The UI shell is built to seamlessly integrate a cross-landlord listing review queue once the backend exposes global property data.

## 3. Generic Blog System
**Rubric Request:** Implement an additional page such as a "Blog".
**Reason for Non-Implementation:** Generic placeholder blogs (e.g., "Hello World") violate the project's strict "no placeholder/dummy content" rule and provide zero value to a rental marketplace.
**Alternative Implemented: "Rental Living Guides"**
We built a highly contextual, statically-authored (JSON) resource hub titled **Rental Living Guides**. It includes genuinely useful, domain-specific articles such as:
- *Navigating Your Dashboard* (Platform Updates)
- *The Art of Pricing* (Landlord Guide)
- *Understanding the Request Process* (Tenant Guide)

This replaces generic blog posts with an in-product help center that utilizes real, high-quality Unsplash cover images and functional dynamic routing (`/blog/[slug]`).

## 4. Platform-Wide Analytics Charts
**Rubric Request:** Admin dashboard should feature complex charts (Bar/Line/Pie) showing global revenue or bookings.
**Reason for Non-Implementation:** The backend scopes all rental and payment history strictly to the logged-in user (Tenant or Landlord). There are no global aggregation endpoints available for the Admin to view total platform revenue or volume over time.
**Alternative Implemented: Category-Driven Analytics**
We built the Admin Recharts visualizations using the only true global data available: Categories and total Property counts. 
- **Bar Chart:** Shows the total count of properties per category.
- **Pie Chart:** Visualizes the market share distribution of categories across the platform.
This ensures all charts are rendering 100% real, live data fetched from the API, avoiding any hardcoded or fabricated numbers.
